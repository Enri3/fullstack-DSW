
import React, {useEffect, useState } from "react";
import "../assets/styles/inicio.css";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import { getProductos } from "../services/productosService";
import { Link } from "react-router-dom";
import foto1 from "../assets/img/carrousel_1.png";
import foto2 from "../assets/img/carrousel_2.png";
import foto3 from "../assets/img/carrousel_3.png";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import Header from "../components/header";

const imagenes = [foto1, foto2];
type Producto = {
  idProd: number;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;

};


export default function Inicio() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [index, setIndex] = useState(0);
    const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const anterior = () => {
    setIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };



  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        console.log("Productos recibidos del backend:", data);
        setProductos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  // Solo los primeros 5, o todos si se activa "Ver más"
  const productosAMostrar = mostrarTodos ? productos : productos.slice(0, 5);

  return (
    <>  

    <Header cantidad={cantidad} />

    <div className="carrousel-container">
      <button className="btn-anterior" onClick={anterior}>
        ❮
      </button>

      <img
        src={imagenes[index]}
        alt={`Imagen ${index + 1}`}
        className="carrousel-imagen"
      />

      <button className="btn-siguiente" onClick={siguiente}>
        ❯
      </button>
    </div>
            <div className="mensaje">
          <h1>Conocé nuestros productos</h1>
        </div>
     <section id="productos-container-display">
          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && productosAMostrar.length > 0 && productosAMostrar.map((producto) => (
            <div key={producto.idProd} className="tarjeta-producto-display">
              <img
                src={producto.urlImg || "/placeholder.png"}
                alt={producto.nombreProd}
              />
              <h3>
                {producto.nombreProd} - {producto.medida || "N/A"} grs
              </h3>
              <p className="precio">${producto.precioProd}</p>
            </div>
          ))}



          {!loading && productos.length === 0 && !error && (
            <p>No hay productos disponibles.</p>
          )}
        </section>

     
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <Link to="/login" >
                <button className="but"> Ver más </button>
            </Link>
          </div>
       
    
    <Footer />
    </>
  );
}