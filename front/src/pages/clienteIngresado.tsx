import { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import logo from "../assets/img/logo.png";
import { getNombreTipo } from "../services/tipo_usuarioService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import '../assets/styles/clienteIngresado.css';
import { Link, useLocation } from "react-router-dom";
import MensajeAlerta from "../components/mensajesAlerta";
import type { Cliente } from "../types/Cliente";
import { clienteVacio } from "../types/Cliente";
import { getPedidosByIdCliente } from "../services/pedidosService";
import type { Pedido } from "../types/Pedido";

function obtenerTextoEstado(estado: string): string {
  switch (estado) {
    case "envio":
      return "Confirmado para envío";
    case "retiro":
      return "Confirmado para retiro";
    case "finalizado":
      return "Entregado";
    default:
      return estado;
  }
}

export default function ClienteIngresado() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [tipoNombre, setTipoNombre] = useState<string>("");
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "success" | "error" | "info" } | null>(null);
  const [pedidosRecientes, setPedidosRecientes] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const location = useLocation();

  useEffect(() => {

    if (location.state && location.state.mensaje) {
      setMensaje(location.state.mensaje);
      window.history.replaceState({}, document.title); 
    }
  }, [location]);

  useEffect(() => {
    const storedCliente = localStorage.getItem("cliente");
    if (storedCliente) {
      setCliente(JSON.parse(storedCliente));
    }
  }, []);

  useEffect(() => {
    if (!cliente.idCli) return;

    const cargarPedidos = async () => {
      try {
        setLoadingPedidos(true);
        const todosLosPedidos = await getPedidosByIdCliente(cliente.idCli);
        // Mostrar últimos 3 pedidos realizados (envio, retiro, finalizado)
        // Excluye solo "enCarrito" que es el carrito actual sin confirmar
        const pedidosRealizados = todosLosPedidos
          .filter((p) => p.estadoPedido !== "enCarrito")
          .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime())
          .slice(0, 3);
        setPedidosRecientes(pedidosRealizados);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        setPedidosRecientes([]);
      } finally {
        setLoadingPedidos(false);
      }
    };

    cargarPedidos();
  }, [cliente.idCli]);

  useEffect(() => {
    if (!cliente.idTipoCli) return;

    switch (cliente.idTipoCli) {
      case 1:
        setTipoNombre("Administrador");
        break;
      case 2:
        setTipoNombre("Inicial");
        break;
      case 3:
        setTipoNombre("Premium");
        break;
      default:
        setTipoNombre("Desconocido");
        break;
    }
  }, [cliente]);

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
      {mensaje && <MensajeAlerta tipo={mensaje.tipo} texto={mensaje.texto} />}

      <div className="dashboard-container">
        <section className="welcome-section">
          <h1 className="welcome-title">Bienvenido, {cliente.nombreCli} {cliente.apellido}!</h1>
          <p className="client-status">
            <strong>Tipo de Cliente:</strong> {tipoNombre}
          </p>
        </section>

        <div className="cta-grid">
          <Link to="/productosCliente" className="cta-card cta-new">
            <i className="icon">🛒</i>
            <h3>Realizar Nuevo Pedido</h3>
            <p>Explorá nuestros productos y comenzá a comprar.</p>
          </Link>

          <Link to="/mis-facturas" className="cta-card cta-invoice">
            <i className="icon">🧾</i>
            <h3>Ver Mis Facturas</h3>
            <p>Accedé y descargá tu historial de pagos.</p>
          </Link>
          <Link to="/carrito" className="cta-card cta-history">
            <i className="icon">📦</i>
            <h3>Historial de Pedidos</h3>
            <p>Revisá el estado de tus compras pasadas.</p>
          </Link>
        </div>

        <div className="info-layout">
          <section className="recent-activity">
            <h2>Pedidos Recientes</h2>
            {loadingPedidos ? (
              <p>Cargando pedidos...</p>
            ) : pedidosRecientes.length === 0 ? (
              <p>No tenés pedidos recientes.</p>
            ) : (
              <div className="pedidos-list">
                {pedidosRecientes.map((pedido) => (
                  <div key={pedido.idPedido} className="pedido-item">
                    <div className="pedido-header">
                      <span className="pedido-id">Pedido #{pedido.idPedido}</span>
                      <span className={`pedido-estado ${pedido.estadoPedido?.toLowerCase()}`}>
                        {obtenerTextoEstado(pedido.estadoPedido || "")}
                      </span>
                    </div>
                    <p className="pedido-fecha">
                      {new Date(pedido.fechaPedido).toLocaleDateString()}
                    </p>
                    <p className="pedido-monto">
                      ${pedido.montoTotal || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link to="/historial-pedidos" className="view-all">Ver todos</Link>
          </section>

          <div className="side-panels">
            <section className="account-details">
              <h2>Datos Personales</h2>
              <p><strong>Email:</strong> {cliente.email}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}</p>
              <p><strong>Miembro desde:</strong> {cliente.creado_en ? new Date(cliente.creado_en).toLocaleDateString() : 'N/A'}</p>

              <Link to="/editar-cliente" className="btn-secondary">Editar Perfil</Link>
              <Link to="/cambiar-password" className="btn-secondary">Cambiar Contraseña</Link>
            </section>

            <section className="support-area">
              <h2>¿Necesitás Ayuda?</h2>
              <div className="support-links">
                <Link to="/faq">Preguntas Frecuentes (FAQ)</Link>
                <Link to="/contacto">Contactar a Soporte</Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}