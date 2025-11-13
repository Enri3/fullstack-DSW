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

    localStorage.removeItem("token");
    localStorage.removeItem("cliente");

    reiniciarCarrito();
    setProductos([]);
    setCantidad(0);

    const timer = setTimeout(() => setCerrando(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!cerrando) {
    return <Navigate to="/" replace />;
  }

  return null; 
}