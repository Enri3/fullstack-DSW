import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BotonVolver from "../components/botonVolver";
import "../assets/styles/botonVolver.css";
import "../assets/styles/gestion-descuentos.css";

import { obtenerCantidadCarrito } from "../services/cartService";
import type { Producto } from "../types/Producto";
import { getAllProductos, addDescuento } from "../services/descunetosService";

export default function Descuentos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);
  const [porcentaje, setPorcentaje] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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

    // Validaciones
    if (productosSeleccionados.length === 0 || !porcentaje || !fechaDesde || !fechaHasta
    ) {
      alert("Por favor completa todos los campos y selecciona al menos un producto");
      return;
    }

    const nuevoDescuento = {
      porcentaje: Number(porcentaje),
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta),
    };

    try {
      setLoading(true);
      const data = await addDescuento(nuevoDescuento, productosSeleccionados);

      // data es { message, idDesc } según tu backend
      alert(data.message);

      // limpiar formulario
      setProductosSeleccionados([]);
      setPorcentaje("");
      setFechaDesde("");
      setFechaHasta("");

    } catch (error: any) {
      console.error("Error al registrar descuento:", error);
      alert(error.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }}

  return (
    <div className="contenedor-descuentos">
      <BotonVolver />
      <h1>Gestión de Descuentos</h1>
        
      <form onSubmit={handleSubmit} className="form-descuento">
        <h3>Registrar un nuevo descuento</h3>
        {/* Selección múltiple de productos */}
        <label htmlFor="productoID">Productos:</label>
        <select
          id="productoID"
          name="productoID"
          multiple
          value={productosSeleccionados.map(String)}
          onChange={(e) => {
            const valores = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
            setProductosSeleccionados(valores);
          }}
          required
        >
          {productos.map((producto) => (
            <option key={producto.idProd} value={producto.idProd}>
              {producto.nombreProd}
            </option>
          ))}

  
        </select>
        <p className="nota">
          Usa <b>Ctrl</b> (Windows) o <b>Cmd</b> (Mac) para seleccionar varios productos
        </p>

       {/* Porcentaje */}
        <label htmlFor="porcentaje">Porcentaje de descuento (%):</label>
        <input
          type="number"
          id="porcentaje"
          name="porcentaje"
          value={porcentaje}
          min="1"
          max="100"
          onChange={(e) => setPorcentaje(e.target.value)}
          required
        />

           {/* Fechas */}
        <label htmlFor="fechaDesde">Fecha Desde:</label>
        <input
          type="date"
          id="fechaDesde"
          name="fechaDesde"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          required
        />

        <label htmlFor="fechaHasta">Fecha Hasta:</label>
        <input
          type="date"
          id="fechaHasta"
          name="fechaHasta"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          required
        />


        <button type="submit" className="btn-registrar " disabled={loading}>
          {loading ? "Creando..." : "Crear descuento"}
        </button>
      </form>
    </div>
  );
}
