import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header_sinCarrito from "../components/header_sinCarrito.jsx";
import Footer from "../components/footer.jsx";
import { getProductos } from "../services/productosService.js";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService.js";


export default function NuevoProducto() {
  const [inputs, setInputs] = useState({
    nombre: "",
    medida: "",
    precio: "",
    urlImg: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!inputs.nombre || !inputs.medida || !inputs.precio) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(inputs.precio);
    if (isNaN(precioNum)) {
      setError("El precio debe ser un número válido.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, precio: precioNum }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el servidor");
        return;
      }

      setSuccess("Producto agregado correctamente!");
      setInputs({ nombre: "", medida: "", precio: "", urlImg: "" });
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      console.error(err);
    }
  };

  return (
    <>
      <Header_sinCarrito />
      <main>
        <div className="contenedor-formulario">
          <form className="tarjeta-formulario" onSubmit={handleSubmit}>
            <div className="mensaje">
              <h1>Nuevo Producto</h1>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div className="item-formulario">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={inputs.nombre}
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
              <label htmlFor="precio">Precio:</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={inputs.precio}
                onChange={handleChange}
              />
            </div>

            <div className="item-formulario">
              <label htmlFor="urlImg">URL Imagen:</label>
              <input
                type="text"
                name="urlImg"
                value={inputs.urlImg}
                onChange={handleChange}
              />
            </div>

            <div className="botones-formulario">
              <button type="submit">Agregar Producto</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
