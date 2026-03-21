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
          <div className="pedidos-table-container">
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Medio de Pago</th>
                  <th>Forma de Entrega</th>
                  <th>Monto Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.idPedido} className={`estado-${pedido.estadoPedido?.toLowerCase()}`}>
                    <td className="pedido-id">#{pedido.idPedido}</td>
                    <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                    <td>
                      <span className={`estado-badge ${pedido.estadoPedido?.toLowerCase()}`}>
                        {obtenerTextoEstado(pedido.estadoPedido || "")}
                      </span>
                    </td>
                    <td>{pedido.medioPago || "N/A"}</td>
                    <td>{pedido.formaEntrega || "N/A"}</td>
                    <td>${pedido.montoTotal || 0}</td>
                    <td>
                      <Link
                        to={`/detalleCliente`}
                        state={{ idPedido: pedido.idPedido }}
                        className="btn-ver-detalles"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
