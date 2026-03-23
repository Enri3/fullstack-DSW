import HeaderAdmin from "../components/header_admin";
import { Link } from "react-router-dom";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import { obtenerCantidadCarrito } from "../services/cartService";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import type { DescuentoEncontrado } from "../types/Descuentos";
import { buildImageUrl } from "../utils/imageUrl";

import { eliminarDescuentos, buscarDescuentoFiltro } from "../services/descunetosService";
import "../assets/styles/eliminarClientes.css";
import BuscadorDescuento from "../components/buscadorDescuento";

type DescuentoPorIdMap = Record<number, {
  idDesc: number;
  porcentaje: number;
  fechaDesde: Date;
  fechaHasta: Date;
  productos: DescuentoEncontrado[];
}>;

export default function Descuentos() {
  const { notificacion, mostrarError, mostrarExito } = usarNotificacion();
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [loading, setLoading] = useState<boolean>(true);
  const [descuentos, setDescuentos] = useState<DescuentoEncontrado[]>([]);


  const navigator = useNavigate();
  const [descuentosSeleccionados, setDescuentosSeleccionados] = useState<number[]>([]);
  const [termino, setTermino] = useState("");
  const [error, setError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalProductosVisible, setModalProductosVisible] = useState<boolean>(false);
  const [descuentoEnModal, setDescuentoEnModal] = useState<{
    idDesc: number;
    porcentaje: number;
    fechaDesde: Date;
    fechaHasta: Date;
    productos: DescuentoEncontrado[];
  } | null>(null);

  const descuentosPorId = descuentos.reduce<DescuentoPorIdMap>((acc, item) => {
    if (!acc[item.idDesc]) {
      acc[item.idDesc] = {
        idDesc: item.idDesc,
        porcentaje: item.porcentaje,
        fechaDesde: item.fechaDesde,
        fechaHasta: item.fechaHasta,
        productos: [],
      };
    }
    const grupo = acc[item.idDesc];
    if (grupo) {
      grupo.productos.push(item);
    }
    return acc;
  }, {});

  const listaDescuentos = Object.values(descuentosPorId);

  const abrirModalProductos = (idDesc: number) => {
    const descuentoSeleccionado = descuentosPorId[idDesc];
    if (!descuentoSeleccionado) return;
    setDescuentoEnModal(descuentoSeleccionado);
    setModalProductosVisible(true);
  };

  const fetchDescuentos = async () => {
    try {
      setLoading(true);
      const data = await buscarDescuentoFiltro("");
      setDescuentos(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al obtener Descuento:", err);
      setError("No se pudo conectar con el servidor.");
      setDescuentos([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeleccion = (id: number) => {
        setDescuentosSeleccionados((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSeleccionTodos = () => {
      if (descuentosSeleccionados.length === listaDescuentos.length && listaDescuentos.length > 0) {
        setDescuentosSeleccionados([]);
        } else {
      setDescuentosSeleccionados(listaDescuentos.map((d) => d.idDesc));
        }
    };

  const handleEliminarSeleccionados = () => {
    if (descuentosSeleccionados.length === 0) {
      mostrarError("Seleccioná al menos un descuento para eliminar");
      return;
    }
    setModalVisible(true);
  };

  const confirmarEliminar = async () => {
    try {
      const data = await eliminarDescuentos(descuentosSeleccionados);

      mostrarExito(data.message);

      await fetchDescuentos();
      setDescuentosSeleccionados([]);
    } catch (error: any) {
      mostrarError(error.message || "No se pudo conectar con el servidor");
    } finally {
      setModalVisible(false);
    }
  };

   
    useEffect(() => {
      void fetchDescuentos();
    }, []);


 

 return (
     <>
         <HeaderAdmin/>
         {notificacion && (
           <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
         )} 
 
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

                 <Link to="/nuevo-descuento" className="btn-new-item">
                     Crear Nuevo Descuento
                 </Link>
             </div>

 
             {(!loading && descuentos.length === 0) && (
                 <p className="no-data-message">No se encontraron descuentos que coincidan con la búsqueda.</p>
             )}
 
             {!loading && listaDescuentos.length > 0 && (
                 <table className="admin-table">
                     <thead>
                         <tr>
                             <th className="th-checkbox">
                                 
                                 <input
                                     type="checkbox"
                         checked={descuentosSeleccionados.length === listaDescuentos.length && listaDescuentos.length > 0}
                                     onChange={toggleSeleccionTodos}
                         title={descuentosSeleccionados.length === listaDescuentos.length ? "Deseleccionar todos" : "Seleccionar todos"}
                                 />
                             </th>
                             
                             <th>Descuento</th>
                             <th>Fecha Desde</th>
                             <th>Fecha Hasta</th>
                     <th>Productos</th>
                         </tr>
                     </thead>
                     <tbody>
                   {listaDescuentos.map((itemDescuento) => (
                     <tr key={(itemDescuento.idDesc)}>
                                 <td className="td-checkbox">
                                     <input
                                         type="checkbox"
                           checked={descuentosSeleccionados.includes(itemDescuento.idDesc)}
                           onChange={() => toggleSeleccion(itemDescuento.idDesc)}
                                     />
                                 </td>
                                  
                       <td>{itemDescuento.porcentaje} %</td>
                      <td>{new Date(itemDescuento.fechaDesde).toLocaleDateString()}</td>
                      <td>{new Date(itemDescuento.fechaHasta).toLocaleDateString()}</td>
                                 <td>
                                  <button
                                    type="button"
                                    className="btn-new-item"
                        onClick={() => abrirModalProductos(itemDescuento.idDesc)}
                                  >
                        Ver productos ({itemDescuento.productos.length})
                                  </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
         </div>

         {modalVisible && (
           <div className="modal-overlay" onClick={() => setModalVisible(false)}>
             <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
               <h2>¿Estás seguro de que quieres eliminar los descuentos seleccionados?</h2>
               <p><strong>{descuentosSeleccionados.length} descuento(s) será(n) eliminado(s)</strong></p>
               <div className="modal-botones">
                 <button
                   type="button"
                   className="modal-btn-confirmar"
                   onClick={confirmarEliminar}
                 >
                   Sí, eliminar
                 </button>
                 <button
                   type="button"
                   className="modal-btn-cancelar"
                   onClick={() => setModalVisible(false)}
                 >
                   Cancelar
                 </button>
               </div>
             </div>
           </div>
         )}

         {modalProductosVisible && descuentoEnModal && (
           <div className="modal-overlay" onClick={() => setModalProductosVisible(false)}>
             <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
               <h2>Productos del descuento #{descuentoEnModal.idDesc}</h2>
               <p>
                 <strong>{descuentoEnModal.porcentaje}%</strong> | Desde {new Date(descuentoEnModal.fechaDesde).toLocaleDateString()} hasta {new Date(descuentoEnModal.fechaHasta).toLocaleDateString()}
               </p>

               <table className="admin-table" style={{ marginTop: "1rem" }}>
                 <thead>
                   <tr>
                     <th>Imagen</th>
                     <th>Nombre</th>
                     <th>Medida</th>
                     <th>Stock</th>
                   </tr>
                 </thead>
                 <tbody>
                   {descuentoEnModal.productos.map((producto) => (
                     <tr key={`${descuentoEnModal.idDesc}-${producto.idProd}`}>
                       <td>
                         <img
                           src={buildImageUrl(producto.urlImg)}
                           alt={producto.nombreProd}
                           style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "6px" }}
                         />
                       </td>
                       <td>{producto.nombreProd}</td>
                       <td>{producto.medida || "-"}</td>
                       <td>{producto.stock}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>

               <div className="modal-botones">
                 <button
                   type="button"
                   className="modal-btn-cancelar"
                   onClick={() => setModalProductosVisible(false)}
                 >
                   Cerrar
                 </button>
               </div>
             </div>
           </div>
         )}
     </>
   );
}