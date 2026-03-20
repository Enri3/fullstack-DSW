import React, { useState, useEffect } from "react";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import "../assets/styles/cart.css";
import "../assets/styles/style.css";
import { obtenerCantidadCarrito, agregarAlCarrito, restarAlCarrito, reiniciarCarrito, obtenerProductosCarrito } from "../services/cartService";
import { createPedido } from "../services/pedidosService";
import { buildImageUrl } from "../utils/imageUrl";

type ProductoCarrito = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  cantidad: number;
  urlImg: string;
};

export default function MostrarCarrito() {
    const { notificacion, mostrarError, mostrarExito } = usarNotificacion();
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [comprando, setComprando] = useState(false);

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

  function handleReiniciar() {
    reiniciarCarrito();
    setProductos([]);
    setCantidad(obtenerCantidadCarrito());
  }

  async function handleComprar() {
    try {
      setComprando(true);

      // Obtener cliente desde localStorage
      const clienteJSON = localStorage.getItem("cliente");
      if (!clienteJSON) {
        mostrarError("Debes estar autenticado para comprar");
        return;
      }

      const cliente = JSON.parse(clienteJSON);
      const idCli = cliente.idCli;

      // Preparar productos en formato para la API
      const productosParaPedido = productos.map((p) => ({
        idProd: p.idProd,
        cantidadProdPed: p.cantidad,
      }));

      // Crear el pedido
      await createPedido(idCli, "pendienteDePago", productosParaPedido);

      // Mensaje de éxito
      mostrarExito("¡Pedido creado exitosamente! Estado: Pendiente de Pago");

      // Reiniciar carrito
      setTimeout(() => {
        reiniciarCarrito();
        setProductos([]);
        setCantidad(obtenerCantidadCarrito());
      }, 2000);
    } catch (error: any) {
      console.error("Error al crear pedido:", error);
      mostrarError("Error al procesar la compra: " + (error.message || "Error desconocido"));
    } finally {
      setComprando(false);
    }
  }

  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = productos.reduce((acc, p) => acc + p.cantidad * p.precioProd, 0);


  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main>
        {notificacion && (
          <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
        )}
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
                  <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
                  <h3>{producto.nombreProd}</h3>
                  <p className="precio">${producto.precioProd}</p>
                  <div className="botones-carrito">
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
              <div className=" contenedor-botones ">
              <button onClick={handleComprar} disabled={comprando}>
                {comprando ? "Procesando..." : "Comprar"}
              </button>
              <button id="reiniciar" onClick={handleReiniciar}>Reiniciar</button>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
