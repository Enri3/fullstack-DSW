import React from "react";
import { Link } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Header from "../components/header";
import Footer from "../components/footer";
import { obtenerCantidadCarrito } from "../services/cartService";
import "../assets/styles/faq.css";

export default function Faq() {
  const token = localStorage.getItem("token");
  const cantidad = obtenerCantidadCarrito();
  const destinoVolver = token ? "/clienteIngresado" : "/";
  const textoVolver = token ? "Volver al panel" : "Volver a la pagina de inicio";

  return (
    <>
      {token ? <HeaderConPanel cantidad={cantidad} /> : <Header cantidad={0} />}
      <main className="faq-main">
        <section className="faq-card">
          <h1>Preguntas Frecuentes</h1>
          <p className="faq-intro">
            Te dejamos las dudas mas comunes para que compres con tranquilidad.
          </p>

          <div className="faq-lista">
            <article className="faq-item">
              <h2>1. ¿Hacen envios?</h2>
              <p>
                Sí, hacemos envios a toda la ciudad de Rosario. El costo depende de la zona.
              </p>
            </article>

            <article className="faq-item">
              <h2>2. ¿Puedo retirar mi pedido?</h2>
              <p>
                Si, tambien podés coordinar retiro. Al momento de confirmar te indicamos la opción disponible.
              </p>
            </article>

            <article className="faq-item">
              <h2>3. ¿Cuánto tarda en llegar un pedido?</h2>
              <p>
                Los pedidos con stock suelen demorarse entre 2 y 5 días hábiles.
              </p>
            </article>

            <article className="faq-item">
              <h2>4. ¿Y si un producto no tiene stock?</h2>
              <p>
                Si no hay stock, se puede encargar. En ese caso el tiempo estimado es de 5 a 8 días hábiles.
              </p>
            </article>

            <article className="faq-item">
              <h2>5. ¿Que medios de pago aceptan?</h2>
              <p>
                Podés pagar con Mercado Pago o en efectivo, según la modalidad que elijas al cerrar tu compra.
              </p>
            </article>

            <article className="faq-item">
              <h2>6. ¿Puedo cambiar o devolver un producto?</h2>
              <p>
                No realizamos cambios. Sólo gestionamos devoluciones por falla del producto, siempre que se devuelva en condiciones correctas.
              </p>
            </article>

            <article className="faq-item">
              <h2>7. ¿Cómo cuido mejor mis velas de soja?</h2>
              <ul>
                <li>En el primer uso, deja que derrita parejo toda la superficie.</li>
                <li>Cortá la mecha a unos 5 mm antes de volver a encender.</li>
                <li>No la dejes prendida mas de 3 o 4 horas seguidas.</li>
                <li>Mantené la vela lejos de corrientes de aire y de objetos inflamables.</li>
              </ul>
            </article>

            <article className="faq-item">
              <h2>8. ¿Cómo cuidar difusores y home spray?</h2>
              <ul>
                <li>En difusores, girá las varillas cada tanto para mantener el aroma.</li>
                <li>No apoyes el frasco sobre superficies delicadas sin protección.</li>
                <li>En home spray, evitá aplicar directo sobre telas muy sensibles.</li>
                <li>Guardá los productos en lugar fresco y sin sol directo.</li>
              </ul>
            </article>
          </div>

          <div className="faq-volver-wrap">
            <Link to={destinoVolver} className="faq-volver">{textoVolver}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
