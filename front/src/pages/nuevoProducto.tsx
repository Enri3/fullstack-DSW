import React, { useState } from "react";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import { Link } from "react-router-dom";


export default function NuevoProducto() {
  const [inputs, setInputs] = useState({
    nombreProd: "",
    medida: "",
    precioProd: "",
  });
  const [imagen, setImagen] = useState<File | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputs.nombreProd || !inputs.medida || !inputs.precioProd) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(inputs.precioProd);
    if (isNaN(precioNum)) {
      setError("El precio debe ser un número válido.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombreProd", inputs.nombreProd);
      formData.append("medida", inputs.medida);
      formData.append("precioProd", precioNum.toString());
      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch("http://localhost:4000/productos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el servidor");
        return;
      }

      setSuccess("Producto agregado correctamente!");
      setInputs({ nombreProd: "", medida: "", precioProd: "" });
      setImagen(null);
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
