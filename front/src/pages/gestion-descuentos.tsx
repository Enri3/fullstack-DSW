
import BotonVolver from "../components/botonVolver";
import { useEffect, useState } from "react";
import "../assets/styles/botonVolver.css";
import { obtenerCantidadCarrito } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import type { DescuentoConProducto } from "../../../entidades/descuento";
import { descuentoConProductoVacio } from "../../../entidades/descuento";
import { getAllDescuentosConProductos , deleteMultipleDescuentos} from "../services/descunetosService";

export default function Descuentos() {
    
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
    const navigator = useNavigate();
    const [descuentos, setDescuentos] = useState<DescuentoConProducto[]>([]);
    const [descuentosSeleccionados, setDescuentosSeleccionados] = useState<number[]>([]);

    useEffect(() => {
        const fetchDescuentos = async () => {
          try {
            const data = await getAllDescuentosConProductos();
            setDescuentos(data);
          } catch (error) {
            console.error("Error al cargar descuentos:", error);
          }
        };
    
        fetchDescuentos();
        }, []);
    
        const toggleSeleccion = (id: number) => {
            setDescuentosSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
            );
        };
    
        const toggleSeleccionTodos = () => {
            if (descuentosSeleccionados.length === descuentos.length) {
            setDescuentosSeleccionados([]);
            } else {
            setDescuentosSeleccionados(descuentos.map((c) => c.idDesc));
            }
        };
    
        const handleEliminarSeleccionados = async () => {
        if (descuentosSeleccionados.length === 0) {
          alert("Seleccioná al menos un descuento para eliminar");
          return;
        }

        if (!window.confirm("¿Seguro que deseas eliminar los descuentos seleccionados?")) return;
    
            try {
                const data = await deleteMultipleDescuentos(descuentosSeleccionados);

                alert(data.message);

                setDescuentos((prev) =>
                prev.filter((c) => !descuentosSeleccionados.includes(c.idDesc))
                );
                setDescuentosSeleccionados([]);
            } catch (error: any) {
                alert(error.message || "No se pudo conectar con el servidor");
            }
        };

    return (
    <>
      <BotonVolver />
      <h1>Gestión de Descuentos</h1>
      {/* Tabla de Descuentos */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th></th> {/* Columna del Checkbox */}
                        <th>Producto</th>
                        <th>Porcentaje</th>
                        <th>Fecha desde</th>
                        <th>Fecha hasta</th>
                    </tr>
                </thead>
                <tbody>
                    {descuentos.map((descuento) => (
                        <tr key={descuento.idDesc}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={descuentosSeleccionados.includes(descuento.idDesc)}
                                    onChange={() => toggleSeleccion(descuento.idDesc)}
                                />
                            </td>
                            <td>{descuento.nombreProd}</td>
                            <td>{descuento.porcentaje}</td>
                            <td>{descuento.fechaDesde.toLocaleDateString()}</td>
                            <td>{descuento.fechaHasta.toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
      <p>Aquí podrás gestionar los descuentos disponibles en la tienda.</p>
    </>
  );
}