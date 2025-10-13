import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonVolver from "../components/botonVolver";
import "../assets/styles/botonVolver.css";
import "../assets/styles/gestion-descuentos.css"; // si quieres darle estilos propios

import { obtenerCantidadCarrito } from "../services/cartService";
import type { Producto } from "../../../entidades/producto";
import { PRODUCTOS_MOCK_DATA } from "../../../entidades/producto";
import { getAllProductos, addDescuento } from "../services/descunetosService";

export default function Descuentos() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_MOCK_DATA);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | "">("");
  const [porcentaje, setPorcentaje] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const navigate = useNavigate();

  // Cargar productos al montar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getAllProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoSeleccionado || !porcentaje || !fechaInicio || !fechaFin) {
      alert("Por favor completa todos los campos");
      return;
    }

    const nuevoDescuento = {
      idProd: productoSeleccionado,
      porcentaje: Number(porcentaje),
      fechaDesde: new Date(fechaInicio),
      fechaHasta: new Date(fechaFin),
    };

    try {
      const res = await addDescuento(nuevoDescuento);

      if (res.ok) {
        alert("Descuento registrado correctamente ✅");
        // limpiar formulario
        setProductoSeleccionado("");
        setPorcentaje("");
        setFechaInicio("");
        setFechaFin("");
      } else {
        alert("Error al registrar el descuento ❌");
      }
    } catch (error) {
      console.error("Error al registrar descuento:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="contenedor-descuentos">
      <BotonVolver />
      <h1>Gestión de Descuentos</h1>

      <form onSubmit={handleSubmit} className="form-descuento">
        <h3>Registrar un nuevo descuento</h3>

        <label htmlFor="productoID">Producto:</label>
        <select
          id="productoID"
          name="productoID"
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            -- Elige un producto --
          </option>
          {productos.map((producto) => (
            <option key={producto.idProd} value={producto.idProd}>
              {producto.nombreProd}
            </option>
          ))}
        </select>

        <label htmlFor="porcentaje">Porcentaje de descuento (%):</label>
        <input
          type="number"
          id="porcentaje"
          name="porcentaje"
          value={porcentaje}
          onChange={(e) => setPorcentaje(Number(e.target.value))}
          min="1"
          max="100"
          required
        />

        <label htmlFor="fechaInicio">Fecha de inicio:</label>
        <input
          type="date"
          id="fechaInicio"
          name="fechaInicio"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />

        <label htmlFor="fechaFin">Fecha de fin:</label>
        <input
          type="date"
          id="fechaFin"
          name="fechaFin"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />

        <button type="submit" className="btn-registrar">
          Registrar descuento
        </button>
      </form>
    </div>
  );
}
