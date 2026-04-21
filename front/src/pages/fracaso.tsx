import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import { obtenerCantidadCarrito } from "../services/cartService";
import { updatePedidoEstado } from "../services/pedidosService";
import "../assets/styles/detallePedido.css";



export default function Fracaso() {


  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const location = useLocation();

  useEffect(() => {
    setCantidad(obtenerCantidadCarrito());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idPedidoParam = params.get("external_reference") || params.get("idPedido");

    if (!idPedidoParam) {
      return;
    }

    const idPedido = Number(idPedidoParam);
    if (Number.isNaN(idPedido)) {
      return;
    }

    const restaurarPedido = async () => {
      try {
        await updatePedidoEstado(idPedido, "enCarrito");
      } catch (error) {
        console.error("No se pudo restaurar el pedido a enCarrito:", error);
      }
    };

    void restaurarPedido();
  }, [location.search]);


  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="detalle-pedido-main">
        <section className="detalle-pedido-card">
          <div >
            
            <h1>Lo sentimos, su pedido no fue realizado</h1>
            <p>El pago no se pudo procesar. Por favor, intente nuevamente.</p>
            <p>Si el problema persiste, contáctese con nuestro soporte.</p>
            <br/>
            <h3><Link className="link-volver" to="/clienteIngresado">
              Volver al inicio
            </Link></h3>
          </div>

         
        </section>
      </main>
      <Footer />
    </>
  );
}
