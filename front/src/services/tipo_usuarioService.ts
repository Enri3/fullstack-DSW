import { URL_BACK } from "./apiConfig";
const API_URL = `${URL_BACK}/tipo_usuarios`;

interface GetNombreTipo {
  id: number;
}

export interface TipoClienteOption {
  idTipoCli: number;
  nombreTipo: string;
}

export const getTiposClientes = async (): Promise<TipoClienteOption[]> => {
  try {
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener los tipos de cliente");
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error en getTiposClientes:", error);
    throw error;
  }
};

export const getNombreTipo = async (idTipoCli : Number) => {
  try {
    const response = await fetch(`${API_URL}/obtener/${idTipoCli}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error al obtener el tipo de cliente con ID: ${idTipoCli}`);
    }

    return data.nombreTipoCli; 
  } catch (error) {
    console.error("Error en getClientTypeName:", error);
    throw error;
  }
};