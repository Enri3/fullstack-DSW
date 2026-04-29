import React, { useEffect, useState } from "react";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import { getProductos, eliminarProducto, darDeAltaProducto, getProductosEnAlta } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import HeaderAdmin from "../components/header_admin";
import { buscarProducto } from "../services/productosService";
import BuscadorProducto from "../components/buscadorProductos";
import { buildImageUrl } from "../utils/imageUrl";



type Producto = {
  idProd: number | string;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;
  deleted?: number;
  stock: number;
  encargo: number;
};

export default function DisplayProductos() {

  const { notificacion, mostrarError } = usarNotificacion();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidad, setCantidad] = useState<number>(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);


  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductos();
      console.log("Productos recibidos del backend:", data);
      setProductos(Array.isArray(data) ? data : [data]);
      setError("");
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudo conectar con el servidor.");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEliminar = (productoId: number | string) => {
    const producto = productos.find((p) => p.idProd === productoId);
    if (!producto) return;
    setProductoAEliminar(producto);
    setModalVisible(true);
  };

  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    try {
      await eliminarProducto(productoAEliminar.idProd);
      setProductos((prev) =>
        prev.map((p) =>
          p.idProd === productoAEliminar.idProd
            ? { ...p, deleted: 1 }
            : p
        )
      );
    } catch (err) {
      mostrarError("No se pudo dar de baja el producto");
    } finally {
      setModalVisible(false);
      setProductoAEliminar(null);
    }
  };

  const handleAlta = async (productoId: number | string) => {
    try {
      await darDeAltaProducto(productoId);
      const producto = productos.find((p) => p.idProd === productoId);
      if (!producto) return;
      setProductos((prev) =>
        prev.map((p) =>
          p.idProd === producto.idProd
            ? { ...p, deleted: 0 }
            : p
        )
      );
    } catch (err) {
      mostrarError("No se pudo dar de alta el producto");
    }
  };

  return (
    <>
      <HeaderAdmin/>
      {notificacion && (
        <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
      )}
      <main>
        <div className="mensaje">
          <p>Explora nuestros productos y disfruta de una experiencia única.</p>
        </div>

       <BuscadorProducto onResultados={setProductos} setLoading={setLoading} onReset={fetchProductos} admin={true}
/>

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
  <div key={producto.idProd} className="tarjeta-producto-display">

    {producto.deleted === 1 ? (

      <div >
        <Link to="/detalleAdmin" state={{ idProd: producto.idProd, nombreProd: producto.nombreProd, deleted: producto.deleted }}>
          <div className="tarjeta-baja">
            <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
            <h3>{producto.nombreProd} </h3>
          </div>
        </Link>
        <p style={{ color: "red", fontWeight: "bold" }}>
          Producto dado de baja
        </p>
        <p className="stock" style={{ color: "Darkgreen" }} > {producto.stock} unidades disponibles en stock</p>
        <p className="encargo" style={{ color: "Brown" }} >{producto.encargo} unidades encargadas</p>
        

        <div className="botones-admin" style={{ marginTop: 8 }}>
          <Link to={`/modificarProducto/${producto.idProd}`} className="boton-alta">
            Modificar
          </Link>
          <button className="boton-alta" onClick={() => handleAlta(producto.idProd)}>
            Dar de alta
          </button>
        </div>
      </div>
    ) : (

      <>
        <Link to="/detalleAdmin" state={{ idProd: producto.idProd, nombreProd: producto.nombreProd, deleted: producto.deleted }}>
          <div className="tarjeta-clickable">
            <img src={buildImageUrl(producto.urlImg)} alt={producto.nombreProd} />
            <h3>{producto.nombreProd} - {producto.medida || "N/A"} grs</h3>
            <p className="precio">${producto.precioProd}</p>
            <p className="stock" style={{ color: "Darkgreen" }} > {producto.stock} unidades disponibles en stock</p>
            <p className="encargo" style={{ color: "Brown" }} >{producto.encargo} unidades encargadas</p>
        
            </div>
        </Link>

      <div className="botones-admin">
        <Link to={`/modificarProducto/${producto.idProd}`} className="boton-alta">
          Modificar
        </Link>
        <button className="boton-alta" onClick={() => handleEliminar(producto.idProd)}>
          Dar de baja
        </button>
      </div>
      </>
    )}

  </div>
))}


          {!loading && productos.length === 0 && !error && (
            <p>No hay productos disponibles.</p>
          )}
        </section>
      </main>
      <Footer />

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
            <h2>¿Estás seguro de que quieres dar de baja este producto?</h2>
            <p><strong>{productoAEliminar?.nombreProd}</strong></p>
            <div className="modal-botones">
              <button
                type="button"
                className="modal-btn-confirmar"
                onClick={confirmarEliminar}
              >
                Sí, dar de baja
              </button>
              <button
                type="button"
                className="modal-btn-cancelar"
                onClick={() => setModalVisible(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
