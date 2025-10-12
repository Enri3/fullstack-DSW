import React, { useEffect, useState } from "react";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import { getProductoById } from "../services/productosService";
import { useLocation } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

interface Producto {
  id: number | string;
  nombre: string;
  medida?: string;
  precio: number;
  urlImg?: string;
}

export default function Detalle() {
  const location = useLocation();
  const state = location.state as { id?: number | string } | null;
  const id = state?.id;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  if (!id) {
    return <p style={{ color: "red" }}>ID de producto no válido o no recibido.</p>;
  }

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProductoById(id);
        setProducto(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [id]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <>
      <Header_sinCarrito />
      <main>
        <div className="mensaje">
          <h1>Detalle del Producto</h1>
          <p>Aquí puedes ver los detalles del producto seleccionado.</p>
        </div>
        <section id="productos-container-display">
          <div key={producto.id} className="tarjeta-producto-display">
            <img src={producto.urlImg || "/placeholder.png"} alt={producto.nombre} />
            <h3>{producto.nombre} - {producto.medida || "N/A"} grs</h3>
            <p>Precio: ${producto.precio}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}