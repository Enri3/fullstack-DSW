
import "../assets/styles/index.css"; 
import "../assets/styles/style.css"; 
import React, { useState, useEffect } from "react";
import { buscarProducto } from "../services/productosService";

interface BuscadorProductoProps {
  onResultados: (productos: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function BuscadorProducto({ onResultados, setLoading }: BuscadorProductoProps) {
  const [termino, setTermino] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleBuscar(termino);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const handleBuscar = async (nombreProd: string) => {
    try {
      setLoading(true);
      const data = await buscarProducto(nombreProd);
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
      <h2 className="text-2xl font-semibold mb-4 text-center">Buscar Productos</h2>
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Escribe el nombre del producto..."
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        className="w-1/4 min-w-[200px] max-w-[400px] p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
      />
    </div>
  </div>
  );
}