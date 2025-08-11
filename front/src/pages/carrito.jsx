import React, { useState, useEffect } from "react";
import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import "../assets/styles/cart.css";
import "../assets/styles/style.css";
import { obtenerCantidadCarrito, agregarAlCarrito, restarAlCarrito, reiniciarCarrito, obtenerProductosCarrito } from "../services/cartService.js";

export default function MostrarCarrito() {
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  // Estado local con los productos en el carrito (del localStorage)
  const [productos, setProductos] = useState([]);

  // Cada vez que cargue el componente, traigo los productos del carrito
  useEffect(() => {
    const prods = obtenerProductosCarrito();
    setProductos(prods);
  }, []);

  // Manejo el click para sumar cantidad
  function handleAgregar(producto) {
    agregarAlCarrito(producto);
    const prods = obtenerProductosCarrito();
    setProductos(prods);
    setCantidad(obtenerCantidadCarrito());
  }

  // Manejo el click para restar cantidad
  function handleRestar(producto) {
    restarAlCarrito(producto);
    const prods = obtenerProductosCarrito();
    setProductos(prods);
    setCantidad(obtenerCantidadCarrito());
  }

  // Manejo el click para reiniciar carrito
  function handleReiniciar() {
    reiniciarCarrito();
    setProductos([]);
    setCantidad(obtenerCantidadCarrito());
  }

  // Calculo totales
  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = productos.reduce((acc, p) => acc + p.cantidad * p.precio, 0);


  return (
    <>
      <Header cantidad={cantidad} />
      <main>
        {productos.length === 0 ? (
          <div id="carrito-vacio">
            <p>No hay productos en el carrito</p>
            <a href="/">Volver y agregar</a>
          </div>
        ) : (
          <>
            <section id="productos-container-carrito">
              {productos.map((producto) => (
                <div key={producto.id} className="tarjeta-producto-carrito">
                  <img src={producto.urlImg} alt={producto.nombre} />
                  <h3>{producto.nombre}</h3>
                  <p className="precio">${producto.precio}</p>
                  <div>
                    <button onClick={() => handleRestar(producto)}>-</button>
                    <span className="cantidad">{producto.cantidad}</span>
                    <button onClick={() => handleAgregar(producto)}>+</button>
                  </div>
                </div>
              ))}
            </section>
            <section id="totales">
              <p>Total unidades: <span id="cantidad">{totalUnidades}</span></p>
              <p>Total precio: $<span id="precio">{totalPrecio.toFixed(2)}</span></p>
              <p><a href="/">Volver a la selección de productos</a></p>
              <button disabled>Comprar</button>
              <button id="reiniciar" onClick={handleReiniciar}>Reiniciar</button>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
