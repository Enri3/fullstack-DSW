type Producto = {
  idProd: number;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;
  deleted?: number;
  stock: number;

};

function getAuthHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProductos() { 
  const res = await fetch("http://localhost:4000/productos", {
    headers: getAuthHeaders(),
  }); 
  if (!res.ok) throw new Error("Error al obtener productos"); 
  const data = await res.json(); 
  console.log("Datos recibidos del backend:", data); 
  return data; }
  

export async function getProductosEnAlta() {
  const res = await fetch("http://localhost:4000/productos/enAlta", {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Error al obtener productos en alta");

  const data = await res.json();
  console.log("Datos recibidos del backend:", data);
  return data;
}

export async function getProductoById(idProd: number): Promise<Producto> {
  const res = await fetch(`http://localhost:4000/productos/${idProd}`);
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

  const res = await fetch(`http://localhost:4000/productos/update/${idProd}`, {
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar producto");
  return data as Producto;
}

export async function eliminarProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`http://localhost:4000/productos/${idProd}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
export async function darDeAltaProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`http://localhost:4000/productos/darDeAlta/${idProd}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al dar de alta producto");
}

export const buscarProducto = async (nombreProdBuscado: string, admin: boolean) => {
  try {
    const res = await fetch(`http://localhost:4000/productos/buscarProductoPorNombre`, {
      method: "POST",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ nombreProdBuscado, admin }),
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