const API_URL = "http://localhost:4000/api/auth"; 

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