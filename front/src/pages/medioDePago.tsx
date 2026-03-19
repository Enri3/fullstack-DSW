import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import "../assets/styles/medioDePago.css";
import { obtenerCantidadCarrito, reiniciarCarrito } from "../services/cartService";
import { getPedidoEnCarritoByCliente, updatePedidoEstado } from "../services/pedidosService";

type MedioPago = "mercadoPago" | "efectivo";

type MedioPagoState = {
  formaEntrega?: "domicilio" | "retiro";
  direccionCliente?: string;
  totalUnidades?: number;
  totalPrecio?: number;
};

export default function MedioDePago() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as MedioPagoState;

  const [cantidad] = useState(obtenerCantidadCarrito());
  const [medioPago, setMedioPago] = useState<MedioPago | null>(null);
  const [montoEfectivo, setMontoEfectivo] = useState("");
  const esRetiroEnLocal = state.formaEntrega === "retiro";

  const formaEntregaLabel = useMemo(() => {
    if (state.formaEntrega === "domicilio") {
      return `Domicilio: ${state.direccionCliente || "Sin direccion"}`;
    }

    if (state.formaEntrega === "retiro") {
      return "Retiro en local";
    }

    return "No definida";
  }, [state.formaEntrega, state.direccionCliente]);

  const total = Number(state.totalPrecio || 0);
  const montoNumerico = Number(montoEfectivo || 0);
  const vuelto = medioPago === "efectivo" ? Math.max(montoNumerico - total, 0) : 0;

  const handlePagar = async () => {
    try {
      const clienteJSON = localStorage.getItem("cliente");
      if (!clienteJSON) {
        alert("Debes iniciar sesion para pagar");
        return;
      }

      if (!state.formaEntrega) {
        alert("No se encontro la forma de entrega seleccionada");
        return;
      }

      if (!medioPago) {
        alert("Debes seleccionar un medio de pago");
        return;
      }

      if (!esRetiroEnLocal && medioPago === "efectivo") {
        alert("El pago en efectivo solo esta disponible para retiro en local");
        return;
      }

      if (medioPago === "efectivo") {
        if (montoEfectivo === "") {
          alert("Debes ingresar el monto con el que se paga en efectivo");
          return;
        }

        if (Number.isNaN(montoNumerico) || montoNumerico < total) {
          alert("El monto ingresado no puede ser menor al total a pagar");
          return;
        }
      }

      const cliente = JSON.parse(clienteJSON);
      const idCli = Number(cliente?.idCli);
      if (!idCli || Number.isNaN(idCli)) {
        alert("No se pudo identificar el cliente");
        return;
      }

      const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);
      if (!pedidoEnCarrito) {
        alert("No hay pedido en carrito para pagar");
        return;
      }

      const nuevoEstado = state.formaEntrega === "domicilio" ? "envio" : "retiro";
      await updatePedidoEstado(pedidoEnCarrito.idPedido, nuevoEstado, {
        formaEntrega: state.formaEntrega,
        medioPago,
        montoTotal: total,
        montoPagado: medioPago === "efectivo" ? montoNumerico : total,
        vuelto: medioPago === "efectivo" ? vuelto : 0,
      });

      reiniciarCarrito();
      alert("Pago registrado y pedido actualizado correctamente");
      navigate("/clienteIngresado");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("No se pudo procesar el pago");
    }
  };

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="medio-main">
        <section className="medio-card">
          <h1>Elegir medio de pago</h1>

          <div className="resumen-pago">
            <p><strong>Forma de entrega:</strong> {formaEntregaLabel}</p>
            <p><strong>Total unidades:</strong> {Number(state.totalUnidades || 0)}</p>
            <p><strong>Total a pagar:</strong> ${total.toFixed(2)}</p>
          </div>

          <div className="opciones-pago">
            <label className="opcion-pago-item">
              <input
                type="radio"
                name="medioPago"
                value="mercadoPago"
                checked={medioPago === "mercadoPago"}
                onChange={() => setMedioPago("mercadoPago")}
              />
              <span className="opcion-pago-texto">
                <strong>Mercado Pago</strong>
                <span className="detalle-pago">Paga online y recibe confirmacion inmediata.</span>
              </span>
            </label>

            {esRetiroEnLocal && (
              <label className="opcion-pago-item">
                <input
                  type="radio"
                  name="medioPago"
                  value="efectivo"
                  checked={medioPago === "efectivo"}
                  onChange={() => setMedioPago("efectivo")}
                />
                <span className="opcion-pago-texto">
                  <strong>Efectivo</strong>
                  <span className="detalle-pago">Pagas al recibir o retirar el pedido.</span>
                </span>
              </label>
            )}
          </div>

          {esRetiroEnLocal && (
            <div className="efectivo-campo">
              <label htmlFor="montoPago">Monto con el que paga</label>
              <div className="monto-input-wrap">
                <span className="monto-simbolo">$</span>
                <input
                  id="montoPago"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Ingrese el monto"
                  disabled={medioPago !== "efectivo"}
                  value={montoEfectivo}
                  onChange={(e) => setMontoEfectivo(e.target.value)}
                />
              </div>
              {medioPago === "efectivo" && montoEfectivo !== "" && (
                <p className="vuelto">Vuelto estimado: ${vuelto.toFixed(2)}</p>
              )}
            </div>
          )}

          <div className="acciones-pago">
            <Link to="/formaDeEntrega" className="link-secundario">Volver a forma de entrega</Link>
            <button type="button" className="link-principal" onClick={() => void handlePagar()}>
              Pagar
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
