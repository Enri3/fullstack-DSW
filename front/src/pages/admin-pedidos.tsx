import React, { useEffect, useState } from "react";
import HeaderAdmin from "../components/header_admin";
import "../assets/styles/admin-pedidos.css";
import { getPedidos, updatePedidoEstado } from "../services/pedidosService";
import type { Pedido } from "../types/Pedido";

type VistaPedidos = "enProceso" | "finalizados";

function getCantidadProductos(pedido: Pedido): number {
  if (!pedido.pedidoProductos || pedido.pedidoProductos.length === 0) return 0;
  return pedido.pedidoProductos.reduce((acc, item) => acc + Number(item.cantidadProdPed || 0), 0);
}

function formatFecha(fecha: Date | string): string {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "Fecha invalida";
  return d.toLocaleString();
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finalizandoId, setFinalizandoId] = useState<number | null>(null);
  const [vistaActiva, setVistaActiva] = useState<VistaPedidos>("enProceso");

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPedidos();
      setPedidos(data);
    } catch (err) {
      console.error("Error al cargar pedidos de administracion:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarPedidos();
  }, []);

  const handleFinalizar = async (pedido: Pedido) => {
    try {
      setFinalizandoId(pedido.idPedido);
      await updatePedidoEstado(pedido.idPedido, "finalizado");
      setPedidos((prev) => prev.map((p) => (
        p.idPedido === pedido.idPedido
          ? { ...p, estadoPedido: "finalizado" }
          : p
      )));
    } catch (err) {
      console.error("Error al finalizar pedido:", err);
      alert("No se pudo finalizar el pedido");
    } finally {
      setFinalizandoId(null);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (vistaActiva === "enProceso") {
      return pedido.estadoPedido === "envio" || pedido.estadoPedido === "retiro";
    }

    return pedido.estadoPedido === "finalizado";
  });

  return (
    <>
      <HeaderAdmin />
      <main className="admin-pedidos-main">
        <section className="admin-pedidos-card">
          <div className="admin-pedidos-header">
            <h1>Gestion de pedidos</h1>
            <div className="admin-filtros">
              <button
                type="button"
                className={`admin-filtro-btn ${vistaActiva === "finalizados" ? "activo" : ""}`}
                onClick={() => setVistaActiva("finalizados")}
              >
                Finalizados
              </button>
              <button
                type="button"
                className={`admin-filtro-btn ${vistaActiva === "enProceso" ? "activo" : ""}`}
                onClick={() => setVistaActiva("enProceso")}
              >
                En proceso
              </button>
            </div>
          </div>

          {loading && <p>Cargando pedidos...</p>}
          {error && <p className="admin-pedidos-error">{error}</p>}

          {!loading && !error && pedidosFiltrados.length === 0 && (
            <p className="admin-pedidos-empty">
              {vistaActiva === "enProceso"
                ? "No hay pedidos en estado envio o retiro."
                : "No hay pedidos finalizados."}
            </p>
          )}

          {!loading && pedidosFiltrados.length > 0 && (
            <div className="admin-pedidos-lista">
              {pedidosFiltrados.map((pedido) => (
                <article key={pedido.idPedido} className="admin-pedido-item">
                  <div className="admin-pedido-info-grid">
                    <div className="admin-pedido-col-left">
                      <p><strong>Cliente:</strong> {pedido.cliente ? `${pedido.cliente.nombreCli} ${pedido.cliente.apellido}` : `Cliente #${pedido.idCli}`}</p>
                      <p className="admin-fecha-linea"><strong>Fecha:</strong> {formatFecha(pedido.fechaPedido)}</p>
                    </div>
                    <div className="admin-pedido-col-right">
                      <p><strong>Cantidad de productos:</strong> {getCantidadProductos(pedido)}</p>
                      <p>
                        <strong>Estado:</strong> {pedido.estadoPedido}
                        {pedido.medioPago === "efectivo" ? ` | Vuelto: $${Number(pedido.vuelto || 0).toFixed(2)}` : ""}
                      </p>
                    </div>
                  </div>

                  {vistaActiva === "finalizados" && (
                    <div className="admin-finalizado-detalle">
                      <p><strong>Total:</strong> ${Number(pedido.montoTotal || 0).toFixed(2)}</p>
                      <p><strong>Pago:</strong> {pedido.medioPago || "N/D"}</p>
                      <p><strong>Entrega:</strong> {pedido.formaEntrega || "N/D"}</p>
                    </div>
                  )}

                  {vistaActiva === "enProceso" && (
                    <button
                      type="button"
                      className="admin-finalizar-btn"
                      onClick={() => void handleFinalizar(pedido)}
                      disabled={finalizandoId === pedido.idPedido}
                    >
                      {finalizandoId === pedido.idPedido ? "Finalizando..." : "Finalizar"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
