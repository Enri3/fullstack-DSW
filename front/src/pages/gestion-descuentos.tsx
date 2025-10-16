import HeaderAdmin from "../components/header_admin";
import { Link } from "react-router-dom";
import { obtenerCantidadCarrito } from "../services/cartService";
import BotonVolver from "../components/botonVolver";
import { useEffect, useState } from "react";
import type { Descuento } from "../types/Descuentos";
import { useNavigate } from 'react-router-dom';

import { deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
import "../assets/styles/eliminarClientes.css";
import "../assets/styles/botonVolver.css";
import BuscadorDescuento from "../components/buscadorDescuento";

export default function Descuentos() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [clientes, setClientes] = useState<Descuento[]>([]);


  const navigator = useNavigate(); // Descomentar si se usa
  const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);
  const [termino, setTermino] = useState("");
  const [error, setError] = useState<string>("");


  // ... (Efectos y lógica irían aquí, aunque no se necesitan para el render)

 return (
     <>
         <HeaderAdmin cantidad={cantidad} /> 
         <BotonVolver />
 
         <div className="admin-page-container">
             <h2 className="admin-page-title">Panel de Administración - Clientes</h2>
             
                 <BuscadorDescuento onResultados={setClientes} setLoading={setLoading} />
             
 
             {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}
             
             {/* Contenedor para los botones de acción */}
             <div className="admin-actions-bar">
                 {/* Botón Eliminar */}
                 <button 
                     onClick={handleEliminarSeleccionados} 
                     className="btn-delete-selected"
                     disabled={clientesSeleccionados.length === 0} // Deshabilita si no hay selección
                 >
                     Eliminar seleccionados ({clientesSeleccionados.length})
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

 
             {(!loading && clientes.length === 0) && (
                 <p className="no-data-message">No se encontraron clientes que coincidan con la búsqueda.</p>
             )}
 
             {/* Tabla de Clientes */}
             {!loading && clientes.length > 0 && (
                 <table className="admin-table">
                     <thead>
                         <tr>
                             <th className="th-checkbox">
                                 {/* Botón/Checkbox Seleccionar/Deseleccionar todos */}
                                 <input
                                     type="checkbox"
                                     checked={clientesSeleccionados.length === clientes.length && clientes.length > 0}
                                     onChange={toggleSeleccionTodos}
                                     title={clientesSeleccionados.length === clientes.length ? "Deseleccionar todos" : "Seleccionar todos"}
                                 />
                             </th>
                             <th>Nombre</th>
                             <th>Apellido</th>
                             <th>Email</th>
                             <th>ID</th>
                         </tr>
                     </thead>
                     <tbody>
                         {clientes.map((cliente) => (
                             <tr key={(cliente.idCli)}>
                                 <td className="td-checkbox">
                                     <input
                                         type="checkbox"
                                         checked={clientesSeleccionados.includes(cliente.idCli)}
                                         onChange={() => toggleSeleccion(cliente.idCli)}
                                     />
                                 </td>
                                 <td>{cliente.nombreCli}</td>
                                 <td>{cliente.apellido || 'N/A'}</td>
                                 <td>{cliente.email}</td>
                                 <td>{cliente.idCli}</td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
         </div>
     </>
   );
}