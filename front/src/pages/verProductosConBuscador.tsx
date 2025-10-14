import React, { useEffect, useState } from "react";
import HeaderClienteIngresado from "../components/header_clienteIngresado";
import Footer from "../components/footer";
import { getProductos , buscarProducto } from "../services/productosService";
import { agregarAlCarrito, obtenerCantidadCarrito } from "../services/cartService";
import { Link } from "react-router-dom";
import "../assets/styles/index.css";
import "../assets/styles/style.css";
import type { Producto } from "../../../entidades/producto";
import { productoVacio } from "../../../entidades/producto";

export default function VerProductos() {

    const [productos, setProductos] = useState<Producto[]>([]); 
      
    const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

      useEffect(() => {
        const fetchProductos = async () => {
            try {
            const data = await getProductos();
            console.log("Productos recibidos del backend:", data);
            setProductos(Array.isArray(data) ? data : [data]); 
            } catch (err) {
            console.error("Error al obtener productos:", err);
            setError("No se pudo conectar con el servidor.");
            setProductos([]);
            } finally {
            setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    console.log("aaa");
    const [productos2, setProductos2] = useState<Producto[]>([]);
    // 1. Estado para el texto de búsqueda
    const [query, setQuery] = useState('');
    // 2. Estado para almacenar los resultados
    const [resultados, setResultados] = useState([]);
    // 3. Estado para manejar la carga
    const [cargando, setCargando] = useState(false);

    // Función que se llama cada vez que el usuario escribe
    const handleInputChange = (e:any) => {
        setQuery(e.target.value);
    };

    // Efecto que se dispara cada vez que 'query' cambia (con un debounce)
    useEffect(() => {
        const realizarBusqueda = async () => {
            setCargando(true);
            try {
                // Llama al servicio que se comunica con el backend
                const data = await buscarProducto(query);
                setProductos2(data);
            } catch (err) {
                setError('Fallo al cargar los resultados. Inténtalo de nuevo.');
                setResultados([]); // Limpiar en caso de error
            } finally {
                setCargando(false);
            }
        };

        // Puedes usar un temporizador (debounce) para no saturar el servidor
        // (Busca solo 300ms después de que el usuario dejó de escribir)
        const timeoutId = setTimeout(realizarBusqueda, 300);

        // Función de limpieza de useEffect: cancela la búsqueda anterior
        return () => {
            clearTimeout(timeoutId);
        };
    }, [query]); // Se ejecuta cada vez que 'query' cambia


    return(
    <>
<h1>Buscador de Elementos</h1>
<input
    type="text"
    placeholder="Escribe para buscar..."
    value={query}
    onChange={handleInputChange}
/>

{cargando && <p>Cargando resultados...</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}

<h2>Resultados ({resultados.length})</h2>
    <section id="productos-container-display">


        {loading && <p>Cargando productos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && productos2.length > 0 && productos2.map((producto) => (
    
        <div key={producto.id} className="tarjeta-producto-display">
        <Link to="/detalleCliente" state={{ id: producto.id }}>
            <img
            src={producto.urlImg || "/placeholder.png"}
            alt={producto.nombre}
            />
            <h3>
            {producto.nombre} - {producto.medida || "N/A"} grs
            </h3>
            <p className="precio">${producto.precio}</p>
        </Link>
        </div>
        ))}

        {!loading && productos2.length === 0 && !error && (
        <p>No hay productos disponibles.</p>
        )}
    </section>
    </>);
}