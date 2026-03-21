import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import HeaderAdmin from "../components/header_admin";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import Detalle from "../components/DetalleProducto";
import { eliminarProducto } from "../services/productosService";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

export default function DetalleAdmin() {
  const { notificacion, mostrarError } = usarNotificacion();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { idProd?: number | string; nombreProd?: string; deleted?: number } | null;
  const idProd = state?.idProd;
  const nombreProducto = state?.nombreProd || "Producto";
  const deleted = state?.deleted;

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
      mostrarError("No se pudo eliminar el producto");
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <>
      <HeaderAdmin />
      {notificacion && (
        <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
      )}
      <Detalle />

      <div className="botones-detalle">
        {deleted === 1 && (
          <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>Producto dado de baja</p>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link to="/productosAdmin">
              <button className="boton-detalle">Volver</button>
           </Link>
          <Link to={`/modificarProducto/${idProd}`} >
            <button className="boton-detalle">Modificar</button>
          </Link>
          {deleted !== 1 && (
            <button onClick={handleEliminar} className="boton-detalle">Dar de baja</button>
          )}

        </div>
      </div>

      <Footer />

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
            <h2>¿Estás seguro de que quieres dar de baja este producto?</h2>
            <p><strong>{nombreProducto}</strong></p>
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