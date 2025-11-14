import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import Detalle from "../components/DetalleProducto";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { getProductoById } from "../services/productosService";

import "../assets/styles/index.css";
import "../assets/styles/style.css";
import "../assets/styles/eliminarClientes.css";

interface Producto {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  medida?: string;
  urlImg?: string;
}

export default function DetalleCliente() {
  const location = useLocation();
  const state = location.state as { idProd?: number } | null;
  const idProd = state?.idProd;

  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  if (!idProd) {
    return <p style={{ color: "red" }}>ID de producto no válido o no recibido.</p>;
  }

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProductoById(idProd);
        setProducto(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [idProd]);

  const handleAgregar = () => {
    if (!producto) return;

    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  };


  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />

      <Detalle/>

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