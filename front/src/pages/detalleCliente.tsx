import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import Footer from "../components/footer";
import Detalle from "../components/DetalleProducto";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { getProductoById } from "../services/productosService";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

interface Producto {
  id: number | string;
  nombre: string;
  precio?: number;
  medida?: string;
  urlImg?: string;
}

export default function DetalleCliente() {
  const location = useLocation();
  const state = location.state as { id?: number | string } | null;
  const id = state?.id;

  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!id) {
    return <p style={{ color: "red" }}>ID de producto no válido o no recibido.</p>;
  }

  // Cargar producto al montar
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProductoById(id);
        setProducto(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [id]);

  const handleAgregar = () => {
    if (!producto) return;
    // ✅ Solo pasar el producto, cartService maneja la cantidad internamente
    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <>
      <HeaderClienteIngresado cantidad={cantidad} />

      {/* Mostrar detalle */}
      <Detalle id={id} />

      {/* Botones */}
      <div className="botones-detalle">
        <button onClick={handleAgregar} className="boton-detalle">
          Agregar al carrito
        </button>
        <Link to="/productosCliente">
          <button className="boton-detalle">Volver</button>
        </Link>
      </div>

      <Footer />
    </>
  );
}