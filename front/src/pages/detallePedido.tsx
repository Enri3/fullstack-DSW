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
  cantidad: number;
  urlImg: string | undefined;
};

export default function DetallePedido() {
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
        cantidad: Number(pp.cantidadProdPed || 0),
        urlImg: pp.producto!.urlImg,
      }))
    : [];

  const totalCalculado = productos.reduce((acumulador, prod) => acumulador + prod.precioProd * prod.cantidad, 0);

  const montoTotal = pedido?.montoTotal != null ? Number(pedido.montoTotal) : totalCalculado;

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      <main className="detalle-pedido-main">
        <section className="detalle-pedido-card">
          <div className="detalle-pedido-header">
            <h1>Detalle del pedido #{pedido?.idPedido ?? idPedido}</h1>
            <Link to="/historial-pedidos" className="detalle-pedido-volver">Volver al historial</Link>
          </div>

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
                    <p>Precio unitario: <strong>${producto.precioProd.toFixed(2)}</strong></p>
                    <p>Subtotal: <strong>${(producto.precioProd * producto.cantidad).toFixed(2)}</strong></p>
                  </article>
                ))}
              </div>

              <div className="detalle-pedido-total">
                <p>Monto total del pedido</p>
                <strong>${montoTotal.toFixed(2)}</strong>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
