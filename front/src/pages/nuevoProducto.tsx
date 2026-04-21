import React, { useState } from "react";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import { Link } from "react-router-dom";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import { URL_BACK } from "../services/apiConfig";


export default function NuevoProducto() {
  const [inputs, setInputs] = useState({
    nombreProd: "",
    medida: "",
    precioProd: "",
    stock: "",
  });
  const [imagen, setImagen] = useState<File | null>(null);

  const { notificacion, mostrarError, mostrarExito } = usarNotificacion();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputs.nombreProd || !inputs.medida || !inputs.precioProd || !inputs.stock) {
      mostrarError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(inputs.precioProd);
    if (isNaN(precioNum)) {
      mostrarError("El precio debe ser un número válido.");
      return;
    }

    const stockNum = parseInt(inputs.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      mostrarError("El stock debe ser un número entero no negativo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombreProd", inputs.nombreProd);
      formData.append("medida", inputs.medida);
      formData.append("precioProd", precioNum.toString());
      formData.append("stock", stockNum.toString());
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch(`${URL_BACK}/productos`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        mostrarError(data.error || "Error en el servidor");
        return;
      }

      mostrarExito("Producto agregado correctamente!");
      setInputs({ nombreProd: "", medida: "", precioProd: "" , stock: ""});
      setImagen(null);
    } catch (err) {
      mostrarError("No se pudo conectar con el servidor");
      console.error(err);
    }
  };

  return (
    <>
      <Header_sinCarrito />
      {notificacion && (
        <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
      )}
      <main>
        <div className="contenedor-formulario">
          <form className="tarjeta-formulario" onSubmit={handleSubmit}>
            <div className="mensaje">
              <h1>Nuevo Producto</h1>
            </div>

            <div className="item-formulario">
              <label htmlFor="nombreProd">Nombre:</label>
              <input
                type="text"
                name="nombreProd"
                value={inputs.nombreProd}
                onChange={handleChange}
              />
            </div>

            <div className="item-formulario">
              <label htmlFor="medida">Medida:</label>
              <input
                type="text"
                name="medida"
                value={inputs.medida}
                onChange={handleChange}
              />
            </div>

            <div className="item-formulario">
              <label htmlFor="precioProd">Precio:</label>
              <input
                type="number"
                step="0.01"
                name="precioProd"
                value={inputs.precioProd}
                onChange={handleChange}
              />
            </div>
              <div className="item-formulario">
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                name="stock"
                value={inputs.stock}
                onChange={handleChange}
              />
            </div>
          
            <div className="item-formulario">
              <label htmlFor="imagen">Imagen:</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
              />
            </div>

            <div className="botones-formulario">
              <button type="submit">Agregar Producto</button>
            <Link to= '/productosAdmin' >
                <button>Volver </button>
            </Link>
            </div>

  
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
