import HeaderAdmin from "../components/header_admin";
import { Link } from "react-router-dom";
import { obtenerCantidadCarrito } from "../services/cartService";
import BotonVolver from "../components/botonVolver";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { DescuentoEncontrado } from "../types/Descuentos";

import { deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
import "../assets/styles/eliminarClientes.css";
import "../assets/styles/botonVolver.css";
import BuscadorDescuento from "../components/buscadorDescuento";

export default function Descuentos() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [descuentos, setDescuentos] = useState<DescuentoEncontrado[]>([]);


  const navigator = useNavigate(); // Descomentar si se usa
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
        alert("Seleccioná al menos un cliente para eliminar");
        return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar los clientes seleccionados?")) return;

        try {
            const data = await deleteMultipleClientes(descuentosSeleccionados);

            alert(data.message);

            setDescuentos((prev) =>
            prev.filter((d) => !descuentosSeleccionados.includes(d.idDesc))
            );
            setDescuentosSeleccionados([]);
        } catch (error: any) {
            alert(error.message || "No se pudo conectar con el servidor");
        }
    };


  // ... (Efectos y lógica irían aquí, aunque no se necesitan para el render)

 return (
     <>
         <HeaderAdmin cantidad={cantidad} /> 
         <BotonVolver />
 
         <div className="admin-page-container">
             <h2 className="admin-page-title">Panel de Administración - Clientes</h2>
             
                 <BuscadorDescuento onResultados={setDescuentos} setLoading={setLoading} />
             
 
             {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}
             
             {/* Contenedor para los botones de acción */}
             <div className="admin-actions-bar">
                 {/* Botón Eliminar */}
                 <button 
                     onClick={handleEliminarSeleccionados} 
                     className="btn-delete-selected"
                     disabled={descuentosSeleccionados.length === 0} // Deshabilita si no hay selección
                 >
                     Eliminar seleccionados ({descuentosSeleccionados.length})
                 </button>
             </div>


            <div className="admin-actions-bar">
              <Link to="/nuevo-descuento" className="btn-new-item">
                  Crear Nuevo Descuento
              </Link>
              
              <button 
                  id="btn-eliminar-seleccionados"
                  className="btn-delete-selected"
                  disabled 
              >
                  Eliminar seleccionados (0)
              </button>
            </div>

 
             {(!loading && descuentos.length === 0) && (
                 <p className="no-data-message">No se encontraron clientes que coincidan con la búsqueda.</p>
             )}
 
             {/* Tabla de Clientes */}
             {!loading && descuentos.length > 0 && (
                 <table className="admin-table">
                     <thead>
                         <tr>
                             <th className="th-checkbox">
                                 {/* Botón/Checkbox Seleccionar/Deseleccionar todos */}
                                 <input
                                     type="checkbox"
                                     checked={descuentosSeleccionados.length === descuentos.length && descuentos.length > 0}
                                     onChange={toggleSeleccionTodos}
                                     title={descuentosSeleccionados.length === descuentos.length ? "Deseleccionar todos" : "Seleccionar todos"}
                                 />
                             </th>
                             <th>Nombre</th>
                             <th>Apellido</th>
                             <th>Email</th>
                             <th>ID</th>
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
                                 <td>{descuento.nombreProd}</td>
                                 <td>{descuento.fechaDesde.toDateString()}</td>
                                 <td>{descuento.fechaHasta.toDateString()}</td>
                                 <td>{descuento.idProd}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
         </div>
     </>
   );
}