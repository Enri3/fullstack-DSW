import React, { useEffect, useState } from "react";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import { getProductos } from "../services/productosService.js";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService.js";


export default function DisplayProductos() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState([]);

    useEffect(() => {
    
  }, []);

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);


  function handleAgregar(producto) {
    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  }

  return (
    <>
      <Header cantidad={cantidad} />
      <main>
        <section id="productos-container-display">
          {productos.map((producto) => (
            <div key={producto.id} className="tarjeta-producto-display">
              <img src={producto.urlImg} alt={producto.nombre} />
              <h3>
                {producto.nombre} - {producto.medida} grs
              </h3>
              <p className="precio">${producto.precio}</p>
               <button onClick={() => handleAgregar(producto)}>Agregar al carrito</button>

            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
