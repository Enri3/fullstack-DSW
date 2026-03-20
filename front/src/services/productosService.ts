type Producto = {
  idProd: number;
  nombreProd: string;
  medida?: string;
  precioProd: number;
  urlImg?: string;
  deleted?: number;

};

export async function getProductos() { 
  const res = await fetch("http://localhost:4000/productos"); 
  if (!res.ok) throw new Error("Error al obtener productos"); 
  const data = await res.json(); 
  console.log("Datos recibidos del backend:", data); 
  return data; }
  

export async function getProductosEnAlta() {
  const res = await fetch("http://localhost:4000/productos/enAlta"); 
  if (!res.ok) throw new Error("Error al obtener productos en alta"); 
  const data = await res.json(); 
  console.log("Datos recibidos del backend:", data); 
  return data; }

export async function getProductoById(idProd: number): Promise<Producto> {
  const res = await fetch(`http://localhost:4000/productos/${idProd}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al obtener producto");
  return data as Producto;
}

export async function updateProducto(
  idProd: string | number,
  producto: Producto
): Promise<Producto> {
  const res = await fetch(`http://localhost:4000/productos/update/${idProd}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al actualizar producto");
  return data as Producto;
}

export async function eliminarProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`http://localhost:4000/productos/${idProd}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}
export async function darDeAltaProducto(idProd: string | number): Promise<void> {
  const res = await fetch(`http://localhost:4000/productos/darDeAlta/${idProd}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al dar de alta producto");
}

export const buscarProducto = async (nombreProdBuscado: string, admin: boolean) => {
  try {
    const res = await fetch(`http://localhost:4000/productos/buscarProductoPorNombre`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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