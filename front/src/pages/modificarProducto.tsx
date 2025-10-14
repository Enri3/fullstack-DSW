import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import { getProductoById, updateProducto } from "../services/productosService";

export default function ModificarProducto() {
  const { idProd } = useParams<{ idProd: string }>();
  const [inputs, setInputs] = useState({
    nombreProd: "",
    medida: "",
    precioProd: "",
    urlImg: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

 
  if (!idProd) {
    return <p>Error: ID de producto no válido.</p>;
  }

  
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProductoById(idProd);
        setInputs({
          nombreProd: data.nombreProd || "",
          medida: data.medida || "",
          precioProd: data.precioProd?.toString() || "",
          urlImg: data.urlImg || "",
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [idProd]);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!inputs.nombreProd || !inputs.precioProd) {
      setError("Por favor, completa los campos obligatorios.");
      return;
    }

    const precioNum = parseFloat(inputs.precioProd);
    if (isNaN(precioNum)) {
      setError("El precio debe ser un número válido.");
      return;
    }

    try {
      await updateProducto(idProd, {
        ...inputs, precioProd: precioNum,
        idProd: "",
        nombreProd: inputs.nombreProd
      });
      setSuccess("✅ Producto actualizado correctamente!");
    } catch (err) {
      console.error(err);
      setError("❌ Error al actualizar el producto.");
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
              <Link to="/productosAdmin">
                <button type="button">Salir</button>
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}