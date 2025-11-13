import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/nuevo-descuento.css";

import { obtenerCantidadCarrito } from "../services/cartService";
import type { Producto } from "../types/Producto";
import { getAllProductos, addDescuento } from "../services/descunetosService";
import HeaderAdmin from "../components/header_admin";

export default function NuevoDescuento() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([]);
  const [porcentaje, setPorcentaje] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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

    if (productosSeleccionados.length === 0 || !porcentaje || !fechaDesde || !fechaHasta
    ) {
      alert("Por favor completa todos los campos y selecciona al menos un producto");
      return;
    }

    const nuevoDescuento = {
      idDesc: Number(),
      porcentaje: Number(porcentaje),
      fechaDesde: new Date(fechaDesde),
      fechaHasta: new Date(fechaHasta),
    };

    try {
      setLoading(true);
      const data = await addDescuento(nuevoDescuento, productosSeleccionados);

      alert(data.message);

      setProductosSeleccionados([]);
      setPorcentaje("");
      setFechaDesde("");
      setFechaHasta("");

      navigate("/gestion-descuentos");

    } catch (error: any) {
      console.error("Error al registrar descuento:", error);
      alert(error.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }}

  return (
    <>
    <HeaderAdmin cantidad={cantidad} /> 
    <div className="contenedor-descuentos">
      <h1>Gestión de Descuentos</h1>
        
      <form onSubmit={handleSubmit} className="form-descuento">
        <h3>Registrar un nuevo descuento</h3>
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
  </>
  );
}