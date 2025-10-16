import { useState } from "react";
import HeaderAdmin from "../components/header_admin";
import { obtenerCantidadCarrito } from "../services/cartService";
// import { useNavigate } from 'react-router-dom'; // No se usa actualmente
import type { Cliente } from "../types/Cliente";
import { useEffect } from "react";
import { deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
import "../assets/styles/eliminarClientes.css";
import BotonVolver from "../components/botonVolver";
import "../assets/styles/botonVolver.css";
import BuscadorCliente from "../components/buscadorCliente";

export default function EliminarClientes() {
    
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
    // const navigator = useNavigate(); // Descomentar si se usa
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [termino, setTermino] = useState("");
    const [error, setError] = useState<string>("");
    
    const toggleSeleccion = (id: number) => {
        setClientesSeleccionados((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSeleccionTodos = () => {
        if (clientesSeleccionados.length === clientes.length && clientes.length > 0) {
        setClientesSeleccionados([]);
        } else {
        setClientesSeleccionados(clientes.map((c) => c.idCli));
        }
    };

    const handleEliminarSeleccionados = async () => {
    if (clientesSeleccionados.length === 0) {
        alert("Seleccioná al menos un cliente para eliminar");
        return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar los clientes seleccionados?")) return;

        try {
            const data = await deleteMultipleClientes(clientesSeleccionados);

            alert(data.message);

            setClientes((prev) =>
            prev.filter((c) => !clientesSeleccionados.includes(c.idCli))
            );
            setClientesSeleccionados([]);
        } catch (error: any) {
            alert(error.message || "No se pudo conectar con el servidor");
        }
    };

      // Cargar clientes al montar
      useEffect(() => {
        const fetchClientes = async () => {
          try {
            const data = await buscarClienteFiltro("");
            console.log("Clientes recibidos del backend:", data);
            setClientes(Array.isArray(data) ? data : [data]);
          } catch (err) {
            console.error("Error al obtener clientes:", err);
            setError("No se pudo conectar con el servidor.");
            setClientes([]);
          } finally {
            setLoading(false);
          }
        };
        fetchClientes();
      }, []);

     return (
    <>
        <HeaderAdmin cantidad={cantidad} /> 
        <BotonVolver />

        <div className="admin-page-container">
            <h2 className="admin-page-title">Panel de Administración - Clientes</h2>
            
                <BuscadorCliente onResultados={setClientes} setLoading={setLoading} />
            

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