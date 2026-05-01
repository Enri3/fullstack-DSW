import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header_sinCarrito from "../components/header_sinCarrito";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import { getProductoById, updateProducto } from "../services/productosService";
import { buildImageUrl } from "../utils/imageUrl";

export default function ModificarProducto() {
  const { idProd } = useParams<{ idProd: string }>();
  const { notificacion, mostrarExito, mostrarError } = usarNotificacion();
  const [inputs, setInputs] = useState({
    nombreProd: "",
    medida: "",
    precioProd: "",
    stock: "",
    encargo: ""
  });
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenInicial, setImagenInicial] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  if (!idProd) {
    return <p>Error: ID de producto no válido.</p>;
  }


  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await getProductoById(Number(idProd));
        setInputs({
          nombreProd: data.nombreProd || "",
          medida: data.medida || "",
          precioProd: data.precioProd?.toString() || "",
          stock: data.stock?.toString() || "",
          encargo: data.encargo?.toString() || ""
        });
        const url = data.urlImg ? buildImageUrl(data.urlImg) : null;
        setImagenInicial(url);
        setPreviewUrl(url);
      } catch (err) {
        console.error(err);
        mostrarError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [idProd]);

  useEffect(() => {
    if (!imagen) {
      setPreviewUrl(imagenInicial);
      return;
    }

    const objectUrl = URL.createObjectURL(imagen);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imagen, imagenInicial]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputs.nombreProd || !inputs.precioProd || !inputs.stock) {
      mostrarError("Por favor, completa los campos obligatorios.");
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

      await updateProducto(idProd, formData);
      mostrarExito("¡Producto actualizado correctamente!");
    } catch (err) {
      console.error(err);
      mostrarError("Error al actualizar el producto.");
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <>
      <Header_sinCarrito />
      <main>
        {notificacion && (
          <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
        )}
        <div className="contenedor-formulario">
          <form className="tarjeta-formulario" onSubmit={handleSubmit}>
            <div className="mensaje">
              <h1>Modificar Producto</h1>
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
            {inputs.encargo && parseInt(inputs.encargo) > 0 && (
              <p style={{ color: "red", fontWeight: "bold" }}>
                * Hay {inputs.encargo} unidades en encargo, que se restaran de las disponibles en stock
              </p>
            )}

            <div className="item-formulario">
              <label htmlFor="imagen">Nueva imagen (opcional):</label>
              <input
                type="file"
                id="imagen"
                name="imagen"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
              />
              {previewUrl && (
                <div className="preview-imagen-wrap">
                  <img
                    src={previewUrl}
                    alt={`Vista previa de ${inputs.nombreProd || "producto"}`}
                    className="preview-imagen-producto"
                  />
                </div>
              )}
            </div>

            <div className="botones-formulario">
              <button type="submit">Guardar Cambios</button>
              <Link to="/productosAdmin">
                <button type="button">Volver</button>
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
