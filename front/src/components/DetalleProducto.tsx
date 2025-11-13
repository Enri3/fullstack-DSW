import React, { useEffect, useState } from "react";
import { getProductoById } from "../services/productosService";
import { useLocation } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import "../assets/styles/detalle.css";
import{ buscarDescuentoFiltro } from "../services/descunetosService";

interface Producto {
  idProd: number | string;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;
}

export default function Detalle() {
  const location = useLocation();
  const state = location.state as { idProd?: number | string } | null;
  const idProd = state?.idProd;

  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
    const [resultados, setResultados] = useState<any[]>([]);

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
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [idProd]);
  const handleBuscar = async () => {
    try {
      setLoading(true);
      if (!producto) return;
  
      const data = await buscarDescuentoFiltro(producto.nombreProd);
      console.log("Descuentos recibidos:", data);
  
      setResultados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al buscar descuento:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }; 
  useEffect(() => {
  if (producto) {
    handleBuscar();
  }
}, [producto]);

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <main>
      <div className="mensaje">
        <h1>Detalle del Producto</h1>
        <p>Aquí puedes ver los detalles del producto seleccionado.</p>
      </div>
      <section id="producto-detalle-container">
        <div key={producto.idProd} className="detalle-producto-card">
          <div className="detalle-img">
            <img src={producto.urlImg || "/placeholder.png"} alt={producto.nombreProd} />
          </div>

          <div className="detalle-info">
            <h2>{producto.nombreProd}</h2>
            <p><strong>Medida:</strong> {producto.medida || "N/A"} grs</p>
            <p><strong>Precio:</strong> ${producto.precioProd}</p>
            <p className="detalle-descripcion">
              Vela artesanal de <strong>cera de soja</strong>, elaborada con fragancias de alta calidad. 
              Su presentación de <strong>{producto.medida || "N/A"} grs</strong> ofrece una combustión limpia 
              y duradera, ideal para crear un ambiente cálido y relajante en cualquier espacio del hogar.
            </p>

             {resultados.length > 0 ? (
              <table className="tabla-descuentos">
                <p className="mt-3 mb-2 font-semibold">Descuentos disponibles para este producto:</p>
           
                <tbody>
                  {resultados.map((d) => (
                    <tr key={`${d.idProd}-${d.idDesc}`}>

                      <td>Descuento: {d.porcentaje}%</td>
                      <td>Desde:{new Date(d.fechaDesde).toLocaleDateString()}</td>
                      <td>Hasta:{new Date(d.fechaHasta).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              !loading && <p>No se encontraron descuentos para este producto.</p>
            )}
                      </div>
                    </div>
                  
      </section>
    </main>
  );
}