import { useState } from "react";
import HeaderAdmin from "../components/header_admin";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { useNavigate } from 'react-router-dom';
import type { Cliente } from "../../../entidades/cliente";
import { clienteVacio } from "../../../entidades/cliente";
import { useEffect } from "react";
import { getAllClientes, deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
import { Link } from "react-router-dom";
import "../assets/styles/eliminarClientes.css";
import BotonVolver from "../components/botonVolver";
import "../assets/styles/botonVolver.css";

export default function EliminarClientes() {
  
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
    const navigator = useNavigate();
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
        if (clientesSeleccionados.length === clientes.length) {
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
          setClientes(Array.isArray(data) ? data : [data]);
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

            {/* Contenedor para los botones de acción */}
            <div className="admin-actions-bar">
                {/* Botón Seleccionar/Deseleccionar */}
                <button 
                    onClick={toggleSeleccionTodos} 
                    className="btn-select-all"
                >
                    {clientesSeleccionados.length === clientes.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </button>
                
                {/* Botón Eliminar */}
                <button 
                    onClick={handleEliminarSeleccionados} 
                    className="btn-delete-selected"
                >
                    Eliminar seleccionados
                </button>
            </div>

            <input
            type="text"
            placeholder="Escribe el nombre del cliente..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}

            {!loading && clientes.length > 0 && clientes.map((cliente) => (
                <div key={cliente.idCli} className="tarjeta-producto-display">
                <div className="tarjeta-clickable">
                <h3>{cliente.nombreCli} - {cliente.apellido || "N/A"} grs</h3>
                <p className="precio">${cliente.email}</p>
                </div>


                </div>
            ))}

            {/* Tabla de Clientes */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.idCli}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={clientesSeleccionados.includes(cliente.idCli)}
                                    onChange={() => toggleSeleccion(cliente.idCli)}
                                />
                            </td>
                            <td>{cliente.nombreCli}</td>
                            <td>{cliente.apellido}</td>
                            <td>{cliente.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
  );
}