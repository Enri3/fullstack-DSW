import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/footer";
import { obtenerCantidadCarrito } from "../services/cartService";
import "../assets/styles/detallePedido.css";
import Header_sinCarrito from "../components/header_sinCarrito";



export default function Fracaso() {


  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());


  return (
    <>
      <Header_sinCarrito />
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
