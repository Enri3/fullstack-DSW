/*export async function getProductos(){
    const res = await fetch("http://localhost:4000/productos");
    const resJson = await res.json();
    return resJson;
}*/

export async function getProductos() {
  const res = await fetch("http://localhost:4000/productos");
  if (!res.ok) throw new Error("Error al obtener productos");
  const data = await res.json();
  console.log("Datos recibidos del backend:", data); // <- muy importante
  return data; // ¡Debe ser un array!
}