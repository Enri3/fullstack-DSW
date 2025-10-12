const API_URL = "http://localhost:4000/tipo_usuarios";

interface GetNombreTipo {
  id: number;
}

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

    // Devuelve solo el nombre del tipo de cliente
    return data.nombreTipoCli; 
  } catch (error) {
    console.error("Error en getClientTypeName:", error);
    throw error;
  }
};