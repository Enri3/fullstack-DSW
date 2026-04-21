import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import { obtenerCantidadCarrito } from "../services/cartService";
import { getPedidoById } from "../services/pedidosService";
import type { Pedido } from "../types/Pedido";
import { buildImageUrl } from "../utils/imageUrl";
import "../assets/styles/detallePedido.css";

type ProductoDetalle = {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  precioFinalProd: number | undefined;
  cantidad: number;
  urlImg: string | undefined;
};

function obtenerPrecioUnitario(producto: ProductoDetalle): number {
  const precioFinal = Number(producto.precioFinalProd);
  if (!Number.isNaN(precioFinal) && precioFinal > 0) {
    return precioFinal;
  }

  return Number(producto.precioProd);
}

export default function Pendiente() {
  const { idPedido } = useParams();

  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCantidad(obtenerCantidadCarrito());
  }, []);

  useEffect(() => {
    const idPedidoNum = Number(idPedido);

    if (!idPedido || Number.isNaN(idPedidoNum)) {
      setError("ID de pedido invalido.");
      setLoading(false);
      return;
    }

    const cargarPedido = async () => {
      try {
        setLoading(true);
        const data = await getPedidoById(idPedidoNum);
        setPedido(data);
      } catch (err) {
        console.error("Error al cargar detalle del pedido:", err);
        setError("No se pudo cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    void cargarPedido();
  }, [idPedido]);

  const productos: ProductoDetalle[] = pedido?.pedidoProductos
    ? pedido.pedidoProductos
      .filter((pp) => pp.producto)
      .map((pp) => ({
        idProd: pp.idProd,
        nombreProd: pp.producto!.nombreProd,
        precioProd: Number(pp.producto!.precioProd || 0),
        precioFinalProd: pp.producto!.precioFinalProd,
        cantidad: Number(pp.cantidadProdPed || 0),
        urlImg: pp.producto!.urlImg,
      }))
    : [];

  const totalCalculado = productos.reduce((acumulador, prod) => acumulador + obtenerPrecioUnitario(prod) * prod.cantidad, 0);

  const montoTotal = pedido?.montoTotal != null ? Number(pedido.montoTotal) : totalCalculado;

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="detalle-pedido-main">
        <section className="detalle-pedido-card">
          <div >
            
            <h1>Pedido en Proceso. En espera de pago</h1>
            <p>El pago se encuentra en proceso. En breve se actualizará el estado del pedido. Si el pago se demora más de lo esperado, por favor contáctese con nuestro soporte.</p>
            <br/>
            <h3><Link className="link-volver" to="/clienteIngresado">
               Volver al inicio
            </Link></h3>
          
          
          </div>
          <br/>
          <p>Tu número de pedido es: <strong>{pedido?.idPedido}</strong></p>

          {loading ? (
            <p className="detalle-pedido-feedback">Cargando detalle...</p>
          ) : error ? (
            <p className="detalle-pedido-error">{error}</p>
          ) : productos.length === 0 ? (
            <p className="detalle-pedido-feedback">Este pedido no tiene productos cargados.</p>
          ) : (
            <>
              <div className="detalle-pedido-lista">
                {productos.map((producto, index) => (
                  <article key={`${producto.idProd}-${index}`} className="detalle-producto-item">
                    <span className="detalle-indice">{index + 1}.</span>
                    <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
                    <h3>{producto.nombreProd}</h3>
                    <p>Cantidad: <strong>{producto.cantidad}</strong></p>
                    <p>Precio unitario: <strong>${obtenerPrecioUnitario(producto).toFixed(2)}</strong></p>
                    <p>Subtotal: <strong>${(obtenerPrecioUnitario(producto) * producto.cantidad).toFixed(2)}</strong></p>
                  </article>
                ))}
              </div>

              <div className="detalle-pedido-total">
                <p>Monto total del pedido</p>
                <strong>${montoTotal.toFixed(2)}</strong>
                <br/>
                
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
