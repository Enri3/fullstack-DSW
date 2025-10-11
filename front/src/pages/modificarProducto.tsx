import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { Link } from "react-router-dom";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import "../assets/styles/index.css";
import "../assets/styles/style.css";

export default function ModificarProducto() {
  const { id } = useParams(); // id del producto desde la URL
  const [inputs, setInputs] = useState({
    nombre: "",
    medida: "",
    precio: "",
    urlImg: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar datos del producto al montar
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:4000/productos/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al cargar producto");
          setLoading(false);
          return;
        }

        setInputs({
          nombre: data.nombre || "",
          medida: data.medida || "",
          precio: data.precio || "",
          urlImg: data.urlImg || "",
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputs.nombre || !inputs.precio) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(inputs.precio);
    if (isNaN(precioNum)) {
      setError("El precio debe ser un número válido.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, precio: precioNum }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al actualizar producto");
        return;
      }

      setSuccess("Producto actualizado correctamente!");
    } catch (err) {
      setError("No se pudo conectar con el servidor");
      console.error(err);
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <>
      <Header_sinCarrito />
      <main>
        <div className="contenedor-formulario">
          <form className="tarjeta-formulario" onSubmit={handleSubmit}>
            <div className="mensaje">
              <h1>Modificar Producto</h1>
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
              <button type="submit">Guardar Cambios</button>
            <Link to= '/' >
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