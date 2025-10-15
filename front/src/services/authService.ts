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

export const cambiarPassword = async (idCli: number, passwordAnterior: string, passwordNueva: string) => {
  try {
    const respuesta = await fetch(`${API_URL}/cambiar-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idCli, passwordAnterior, passwordNueva }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data.message || "Error al cambiar la contraseña");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error de conexión con el servidor");
  }
};

export const buscarClienteFiltro = async (nombre_emailCliente: string) => {
  try {
    const res = await fetch(`${API_URL}/buscarClienteFiltro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_emailCliente }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al buscar cliente desde el service");
    }

    return data;
  } catch (error) {
    console.error("Error al buscar cliente:", error);
    throw error;
  }
};