import React, { useState, useEffect } from "react";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import "../assets/styles/cart.css";
import "../assets/styles/style.css";
import { obtenerCantidadCarrito, agregarAlCarrito, restarAlCarrito, reiniciarCarrito, obtenerProductosCarrito } from "../services/cartService";
import {
  agregarProductoEnCarrito,
  actualizarCantidadProductoEnPedido,
  getPedidoEnCarritoByCliente,
  hidratarCarritoDesdePedidoEnCarrito,
  reiniciarPedidoEnCarrito,
  updatePedidoEstado
} from "../services/pedidosService";

type ProductoCarrito = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  cantidad: number;
  urlImg: string;
};

export default function MostrarCarrito() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [comprando, setComprando] = useState(false);

  const obtenerIdCliente = (): number => {
    const clienteJSON = localStorage.getItem("cliente");
    if (!clienteJSON) return 0;

    const cliente = JSON.parse(clienteJSON);
    const idCli = Number(cliente?.idCli);
    if (!idCli || Number.isNaN(idCli)) return 0;

    return idCli;
  };

  const refrescarCarritoLocal = (): ProductoCarrito[] => {
    const prods = obtenerProductosCarrito().map((p: any) => ({
      ...p,
      idProd: typeof p.idProd === "string" ? Number(p.idProd) : p.idProd,
    }));

    setProductos(prods);
    setCantidad(obtenerCantidadCarrito());

    return prods;
  };

  useEffect(() => {
    const sincronizarCarritoDesdeServidor = async () => {
      const idCli = obtenerIdCliente();

      if (!idCli) {
        refrescarCarritoLocal();
        return;
      }

      try {
        await hidratarCarritoDesdePedidoEnCarrito(idCli);
      } catch (error) {
        console.error("Error al hidratar carrito desde servidor:", error);
      } finally {
        refrescarCarritoLocal();
      }
    };

    void sincronizarCarritoDesdeServidor();
  }, []);

  async function handleAgregar(producto: ProductoCarrito) {
    agregarAlCarrito(producto);

    try {
      const idCli = obtenerIdCliente();
      if (!idCli) {
        refrescarCarritoLocal();
        return;
      }

      const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);
      const prods = refrescarCarritoLocal();
      const prodActualizado = prods.find((p) => p.idProd === producto.idProd);
      const cantidadActual = prodActualizado?.cantidad ?? 0;

      if (!pedidoEnCarrito) {
        await agregarProductoEnCarrito(idCli, producto.idProd, cantidadActual);
      } else {
        await actualizarCantidadProductoEnPedido(
          pedidoEnCarrito.idPedido,
          producto.idProd,
          cantidadActual
        );
      }
    } catch (error) {
      console.error("Error al sincronizar suma de producto en carrito:", error);
      alert("No se pudo sincronizar el carrito con el servidor");
      refrescarCarritoLocal();
    }
  }

  async function handleRestar(producto: ProductoCarrito) {
    restarAlCarrito(producto);

    try {
      const idCli = obtenerIdCliente();
      if (!idCli) {
        refrescarCarritoLocal();
        return;
      }

      const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);
      const prods = refrescarCarritoLocal();
      const prodActualizado = prods.find((p) => p.idProd === producto.idProd);
      const cantidadActual = prodActualizado?.cantidad ?? 0;

      if (pedidoEnCarrito) {
        await actualizarCantidadProductoEnPedido(
          pedidoEnCarrito.idPedido,
          producto.idProd,
          cantidadActual
        );
      }
    } catch (error) {
      console.error("Error al sincronizar resta de producto en carrito:", error);
      alert("No se pudo sincronizar el carrito con el servidor");
      refrescarCarritoLocal();
    }
  }

  async function handleReiniciar() {
    reiniciarCarrito();

    try {
      const idCli = obtenerIdCliente();
      if (idCli) {
        await reiniciarPedidoEnCarrito(idCli);
      }
    } catch (error) {
      console.error("Error al reiniciar pedido en carrito:", error);
      alert("No se pudo reiniciar el carrito en el servidor");
    } finally {
      setProductos([]);
      setCantidad(obtenerCantidadCarrito());
    }
  }

  async function handleComprar() {
    try {
      setComprando(true);

      const idCli = obtenerIdCliente();
      if (!idCli) {
        alert("Debes estar autenticado para comprar");
        return;
      }

      const pedidoEnCarrito = await getPedidoEnCarritoByCliente(idCli);
      if (!pedidoEnCarrito) {
        alert("No hay un pedido en carrito para finalizar");
        return;
      }

      await updatePedidoEstado(pedidoEnCarrito.idPedido, "pendienteDePago");

      alert("Pedido creado exitosamente");
      reiniciarCarrito();
      setProductos([]);
      setCantidad(obtenerCantidadCarrito());
    } catch (error: any) {
      console.error("Error al crear pedido:", error);
      alert("Error al procesar la compra");
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
                  <div className="botones-carrito">
                    <button onClick={() => void handleRestar(producto)}>-</button>
                    <span className="cantidad">{producto.cantidad}</span>
                    <button onClick={() => void handleAgregar(producto)}>+</button>
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
              <button id="reiniciar" onClick={() => void handleReiniciar()}>Reiniciar</button>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
