import { useEffect, useMemo, useState } from "react";
import HeaderAdmin from "../components/header_admin";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import type { Cliente } from "../types/Cliente";
import { cambiarTipoMultipleClientes, deleteMultipleClientes, buscarClienteFiltro } from "../services/authService";
import { getTiposClientes, type TipoClienteOption } from "../services/tipo_usuarioService";
import "../assets/styles/eliminarClientes.css";
import BuscadorCliente from "../components/buscadorCliente";

export default function EliminarClientes() {

    const { notificacion, mostrarError, mostrarExito } = usarNotificacion();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clientesSeleccionados, setClientesSeleccionados] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [tiposCliente, setTiposCliente] = useState<TipoClienteOption[]>([]);
    const [mostrarModalTipo, setMostrarModalTipo] = useState(false);
    const [idTipoSeleccionado, setIdTipoSeleccionado] = useState<string>("");
    const [actualizandoTipo, setActualizandoTipo] = useState(false);

    const todosSeleccionados = useMemo(
        () => clientes.length > 0 && clientesSeleccionados.length === clientes.length,
        [clientes.length, clientesSeleccionados.length]
    );

    const tipoNombrePorId = useMemo(() => {
        const mapa = new Map<number, string>();
        tiposCliente.forEach((tipo) => {
            mapa.set(tipo.idTipoCli, tipo.nombreTipo);
        });
        return mapa;
    }, [tiposCliente]);

    const puedeEliminar = clientesSeleccionados.length > 0 && !loading && !eliminando;
    const puedeCambiarTipo = clientesSeleccionados.length > 0 && !loading && !eliminando && !actualizandoTipo && tiposCliente.length > 0;
    const operacionEnCurso = eliminando || actualizandoTipo;
    
    const toggleSeleccion = (id: number) => {
        setClientesSeleccionados((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSeleccionTodos = () => {
        if (todosSeleccionados) {
        setClientesSeleccionados([]);
        } else {
        setClientesSeleccionados(clientes.map((c) => c.idCli));
        }
    };

    const handleEliminarSeleccionados = () => {
    if (clientesSeleccionados.length === 0) {
        mostrarError("Seleccioná al menos un cliente para eliminar");
        return;
    }

    setMostrarConfirmacion(true);
    };

    const confirmarEliminarSeleccionados = async () => {
    if (clientesSeleccionados.length === 0) {
        setMostrarConfirmacion(false);
        return;
    }

        try {
            setEliminando(true);
            await deleteMultipleClientes(clientesSeleccionados);

            if (clientesSeleccionados.length === 1) {
                mostrarExito("Se ha eliminado 1 cliente correctamente.");
            } else {
                mostrarExito("Se han eliminado " + clientesSeleccionados.length + " clientes correctamente.");
            }
            
            setClientes((prev) =>
            prev.filter((c) => !clientesSeleccionados.includes(c.idCli))
            );
            setClientesSeleccionados([]);
            setMostrarConfirmacion(false);
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : "No se pudo conectar con el servidor";
            mostrarError(mensaje);
        } finally {
            setEliminando(false);
        }
    };

    const cancelarEliminarSeleccionados = () => {
        if (eliminando) return;
        setMostrarConfirmacion(false);
    };

    const abrirModalCambiarTipo = () => {
        if (clientesSeleccionados.length === 0) {
            mostrarError("Seleccioná al menos un cliente para cambiar el tipo");
            return;
        }

        if (tiposCliente.length === 0) {
            mostrarError("No hay tipos de cliente disponibles para seleccionar");
            return;
        }

        const primerTipo = tiposCliente[0];
        if (!primerTipo) {
            mostrarError("No hay tipos de cliente disponibles para seleccionar");
            return;
        }

        setIdTipoSeleccionado((prev) => prev || String(primerTipo.idTipoCli));
        setMostrarModalTipo(true);
    };

    const cancelarCambiarTipo = () => {
        if (actualizandoTipo) return;
        setMostrarModalTipo(false);
    };

    const confirmarCambiarTipo = async () => {
        if (clientesSeleccionados.length === 0) {
            setMostrarModalTipo(false);
            return;
        }

        const nuevoTipoId = Number(idTipoSeleccionado);
        if (Number.isNaN(nuevoTipoId)) {
            mostrarError("Seleccioná un tipo de cliente válido");
            return;
        }

        try {
            setActualizandoTipo(true);
            await cambiarTipoMultipleClientes(clientesSeleccionados, nuevoTipoId);

            setClientes((prev) =>
                prev.map((cliente) =>
                    clientesSeleccionados.includes(cliente.idCli)
                        ? { ...cliente, idTipoCli: nuevoTipoId }
                        : cliente
                )
            );

            const nombreTipo = tipoNombrePorId.get(nuevoTipoId) || `ID ${nuevoTipoId}`;
            mostrarExito(
                clientesSeleccionados.length === 1
                    ? `Se cambió el tipo del cliente a ${nombreTipo}.`
                    : `Se cambió el tipo de ${clientesSeleccionados.length} clientes a ${nombreTipo}.`
            );

            setMostrarModalTipo(false);
            setClientesSeleccionados([]);
        } catch (error) {
            const mensaje = error instanceof Error ? error.message : "No se pudo cambiar el tipo de cliente";
            mostrarError(mensaje);
        } finally {
            setActualizandoTipo(false);
        }
    };

        useEffect(() => {
                setClientesSeleccionados((prev) => prev.filter((id) => clientes.some((c) => c.idCli === id)));
        }, [clientes]);

        useEffect(() => {
                                if (!mostrarConfirmacion && !mostrarModalTipo) return;

                const manejarTeclaEscape = (event: KeyboardEvent) => {
                                                if (event.key === "Escape" && !operacionEnCurso) {
                                                                setMostrarConfirmacion(false);
                                                                setMostrarModalTipo(false);
                        }
                };

                window.addEventListener("keydown", manejarTeclaEscape);
                return () => window.removeEventListener("keydown", manejarTeclaEscape);
                }, [mostrarConfirmacion, mostrarModalTipo, operacionEnCurso]);

      useEffect(() => {
        const fetchClientes = async () => {
                    setError("");
          try {
                        const [data, tipos] = await Promise.all([buscarClienteFiltro(""), getTiposClientes()]);
                        const clientesNormalizados = Array.isArray(data) ? data : data ? [data] : [];
                        setClientes(clientesNormalizados);
                                                setTiposCliente(Array.isArray(tipos) ? tipos : []);
                        if (Array.isArray(tipos) && tipos.length > 0) {
                            const primerTipo = tipos[0];
                            if (primerTipo) {
                                setIdTipoSeleccionado(String(primerTipo.idTipoCli));
                            }
                                                }
          } catch (err) {
            setError("No se pudo conectar con el servidor.");
            setClientes([]);
                        setTiposCliente([]);
          } finally {
            setLoading(false);
          }
        };
        fetchClientes();
      }, []);

     return (
    <>
        <HeaderAdmin/>
        {notificacion && (
          <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
        )} 

        <div className="admin-page-container">
            <h2 className="admin-page-title">Panel de Administración - Clientes</h2>
            
                <BuscadorCliente onResultados={setClientes} setLoading={setLoading} />
            

            {loading && <p className="text-gray-500 mt-3 text-center">Buscando...</p>}

            {!loading && error && (
                <p className="no-data-message" role="alert">{error}</p>
            )}
            
            <div className="admin-actions-bar">
                <button
                    onClick={abrirModalCambiarTipo}
                    className="btn-change-type"
                    disabled={!puedeCambiarTipo}
                    aria-disabled={!puedeCambiarTipo}
                >
                    {actualizandoTipo ? "Cambiando tipo..." : `Cambiar tipo (${clientesSeleccionados.length})`}
                </button>
                <button
                    onClick={handleEliminarSeleccionados}
                    className="btn-delete-selected"
                    disabled={!puedeEliminar}
                    aria-disabled={!puedeEliminar}
                >
                    {eliminando ? "Eliminando..." : `Eliminar seleccionados (${clientesSeleccionados.length})`}
                </button>
            </div>


            {(!loading && clientes.length === 0) && (
                <p className="no-data-message">No se encontraron clientes que coincidan con la búsqueda.</p>
            )}

            {!loading && clientes.length > 0 && (
                <table className="admin-table" aria-label="Listado de clientes">
                    <thead>
                        <tr>
                            <th className="th-checkbox">
                                <input
                                    type="checkbox"
                                    checked={todosSeleccionados}
                                    onChange={toggleSeleccionTodos}
                                    title={todosSeleccionados ? "Deseleccionar todos" : "Seleccionar todos"}
                                    aria-label={todosSeleccionados ? "Deseleccionar todos los clientes" : "Seleccionar todos los clientes"}
                                    disabled={eliminando}
                                />
                            </th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Tipo Cliente</th>
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
                                        aria-label={`Seleccionar cliente ${cliente.nombreCli} ${cliente.apellido || ""}`.trim()}
                                        disabled={eliminando}
                                    />
                                </td>
                                <td>{cliente.nombreCli}</td>
                                <td>{cliente.apellido || 'N/A'}</td>
                                <td>{cliente.email}</td>
                                <td>{tipoNombrePorId.get(cliente.idTipoCli) || `ID ${cliente.idTipoCli}`}</td>
                                <td>{cliente.idCli}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

        {mostrarConfirmacion && (
            <div className="modal-overlay" onClick={cancelarEliminarSeleccionados}>
                <div
                    className="modal-confirmacion"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-eliminar-clientes-titulo"
                    aria-describedby="modal-eliminar-clientes-descripcion"
                >
                    <h2 id="modal-eliminar-clientes-titulo">¿Estás seguro de que quieres eliminar estos clientes?</h2>
                    <p id="modal-eliminar-clientes-descripcion">
                        {clientesSeleccionados.length === 1 ? "Se va a eliminar " : "Se van a eliminar "}
                        <strong>{clientesSeleccionados.length}</strong>
                        {clientesSeleccionados.length === 1 ? " cliente" : " clientes"}.
                    </p>
                    <div className="modal-botones">
                        <button
                            type="button"
                            className="modal-btn-confirmar"
                            onClick={() => void confirmarEliminarSeleccionados()}
                            disabled={eliminando}
                        >
                            {eliminando ? "Eliminando..." : "Sí, eliminar"}
                        </button>
                        <button
                            type="button"
                            className="modal-btn-cancelar"
                            onClick={cancelarEliminarSeleccionados}
                            disabled={eliminando}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {mostrarModalTipo && (
            <div className="modal-overlay" onClick={cancelarCambiarTipo}>
                <div
                    className="modal-confirmacion"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-cambiar-tipo-titulo"
                    aria-describedby="modal-cambiar-tipo-descripcion"
                >
                    <h2 id="modal-cambiar-tipo-titulo">Cambiar tipo de cliente</h2>
                    <p id="modal-cambiar-tipo-descripcion">
                        Seleccioná el nuevo tipo para <strong>{clientesSeleccionados.length}</strong>
                        {clientesSeleccionados.length === 1 ? " cliente." : " clientes."}
                    </p>

                    <label className="modal-select-label" htmlFor="tipo-cliente-select">Tipo de cliente</label>
                    <select
                        id="tipo-cliente-select"
                        className="modal-select"
                        value={idTipoSeleccionado}
                        onChange={(e) => setIdTipoSeleccionado(e.target.value)}
                        disabled={actualizandoTipo}
                    >
                        {tiposCliente.map((tipo) => (
                            <option key={tipo.idTipoCli} value={tipo.idTipoCli}>
                                {tipo.nombreTipo}
                            </option>
                        ))}
                    </select>

                    <div className="modal-botones">
                        <button
                            type="button"
                            className="modal-btn-confirmar"
                            onClick={() => void confirmarCambiarTipo()}
                            disabled={actualizandoTipo}
                        >
                            {actualizandoTipo ? "Guardando..." : "Guardar tipo"}
                        </button>
                        <button
                            type="button"
                            className="modal-btn-cancelar"
                            onClick={cancelarCambiarTipo}
                            disabled={actualizandoTipo}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
}