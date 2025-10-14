import React, { useState, useEffect } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import Footer from "../components/footer";
import "../assets/styles/cart.css";
import "../assets/styles/style.css";
import { obtenerCantidadCarrito, agregarAlCarrito, restarAlCarrito, reiniciarCarrito, obtenerProductosCarrito } from "../services/cartService";

type ProductoCarrito = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  cantidad: number;
  urlImg: string;
};

export default function MostrarCarrito() {
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  // Estado local con los productos en el carrito (del localStorage)
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);

  // Cada vez que cargue el componente, traigo los productos del carrito
  useEffect(() => {
    const prods = obtenerProductosCarrito().map((p: any) => ({
      ...p,
      idProd: typeof p.idProd === "string" ? Number(p.idProd) : p.idProd,
    }));
    setProductos(prods);
  }, []);

  function handleAgregar(producto: ProductoCarrito) {
    agregarAlCarrito(producto);
    const prods = obtenerProductosCarrito().map((p: any) => ({
      ...p,
      idProd: typeof p.idProd === "string" ? Number(p.idProd) : p.idProd,
    }));
    setProductos(prods);
    setCantidad(obtenerCantidadCarrito());
  }

  function handleRestar(producto: ProductoCarrito) {
    restarAlCarrito(producto);
    const prods = obtenerProductosCarrito().map((p: any) => ({
      ...p,
      idProd: typeof p.idProd === "string" ? Number(p.idProd) : p.idProd,
    }));
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
  const totalPrecio = productos.reduce((acc, p) => acc + p.cantidad * p.precioProd, 0);


  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />
      <main>
        {productos.length === 0 ? (
          <div id="carrito-vacio">
            <p>No hay productos en el carrito</p>
            <a href="/productosCliente">Volver y agregar</a>
          </div>
        ) : (
          <>
            <section id="productos-container-carrito">
              {productos.map((producto) => (
                <div key={producto.idProd} className="tarjeta-producto-carrito">
                  <img src={producto.urlImg} alt={producto.nombreProd} />
                  <h3>{producto.nombreProd}</h3>
                  <p className="precio">${producto.precioProd}</p>
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
              <p><a href="/productosCliente">Volver a la selección de productos</a></p>
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
