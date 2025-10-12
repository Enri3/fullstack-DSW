import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import { getProductos } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import Header_sinCarrito from "../components/header_sinCarrito";

type Producto = {
  id: number;
  nombre: string;
  medida?: string;
  precio: number;
  urlImg?: string;

};

export default function DisplayProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
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

  const handleAgregar = (producto: Producto) => {
    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  };

  const abrirModalEliminar = (producto: Producto) => {
    setProductoAEliminar(producto);
    setModalVisible(true);
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;

    try {
      const res = await fetch(`http://localhost:4000/productos/${productoAEliminar.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al eliminar el producto");
        return;
      }

      // Eliminar del estado
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor");
    } finally {
      setModalVisible(false);
      setProductoAEliminar(null);
    }
  };
    // Estado para manejar el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  // Función que abre el modal
  const handleEliminar = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return;
    setProductoAEliminar(producto);
    setModalVisible(true);
  };


  return (
    <>
      <Header_sinCarrito />
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
             
              <div className="botones-admin">
                <Link to={`/modificarProducto/${producto.id}`}>
                  <button>Modificar</button>
                </Link>
                <button onClick={() => handleEliminar(producto.id)}>Eliminar</button>
              </div>
              

            </div>
          ))}

          {!loading && productos.length === 0 && !error && (
            <p>No hay productos disponibles.</p>
          )}
        </section>
      </main>
      <Footer />

       {/* Modal de confirmación */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Estás seguro de eliminar {productoAEliminar?.nombre}?</p>
            <div className="modal-buttons botones-admin">
              <button onClick={confirmarEliminar}>Sí, eliminar</button>
              <button onClick={() => setModalVisible(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}