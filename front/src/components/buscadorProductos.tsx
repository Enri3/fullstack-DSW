import "../assets/styles/index.css"; 
import "../assets/styles/style.css"; 
import React, { useState, useEffect } from "react";
import { buscarProducto } from "../services/productosService";

interface BuscadorProductoProps {
  onResultados: (productos: any[]) => void;
  setLoading: (loading: boolean) => void;
  onReset?: () => void;
  admin: boolean; 
}

export default function BuscadorProducto({
  onResultados,
  setLoading,
  onReset,
  admin
}: BuscadorProductoProps) {

  const [termino, setTermino] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      
      if (termino.trim() === "") {
        if (onReset) {
          onReset(); 
        }
        return;
      }

      handleBuscar(termino);

    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const handleBuscar = async (nombreProd: string) => {
    try {
      setLoading(true);

      const data = await buscarProducto(nombreProd, admin);

      onResultados(Array.isArray(data) ? data : [data]);

    } catch (err) {
      console.error("Error al buscar producto:", err);
      onResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador-container">
      <h2>Buscar Productos</h2>
      <input
        type="text"
        placeholder="Escribe el nombre del producto..."
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
      />
    </div>
  );
}