import { useEffect, useState } from "react";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import { obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import { getPedidosByIdCliente } from "../services/pedidosService";
import type { Pedido } from "../types/Pedido";
import type { Cliente } from "../types/Cliente";
import { clienteVacio } from "../types/Cliente";
import '../assets/styles/historialPedidos.css';

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

export default function HistorialPedidos() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [cliente, setCliente] = useState<Cliente>(clienteVacio);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 5;

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
        setLoading(true);
        const todosLosPedidos = await getPedidosByIdCliente(cliente.idCli);
   
        const pedidosCompletados = todosLosPedidos
          .filter((p) => p.estadoPedido !== "enCarrito")
          .sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
        setPedidos(pedidosCompletados);
      } catch (err) {
        console.error("Error al obtener pedidos:", err);
        setError("No se pudo cargar el historial de pedidos.");
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, [cliente.idCli]);

  // Paginación
  const totalPaginas = Math.max(1, Math.ceil(pedidos.length / pedidosPorPagina));
  const indiceInicio = (paginaActual - 1) * pedidosPorPagina;
  const indiceFin = indiceInicio + pedidosPorPagina;
  const pedidosPaginados = pedidos.slice(indiceInicio, indiceFin);

  const irAPagina = (pagina: number) => {
    if (pagina < 1) pagina = 1;
    if (pagina > totalPaginas) pagina = totalPaginas;
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="historial-container">
        <div className="historial-header">
          <h1>Historial de Pedidos</h1>
        </div>

        {loading ? (
          <p className="loading">Cargando pedidos...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : pedidos.length === 0 ? (
          <div className="no-pedidos">
            <p>No tienes pedidos aún.</p>
            <Link to="/productosCliente" className="btn-primary">Realizar tu primer pedido</Link>
          </div>
        ) : (
          <>
            <div className="pedidos-cards-container">
              {pedidosPaginados.map((pedido) => (
                <div key={pedido.idPedido} className={`pedido-card estado-${pedido.estadoPedido?.toLowerCase()}`}>
                  <div className="pedido-card-header">
                    <div>
                      <h3 className="pedido-id">Pedido #{pedido.idPedido}</h3>
                      <p className="pedido-fecha">{new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                    </div>
                    <span className={`estado-badge ${pedido.estadoPedido?.toLowerCase()}`}>
                      {obtenerTextoEstado(pedido.estadoPedido || "")}
                    </span>
                  </div>

                  <div className="pedido-card-body">
                    <div className="pedido-info">
                      <span className="info-label">Medio de Pago:</span>
                      <span className="info-value">{pedido.medioPago || "N/A"}</span>
                    </div>
                    <div className="pedido-info">
                      <span className="info-label">Forma de Entrega:</span>
                      <span className="info-value">{pedido.formaEntrega || "N/A"}</span>
                    </div>
                  </div>

                  <div className="pedido-card-footer">
                    <div className="monto-total">
                      <span className="label">Monto Total:</span>
                      <span className="valor">${pedido.montoTotal || 0}</span>
                    </div>
                    <Link
                      to={`/detallePedido/${pedido.idPedido}`}
                      className="btn-ver-detalles"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacion">
                <button onClick={() => irAPagina(paginaActual - 1)} disabled={paginaActual === 1} className="btn-paginacion">← Anterior</button>
                <div className="numeros-paginas">
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                    <button key={num} onClick={() => irAPagina(num)} className={`btn-numero ${paginaActual === num ? 'activa' : ''}`}>{num}</button>
                  ))}
                </div>
                <button onClick={() => irAPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="btn-paginacion">Siguiente →</button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
