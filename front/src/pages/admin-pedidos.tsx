import React, { useEffect, useState } from "react";
import HeaderAdmin from "../components/header_admin";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
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
  const { notificacion, mostrarError } = usarNotificacion();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finalizandoId, setFinalizandoId] = useState<number | null>(null);
  const [vistaActiva, setVistaActiva] = useState<VistaPedidos>("enProceso");
  const [pedidoConfirmacion, setPedidoConfirmacion] = useState<Pedido | null>(null);

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

  const handleAbrirConfirmacion = (pedido: Pedido) => {
    setPedidoConfirmacion(pedido);
  };

  const handleConfirmarFinalizacion = async () => {
    if (!pedidoConfirmacion) return;

    try {
      setFinalizandoId(pedidoConfirmacion.idPedido);
      await updatePedidoEstado(pedidoConfirmacion.idPedido, "finalizado");
      setPedidos((prev) => prev.map((p) => (
        p.idPedido === pedidoConfirmacion.idPedido
          ? { ...p, estadoPedido: "finalizado" }
          : p
      )));
      setPedidoConfirmacion(null);
    } catch (err) {
      console.error("Error al finalizar pedido:", err);
      mostrarError("No se pudo finalizar el pedido");
    } finally {
      setFinalizandoId(null);
    }
  };

  const handleCancelarConfirmacion = () => {
    setPedidoConfirmacion(null);
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
        {notificacion && (
          <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
        )}
        <section className="admin-pedidos-card">
          <div className="admin-pedidos-header">
            <h1>Gestion de pedidos</h1>
            <div className="admin-filtros">
              <button
                type="button"
                className={`admin-filtro-btn ${vistaActiva === "enProceso" ? "activo" : ""}`}
                onClick={() => setVistaActiva("enProceso")}
              >
                En proceso
              </button>
              <button
                type="button"
                className={`admin-filtro-btn ${vistaActiva === "finalizados" ? "activo" : ""}`}
                onClick={() => setVistaActiva("finalizados")}
              >
                Finalizados
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
                      onClick={() => handleAbrirConfirmacion(pedido)}
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

        {pedidoConfirmacion && (
          <div className="modal-overlay" onClick={handleCancelarConfirmacion}>
            <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
              <h2>¿Estás seguro de que quieres finalizar este pedido?</h2>
              <p>Pedido <strong>#{pedidoConfirmacion.idPedido}</strong></p>
              <div className="modal-botones">
                <button
                  type="button"
                  className="modal-btn-confirmar"
                  onClick={handleConfirmarFinalizacion}
                  disabled={finalizandoId === pedidoConfirmacion.idPedido}
                >
                  {finalizandoId === pedidoConfirmacion.idPedido ? "Finalizando..." : "Sí, finalizar"}
                </button>
                <button
                  type="button"
                  className="modal-btn-cancelar"
                  onClick={handleCancelarConfirmacion}
                  disabled={finalizandoId === pedidoConfirmacion.idPedido}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
