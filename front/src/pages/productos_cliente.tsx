import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { getProductos } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

export default function DisplayProductos() {
  const [productos, setProductos] = useState([]);
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        console.log("Productos recibidos del backend:", data);
        setProductos(Array.isArray(data) ? data : [data]); // Garantiza que sea array
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

  const handleAgregar = (producto) => {
    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  };

  return (
    <>
      <Header cantidad={cantidad} />
      <main>
        <div className="mensaje">
          <h1>Bienvenido a Vivelas</h1>
          <p>Explora nuestros productos y disfruta de una experiencia única.</p>
        </div>

        <section id="productos-container-display">
          <div className="tarjeta-add">
            <div className="mensaje">
              <br />
              <br />
              <h2>Nuevos productos</h2>
              <p>Haz clic en el botón para agregar un nuevo producto.</p>
              <br />
              <Link to="/nuevoProducto">
                <button>
                  Agregar Producto <i className="material-icons">library_add</i>
                </button>
              </Link>
            </div>
          </div>

          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && productos.length > 0 && productos.map((producto) => (
            <div key={producto.id} className="tarjeta-producto-display">
              <img
                src={producto.urlImg || "/placeholder.png"}
                alt={producto.nombre}
              />
              <h3>
                {producto.nombre} - {producto.medida || "N/A"} grs
              </h3>
              <p className="precio">${producto.precio}</p>
              <button onClick={() => handleAgregar(producto)}>
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