import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  obtenerCantidadCarrito, 
  reiniciarCarrito, 
  obtenerProductosCarrito 
} from "../services/cartService";

type ProductoCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  urlImg: string;
};

export default function CerrarSesion() {
  const [cantidad, setCantidad] = useState(obtenerCantidadCarrito());
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [cerrando, setCerrando] = useState(true);

  useEffect(() => {
    // Elimina datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("cliente");

    // Reinicia el carrito
    reiniciarCarrito();
    setProductos([]);
    setCantidad(0);

    // Pequeño retardo opcional antes de navegar (por si querés asegurar limpieza)
    const timer = setTimeout(() => setCerrando(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Redirige al inicio cuando termina de cerrar sesión
  if (!cerrando) {
    return <Navigate to="/" replace />;
  }

  return null; // mientras se ejecuta el cierre, no muestra nada
}