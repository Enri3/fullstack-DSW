import { useState } from "react";
import HeaderAdmin from "../components/header_admin";
import { obtenerCantidadCarrito } from "../services/cartService";
// import { useNavigate } from 'react-router-dom'; // No se usa actualmente
import type { Cliente } from "../../../entidades/cliente";
import { useEffect } from "react";
import { deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
// import { Link } from "react-router-dom"; // No se usa actualmente
import "../assets/styles/eliminarClientes.css";
import BotonVolver from "../components/botonVolver";
import "../assets/styles/botonVolver.css";

export default function EliminarClientes() {
    
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
    // const navigator = useNavigate(); // Descomentar si se usa
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [termino, setTermino] = useState("");
    
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

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
          handleBuscar(termino);
        }, 400);
    
        return () => clearTimeout(delayDebounce);
      }, [termino]);
    
      const handleBuscar = async (criterioFiltro : string) => {
        try {
          setLoading(true);
          const data = await buscarClienteFiltro(criterioFiltro);
          // Asegurarse de manejar cuando el resultado es solo un objeto (si la API lo permite)
          setClientes(Array.isArray(data) ? data : (data ? [data] : []));
        } catch (err) {
          console.error(err);
          setClientes([]);
        } finally {
          setLoading(false);
        }
      };

     return (
    <>
        {/* Se asume que HeaderClienteIngresado sigue la estética de Vivelas */}
        <HeaderAdmin cantidad={cantidad} /> 
        <BotonVolver />

        {/* Contenedor principal para la página de eliminación de clientes */}
        <div className="admin-page-container">
            <h2 className="admin-page-title">Panel de Administración - Clientes</h2>
            
            {/* Input de Búsqueda */}
            <input
            type="text"
            placeholder="Escribe el nombre del cliente..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            // CLASE CSS DEFINIDA EN ELIMINARCLIENTES.CSS
            className="input-busqueda-clientes" 
            />

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
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente.idCli}>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </>
  );
}