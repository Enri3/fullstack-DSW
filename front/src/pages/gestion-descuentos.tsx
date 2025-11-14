import HeaderAdmin from "../components/header_admin";
import { Link } from "react-router-dom";
import { obtenerCantidadCarrito } from "../services/cartService";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { DescuentoEncontrado } from "../types/Descuentos";

import { eliminarDescuentos, buscarDescuentoFiltro } from "../services/descunetosService";
import "../assets/styles/eliminarClientes.css";
import BuscadorDescuento from "../components/buscadorDescuento";

export default function Descuentos() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [descuentos, setDescuentos] = useState<DescuentoEncontrado[]>([]);


  const navigator = useNavigate(); 
  const [descuentosSeleccionados, setDescuentosSeleccionados] = useState<number[]>([]);
  const [termino, setTermino] = useState("");
  const [error, setError] = useState<string>("");

  const toggleSeleccion = (id: number) => {
        setDescuentosSeleccionados((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSeleccionTodos = () => {
        if (descuentosSeleccionados.length === descuentos.length && descuentos.length > 0) {
        setDescuentosSeleccionados([]);
        } else {
        setDescuentosSeleccionados(descuentos.map((d) => d.idDesc));
        }
    };

    const handleEliminarSeleccionados = async () => {
    if (descuentosSeleccionados.length === 0) {
        alert("Seleccioná al menos un descuento para eliminar");
        return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar los descuentos seleccionados?")) return;

        try {
            const data = await eliminarDescuentos(descuentosSeleccionados);

            alert(data.message);

            setDescuentos((prev) =>
            prev.filter((d) => !descuentosSeleccionados.includes(d.idDesc))
            );
            setDescuentosSeleccionados([]);
        } catch (error: any) {
            alert(error.message || "No se pudo conectar con el servidor");
        }
    };

   
    useEffect(() => {
        const fetchDescuentos = async () => {
            try {
            const data = await buscarDescuentoFiltro("");
            console.log("Descuentos recibidos del backend:", data);
            setDescuentos(Array.isArray(data) ? data : [data]);
            } catch (err) {
            console.error("Error al obtener Descuento:", err);
            setError("No se pudo conectar con el servidor.");
            setDescuentos([]);
            } finally {
            setLoading(false);
            }
        };
        fetchDescuentos();
    }, []);


 

 return (
     <>
         <HeaderAdmin/> 
 
         <div className="admin-page-container">
             <h2 className="admin-page-title">Panel de Administración - Descuentos</h2>
             
                 <BuscadorDescuento onResultados={setDescuentos} setLoading={setLoading} />
             
 
             {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}
             
             
             <div className="admin-actions-bar">
                
                 <button 
                     onClick={handleEliminarSeleccionados} 
                     className="btn-delete-selected"
                     disabled={descuentosSeleccionados.length === 0}
                 >
                     Eliminar seleccionados ({descuentosSeleccionados.length})
                 </button>
             </div>


            <div className="admin-actions-bar">
              <Link to="/nuevo-descuento" className="btn-new-item">
                  Crear Nuevo Descuento
              </Link>
            </div>

 
             {(!loading && descuentos.length === 0) && (
                 <p className="no-data-message">No se encontraron descuentos que coincidan con la búsqueda.</p>
             )}
 
             {!loading && descuentos.length > 0 && (
                 <table className="admin-table">
                     <thead>
                         <tr>
                             <th className="th-checkbox">
                                 
                                 <input
                                     type="checkbox"
                                     checked={descuentosSeleccionados.length === descuentos.length && descuentos.length > 0}
                                     onChange={toggleSeleccionTodos}
                                     title={descuentosSeleccionados.length === descuentos.length ? "Deseleccionar todos" : "Seleccionar todos"}
                                 />
                             </th>
                             
                             <th>Descuento</th>
                             <th>Fecha Desde</th>
                             <th>Fecha Hasta</th>
                             <th>Producto </th>
                         </tr>
                     </thead>
                     <tbody>
                         {descuentos.map((descuento) => (
                             <tr key={(descuento.idDesc)}>
                                 <td className="td-checkbox">
                                     <input
                                         type="checkbox"
                                         checked={descuentosSeleccionados.includes(descuento.idDesc)}
                                         onChange={() => toggleSeleccion(descuento.idDesc)}
                                     />
                                 </td>
                                  
                                 <td>{descuento.porcentaje} %</td>
                                <td>{new Date(descuento.fechaDesde).toLocaleDateString()}</td>
                                <td>{new Date(descuento.fechaHasta).toLocaleDateString()}</td>
                                 <td>{descuento.nombreProd}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
         </div>
     </>
   );
}