const API_URL = "http://localhost:4000/auth"; 

interface LoginCredenciales {
  email: string;
  password: string;
}

export const loginUsuario = async (credentials: LoginCredenciales) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  // Verificar si la respuesta fue exitosa (código 200)
  if (!response.ok) {
    // Si falla, mensaje de error del backend
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al conectar con el servidor.');
  }

  // Si es exitoso, devuelve los datos
  return response.json();
};

export const getAllClientes = async () => {
  try {
    const res = await fetch(`${API_URL}/getAllClientes`);
    if (!res.ok) throw new Error("Error al obtener clientes");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deleteMultipleClientes = async (ids: number[]) => {
  try {
    const res = await fetch(`${API_URL}/eliminar-multiple`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar clientes");
    }

    return data;
  } catch (error: any) {
    console.error("Error en deleteMultipleClientes:", error);
    throw error;
  }
};