import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import HeaderConPanel from "../components/header_conBotonPanel";
import Footer from "../components/footer";
import MensajeAlerta from "../components/mensajesAlerta";
import { usarNotificacion } from "../mensajes/usarNotificacion";
import Detalle from "../components/DetalleProducto";
import { agregarAlCarrito, obtenerCantidadCarrito,obtenerProductosCarrito } from "../services/cartService";
import { getProductoById } from "../services/productosService";
import { agregarProductoEnCarrito } from "../services/pedidosService";
import type { Cliente } from "../types/Cliente";

import "../assets/styles/index.css";
import "../assets/styles/style.css";
import "../assets/styles/eliminarClientes.css";

interface Producto {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  medida?: string;
  urlImg?: string;
  stock: number;
}
interface ProductoCarrito extends Producto {
  cantidad: number;
}

export default function DetalleCliente() {
  const location = useLocation();
  const state = location.state as { idProd?: number } | null;
  const idProd = state?.idProd;
  const { notificacion, mostrarError, mostrarExito, limpiar } = usarNotificacion();

  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  if (!idProd) {
    return <p style={{ color: "red" }}>ID de producto no válido o no recibido.</p>;
  }

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        limpiar();
        const data = await getProductoById(idProd);
        setProducto(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [idProd]);

  const handleAgregar = async () => {
    if (!producto) return;

    try {
      const productoReal = await getProductoById(producto.idProd);
      const prods = obtenerProductosCarrito() as ProductoCarrito[];
      const prod = prods.find(p => p.idProd === producto.idProd);
      const cantidadActual = prod?.cantidad ?? 0;
      const stockDisponible = Number(productoReal.stock) - (cantidadActual+1);
      
      if (stockDisponible < 0) {
          mostrarError(
            "Este producto no tiene stock suficiente. Tu pedido será por encargo y puede tardar aproximadamente 15 días."
        );}
        else{
          mostrarExito(`${producto.nombreProd} agregado al carrito`);
        }
      const clienteStorage = localStorage.getItem("cliente");

      if (!clienteStorage) {
        mostrarError("Debe iniciar sesión para agregar productos al carrito.");
        return;
      }

      const cliente = JSON.parse(clienteStorage) as Cliente;
      await agregarProductoEnCarrito(cliente.idCli, producto.idProd, 1);

      agregarAlCarrito(producto);
      setCantidad(obtenerCantidadCarrito());
      
    } catch (err) {
      console.error("Error al agregar producto al pedido en carrito:", err);
      mostrarError("No se pudo agregar el producto al carrito.");
    }
  };


  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!producto) return <p>Producto no encontrado.</p>;

  return (
    <>
      <HeaderConPanel cantidad={cantidad} />
      {notificacion && (
        <MensajeAlerta tipo={notificacion.tipo} texto={notificacion.texto} />
      )}

      <Detalle/>

      <div className="botones-detalle">
        <button onClick={() => void handleAgregar()} className="boton-detalle">
          Agregar al carrito
        </button>
        <Link to="/productosCliente">
          <button className="boton-detalle">Volver</button>
        </Link>
        
      </div>

      <Footer />
    </>
  );
}