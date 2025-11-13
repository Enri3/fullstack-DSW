import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import HeaderAdmin from "../components/header_admin";
import Footer from "../components/footer";
import Detalle from "../components/DetalleProducto";
import { eliminarProducto } from "../services/productosService";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

interface Producto {
  idProd: number;
  nombreProd: string;
}

export default function DetalleAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { idProd?: number | string; nombreProd?: string } | null;
  const idProd = state?.idProd;
  const nombreProducto = state?.nombreProd || "Producto";

  const [modalVisible, setModalVisible] = useState(false);

  if (!idProd) {
    return <p style={{ color: "red" }}>ID de producto no válido o no recibido.</p>;
  }

  const handleEliminar = () => {
    setModalVisible(true);
  };

  const confirmarEliminar = async () => {
    try {
      await eliminarProducto(idProd);
      navigate("/productosAdmin"); 
    } catch {
      alert("No se pudo eliminar el producto");
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <>
      <HeaderAdmin />

      <Detalle />

      <div className="botones-detalle">
        <Link to={`/modificarProducto/${idProd}`} >
        <button className="boton-detalle">Modificar</button>
        </Link>
        <button onClick={handleEliminar} className="boton-detalle">Eliminar</button>
        <Link to="/productosAdmin">
            <button className="boton-detalle">Volver</button>
         </Link>
      </div>

      <Footer />

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>¿Estás seguro de eliminar {nombreProducto}?</p>
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