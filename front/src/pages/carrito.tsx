import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import "../assets/styles/cart.css";
import "../assets/styles/style.css";
import { obtenerCantidadCarrito, agregarAlCarrito, restarAlCarrito, reiniciarCarrito, obtenerProductosCarrito } from "../services/cartService";
import {
  agregarProductoEnCarrito,
  actualizarCantidadProductoEnPedido,
  getPedidoEnCarritoByCliente,
  hidratarCarritoDesdePedidoEnCarrito,
  reiniciarPedidoEnCarrito
} from "../services/pedidosService";
import { buildImageUrl } from "../utils/imageUrl";

type ProductoCarrito = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  cantidad: number;
  urlImg: string;
};

export default function MostrarCarrito() {
  const navigate = useNavigate();
  const { notificacion, mostrarError } = usarNotificacion();
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);

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
      mostrarError("No se pudo sincronizar el carrito con el servidor");
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
      mostrarError("No se pudo sincronizar el carrito con el servidor");
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
      mostrarError("No se pudo reiniciar el carrito en el servidor");
    } finally {
      setProductos([]);
      setCantidad(obtenerCantidadCarrito());
    }
  }

  function handleComprar() {
    if (productos.length === 0) {
      mostrarError("No hay productos en el carrito");
      return;
    }

    navigate("/formaDeEntrega");
  }

  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPrecio = productos.reduce((acc, p) => acc + p.cantidad * p.precioProd, 0);


  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="carrito-main">
        {notificacion && (
          <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
        )}
        {productos.length === 0 ? (
          <div id="carrito-vacio">
            <p>No hay productos en el carrito</p>
            <Link to="/productosCliente">Volver y agregar</Link>
          </div>
        ) : (
          <>
            <section id="productos-container-carrito" className="lista-scroll-5">
              {productos.map((producto) => (
                <div key={producto.idProd} className="tarjeta-producto-carrito">
                  <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
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
              <p><Link to="/productosCliente">Volver a la selección de productos</Link></p>
              <div className=" contenedor-botones ">
              <button onClick={handleComprar}>
                Comprar
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
