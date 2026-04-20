type Producto = {
  idProd: number;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  precioFinalProd?: number;
  urlImg?: string;
  deleted?: number;
  stock: number;
  encargo: number;

};

import { URL_BACK } from "./apiConfig";
const API_URL = `${URL_BACK}/productos`;

function getAuthHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProductos() { 
  const res = await fetch("https://backvivelas.up.railway.app/productos", {
    headers: getAuthHeaders(),
  }); 
  if (!res.ok) throw new Error("Error al obtener productos"); 
  const data = await res.json(); 
  console.log("Datos recibidos del backend:", data); 
  return data; }
  

export async function getProductosEnAlta() {
  const data = await getProductos();
  const productos = Array.isArray(data) ? data : [];
  return productos.filter((p) => Number(p.deleted ?? 0) === 0);
}

export async function getProductoById(idProd: number): Promise<Producto> {
  const res = await fetch(`${API_URL}/${idProd}`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener producto");
  return data as Producto;
}

export async function updateProducto(
  idProd: string | number,
  producto: Producto | FormData
): Promise<Producto> {
  const options: RequestInit = {
    method: "PUT",
  };

  if (producto instanceof FormData) {
    options.body = producto;
    options.headers = getAuthHeaders();
  } else {
    options.headers = getAuthHeaders({ "Content-Type": "application/json" });
    options.body = JSON.stringify(producto);
  }

  const res = await fetch(`${API_URL}/update/${idProd}`, {
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar producto");
  return data as Producto;
}

export async function eliminarProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/${idProd}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
export async function darDeAltaProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/darDeAlta/${idProd}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al dar de alta producto");
}

export const buscarProducto = async (nombreProdBuscado: string, admin: boolean) => {
  try {
    const res = await fetch(`${API_URL}/buscarProductoPorNombre`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        nombreProdBuscado,
        admin,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error al buscar producto desde el service");
    }

    return data;
  } catch (error) {
    console.error("Error al buscar producto:", error);
    throw error;
  }
};