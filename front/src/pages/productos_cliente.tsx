import React, { useEffect, useState } from "react";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import { getProductosEnAlta } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import type { Producto } from "../types/Producto";
import type { Cliente } from "../types/Cliente";
import { agregarProductoEnCarrito } from "../services/pedidosService";
import BuscadorProducto from "../components/buscadorProductos";
import { buildImageUrl } from "../utils/imageUrl";

export default function DisplayProductos_C() {
  const { notificacion, mostrarError, mostrarExito, limpiar } = usarNotificacion();
  const [productos, setProductos] = useState<Producto[]>([]);

  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    limpiar();
  }, [limpiar]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosEnAlta();
        console.log("Productos recibidos del backend:", data);
        setProductos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudo conectar con el servidor.");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleAgregar = async (producto: Producto) => {
    try {
      const clienteStorage = localStorage.getItem("cliente");

      if (!clienteStorage) {
        mostrarError("Debe iniciar sesión para agregar productos al carrito.");
        return;
      }

      const cliente = JSON.parse(clienteStorage) as Cliente;

      await agregarProductoEnCarrito(cliente.idCli, producto.idProd, 1);
      agregarAlCarrito(producto);
      setCantidad(obtenerCantidadCarrito());
      mostrarExito(`${producto.nombreProd} agregado al carrito`);
    } catch (err) {
      console.error("Error al agregar producto al pedido en carrito:", err);
      mostrarError("No se pudo agregar el producto al carrito.");
    }
  };
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await getProductosEnAlta();
        setProductos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
  };

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      {notificacion && (
        <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
      )}
      <main>
        <div className="mensaje">
          <h1>Bienvenido a Vivelas</h1>
          <p>Explora nuestros productos y disfruta de una experiencia única.</p>
        </div>
        <BuscadorProducto onResultados={setProductos} setLoading={setLoading} onReset={fetchProductos} admin={false} />
                

        <section id="productos-container-display">
          

          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && productos.length > 0 && productos.map((producto) => (
       
            <div key={producto.idProd} className="tarjeta-producto-display">
            <Link to="/detalleCliente" state={{ idProd: producto.idProd }}>
              <img
                src={buildImageUrl(producto.urlImg)}
                alt={producto.nombreProd}
              />
              <h3>
                {producto.nombreProd} - {producto.medida || "N/A"} grs
              </h3>
              <p className="precio">${producto.precioProd}</p>
              </Link>
              <button onClick={() => void handleAgregar(producto)}>
                Agregar al carrito
              </button>
            </div>
          ))}

          {!loading && productos.length === 0 && !error && (
            <p>No hay productos disponibles.</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}