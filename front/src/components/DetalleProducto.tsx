import React, { useEffect, useState } from "react";
import { getProductoById } from "../services/productosService";
import { useLocation } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import "../assets/styles/detalle.css";


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

      <main>
        <div className="mensaje">
          <h1>Detalle del Producto</h1>
          <p>Aquí puedes ver los detalles del producto seleccionado.</p>
        </div>
        <section id="producto-detalle-container">
          <div key={producto.id} className="detalle-producto-card">
            <div className="detalle-img">
              <img src={producto.urlImg || "/placeholder.png"} alt={producto.nombre} />
            </div>

            <div className="detalle-info">
              <h2>{producto.nombre}</h2>
              <p><strong>Medida:</strong> {producto.medida || "N/A"} grs</p>
              <p><strong>Precio:</strong> ${producto.precio}</p>
              <p className="detalle-descripcion">
                Vela artesanal de <strong>cera de soja</strong>, elaborada con fragancias de alta calidad. 
                Su presentación de <strong>{producto.medida || "N/A"} grs</strong> ofrece una combustión limpia 
                y duradera, ideal para crear un ambiente cálido y relajante en cualquier espacio del hogar.
              </p>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}