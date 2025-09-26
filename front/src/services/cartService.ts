
export interface Producto {
  id: number | string;
  nombre: string;
  precio: number;
  urlImg?: string;
  medida?: string;
  cantidad: number;
}

/*Agrega un producto al carrito en localStorage.*/
/* Retorna la cantidad total de ese producto en el carrito. */
export function agregarAlCarrito(producto: Producto): number {
  const memoria: Producto[] = JSON.parse(localStorage.getItem("productos") || "[]");
  let cuenta = 0;

  const indiceProducto = memoria.findIndex((p) => p.id === producto.id);

  if (indiceProducto === -1) {
    // Producto no existe en el carrito, agrego con cantidad 1
    memoria.push({ ...producto, cantidad: 1 });
    cuenta = 1;
  } else {
    // Producto ya existe, sumo 1 a la cantidad
    if (memoria[indiceProducto]) {
      memoria[indiceProducto].cantidad += 1;
      cuenta = memoria[indiceProducto].cantidad;
    }
  }

  localStorage.setItem("productos", JSON.stringify(memoria));
  actualizarCarrito();
  return cuenta;
}

//Resta 1 al producto en el carrito.  
//Si la cantidad llega a 0, lo elimina del carrito.
export function restarAlCarrito(producto: Producto): void {
  const memoria: Producto[] = JSON.parse(localStorage.getItem("productos") || "[]");
  const indiceProducto = memoria.findIndex((p) => p.id === producto.id);

  if (indiceProducto === -1) return; // Producto no encontrado

  if (memoria[indiceProducto] && memoria[indiceProducto].cantidad === 1) {
    memoria.splice(indiceProducto, 1); // Eliminar del carrito
  } else if (memoria[indiceProducto]) {
    memoria[indiceProducto].cantidad -= 1;
  }

  localStorage.setItem("productos", JSON.stringify(memoria));
  actualizarCarrito();
}


 // Devuelve todos los productos en el carrito

export function obtenerProductosCarrito(): Producto[] {
  return JSON.parse(localStorage.getItem("productos") || "[]");
}

// Inicializa un nuevo producto con cantidad 1*/
export function getNuevoProducto(producto: Producto): Producto {
  return { ...producto, cantidad: 1 };
}

//Calcula y devuelve la cantidad total de productos en el carrito */
export function actualizarCarrito(): number {
  const memoria: Producto[] = JSON.parse(localStorage.getItem("productos") || "[]");
  return memoria.reduce((acum, current) => acum + current.cantidad, 0);
}

// Devuelve la cantidad total de productos en el carrito

export function obtenerCantidadCarrito(): number {
  return actualizarCarrito();
}

// Reinicia el carrito (lo vacía) 
export function reiniciarCarrito(): void {
  localStorage.removeItem("productos");
  actualizarCarrito();
}