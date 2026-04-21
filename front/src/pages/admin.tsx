import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderAdmin from "../components/header_admin";
import logo from "../assets/img/logo.png";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/admin.css";
import MensajeAlerta from "../components/mensajesAlerta";
import { getPedidos } from "../services/pedidosService";

import type { Cliente } from "../types/Cliente";
import type { Pedido } from "../types/Pedido";
import { clienteVacio } from "../types/Cliente";

export default function Admin() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [mensaje, setMensaje] = useState<{ tipo: "success" | "error" | "info"; texto: string } | null>(null);
  const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const storedCliente = localStorage.getItem("cliente");
    if (storedCliente) {
      setCliente(JSON.parse(storedCliente));
    }

    if (location.state && location.state.mensaje) {
      setMensaje(location.state.mensaje);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const todos = await getPedidos();
        // Filtrar pedidos NO finalizados ni en carrito
        const pendientes = todos
          .filter((p) => p.estadoPedido !== "finalizado" && p.estadoPedido !== "enCarrito")
          .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime())
          .slice(0, 3);
        setPedidosPendientes(pendientes);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        setPedidosPendientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const obtenerTextoEstado = (estado: string): string => {
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
  };

  return (
    <>
      <HeaderAdmin/>
      <div className="dashboard-container admin-dashboard">

        {mensaje && <MensajeAlerta tipo={mensaje.tipo} texto={mensaje.texto} />}

        <section className="welcome-section admin-welcome">
          <h1 className="welcome-title">Panel de Administración - Administrador</h1>
          <p className="admin-status">Bienvenido, {cliente.nombreCli}.</p>
        </section>

        <h2 className="section-title">Tareas de Gestión</h2>
        <div className="cta-grid admin-cta-grid">
          <Link to="/admin/pedidos" className="cta-card cta-pedidos">
            <i className="icon">📝</i>
            <h3>Gestionar Pedidos</h3>
            <p>Ver y procesar órdenes de compra.</p>
          </Link>
          <Link to="/productosAdmin" className="cta-card cta-productos">
            <i className="icon">📦</i>
            <h3>Inventario y Productos</h3>
            <p>Añadir, editar o eliminar productos.</p>
          </Link>
          <Link to="/eliminar-clientes" className="cta-card cta-clientes">
            <i className="icon">👤</i>
            <h3>Gestión de Clientes</h3>
            <p>Ver y editar cuentas de usuario.</p>
          </Link>
          <Link to="/gestion-descuentos" className="cta-card cta-clientes">
            <i className="icon">📊</i>
            <h3>Gestión de Descuentos</h3>
            <p>Revisar estadísticas de ventas.</p>
          </Link>
        </div>

        <div className="info-layout admin-activity">
          <section className="recent-activity admin-recent-orders">
            <h2>Últimos Pedidos Pendientes</h2>

            {loading ? (
              <p>Cargando pedidos...</p>
            ) : pedidosPendientes.length > 0 ? (
              <div className="pedidos-list">
                {pedidosPendientes.map((pedido) => (
                  <div key={pedido.idPedido} className="pedido-item">
                    <div className="pedido-header">
                      <span className="pedido-id">Pedido #{pedido.idPedido}</span>
                      <span className="pedido-estado" style={{
                        backgroundColor: pedido.estadoPedido === "envio" ? "#4caf50" : "#ff9800"
                      }}>
                        {obtenerTextoEstado(pedido.estadoPedido)}
                      </span>
                    </div>
                    <div className="pedido-detalles">
                      <div className="pedido-cliente">
                        <strong>{pedido.cliente?.nombreCli} {pedido.cliente?.apellido}</strong>
                      </div>
                      <div className="pedido-fecha">
                        {new Date(pedido.fechaPedido).toLocaleDateString()}
                      </div>
                      <div className="pedido-monto">
                        ${pedido.montoTotal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay pedidos pendientes.</p>
            )}

            <Link to="/admin/pedidos" className="view-all">Ver todos los pedidos</Link>
          </section>
        </div>
      </div>
    </>
  );
}