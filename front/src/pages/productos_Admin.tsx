import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import { getProductos, eliminarProducto } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import HeaderAdmin from "../components/header_admin";
import { buscarProducto } from "../services/productosService";



type Producto = {
  idProd: number | string;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;
};

export default function DisplayProductos() {
  // Estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState<number>(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  //  Modal y producto seleccionado
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  // Cargar productos al montar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
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

  // Agregar al carrito
  /*const handleAgregar = (producto: Producto) => {
    agregarAlCarrito(producto);
    setCantidad(obtenerCantidadCarrito());
  };*/

  // Abrir modal de eliminación
  const handleEliminar = (productoId: number | string) => {
    const producto = productos.find((p) => p.idProd === productoId);
    if (!producto) return;
    setProductoAEliminar(producto);
    setModalVisible(true);
  };

  //Confirmar eliminación
  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar.idProd);
      setProductos((prev) => prev.filter((p) => p.idProd !== productoAEliminar.idProd));
    } catch (err) {
      alert("No se pudo eliminar el producto");
    } finally {
      setModalVisible(false);
      setProductoAEliminar(null);
    }
  };

  const [termino, setTermino] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleBuscar(termino);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const handleBuscar = async (nombreProd : string) => {
    try {
      setLoading(true);
      const data = await buscarProducto(nombreProd);
      setProductos(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <HeaderAdmin cantidad={cantidad} /> 
      <main>
        <div className="mensaje">
          <h1>Bienvenido a Vivelas</h1>
          <p>Explora nuestros productos y disfruta de una experiencia única.</p>
        </div>
        
        <h2>Este es el buscador de productos</h2>
        <h2 className="text-2xl font-semibold mb-4 text-center">Buscar Productos</h2>

        <input
          type="text"
          placeholder="Escribe el nombre del producto..."
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}

        
        <section id="productos-container-display">
          {/* Sección de agregar producto */}
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

          {/* Mensajes de estado */}
          {loading && <p>Cargando productos...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Listado de productos */}
          
          {!loading && productos.length > 0 && productos.map((producto) => (
          <div key={producto.idProd} className="tarjeta-producto-display">
            <Link to="/detalleAdmin" state={{ id: producto.idProd }}>
              <div className="tarjeta-clickable">
                <img src={producto.urlImg || "/placeholder.png"} alt={producto.nombreProd} />
                <h3>{producto.nombreProd} - {producto.medida || "N/A"} grs</h3>
                <p className="precio">${producto.precioProd}</p>
              </div>
            </Link>

            <div className="botones-admin">
              <Link to={`/modificarProducto/${producto.idProd}`}>
                <button>Modificar</button>
              </Link>
              <button onClick={() => handleEliminar(producto.idProd)}>Eliminar</button>
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
            <p>¿Estás seguro de eliminar {productoAEliminar?.nombreProd}?</p>
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
