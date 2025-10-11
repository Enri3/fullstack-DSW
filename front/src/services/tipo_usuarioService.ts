const API_URL = "http://localhost:4000/tipo_usuarios";

interface GetNombreTipo {
  id: number;
}

export const getNombreTipo = async (idTipo: GetNombreTipo) => {
  const response = await fetch(`${API_URL}/obtener?id=${idTipo.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al conectar con el servidor.');
  }
  return response.json();
};