type Producto = {
  id: number | string;
  nombre: string;
  medida?: string;
  precio: number;
  urlImg?: string;

};

// Traer todos los productos
export async function getProductos() { 
  const res = await fetch("http://localhost:4000/productos"); 
  if (!res.ok) throw new Error("Error al obtener productos"); 
  const data = await res.json(); 
  console.log("Datos recibidos del backend:", data); // <- muy importante 
  return data; }
  // ¡Debe ser un array! 

// Obtener un producto por ID
export async function getProductoById(id: string | number): Promise<Producto> {
  const res = await fetch(`http://localhost:4000/productos/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener producto");
  return data as Producto;
}

// Actualizar producto
export async function updateProducto(
  id: string | number,
  producto: Producto
): Promise<Producto> {
  const res = await fetch(`http://localhost:4000/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar producto");
  return data as Producto;
}

// Eliminar producto por ID
export async function eliminarProducto(id: string | number): Promise<void> {
  const res = await fetch(`http://localhost:4000/productos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}

const API_URL = "http://localhost:4000/producto"; 

export const buscarProducto = async (nombreProdBuscado : string) => {
  try {
    const res = await fetch(`${API_URL}/buscarPorNombre`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreProdBuscado }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Error al eliminar clientes tomado desde el service");
    }
    return data;
  }
  catch(error) {
      console.error('Error al buscar elementos:', error);
      throw error; 
    }
}