
import "../assets/styles/index.css"; 
import "../assets/styles/style.css"; 
import React, { useState, useEffect } from "react";
import { buscarClienteFiltro } from "../services/authService";

interface BuscadorClienteProps {
  onResultados: (clientes: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export default function BuscadorCliente({ onResultados, setLoading }: BuscadorClienteProps) {
  const [termino, setTermino] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleBuscar(termino);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [termino]);

  const handleBuscar = async (nombre_emailCliente: string) => {
    try {
      setLoading(true);
      const data = await buscarClienteFiltro(nombre_emailCliente);
      onResultados(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al buscar cliente:", err);
      onResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscador-container">
      <h2 className="text-2xl font-semibold mb-4 text-center">Buscar Cliente</h2>
      <input
        type="text"
        placeholder="Escribe el nombre o email del cliente..."
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}