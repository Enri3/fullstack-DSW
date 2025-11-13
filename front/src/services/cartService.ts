
export interface Producto {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  urlImg?: string;
  medida?: string;
}

export interface ProductoConCantidad extends Producto {
  cantidad: number;
}

export function agregarAlCarrito(producto: Producto): number {
  const memoria: ProductoConCantidad[] = JSON.parse(localStorage.getItem("productos") || "[]");
  let cuenta = 0;

  const indiceProducto = memoria.findIndex((p) => p.idProd === producto.idProd);

  if (indiceProducto === -1) {
    memoria.push({ ...producto, cantidad: 1 });
    cuenta = 1;
  } else {
    if (memoria[indiceProducto]) {
      memoria[indiceProducto].cantidad += 1;
      cuenta = memoria[indiceProducto].cantidad;
    }
  }

  localStorage.setItem("productos", JSON.stringify(memoria));
  actualizarCarrito();
  return cuenta;
}

export function restarAlCarrito(producto: Producto): void {
  const memoria: ProductoConCantidad[] = JSON.parse(localStorage.getItem("productos") || "[]");
  const indiceProducto = memoria.findIndex((p) => p.idProd === producto.idProd);

  if (indiceProducto === -1) return; 
  if (memoria[indiceProducto] && memoria[indiceProducto].cantidad === 1) {
    memoria.splice(indiceProducto, 1); 
  } else if (memoria[indiceProducto]) {
    memoria[indiceProducto].cantidad -= 1;
  }

  localStorage.setItem("productos", JSON.stringify(memoria));
  actualizarCarrito();
}

export function obtenerProductosCarrito(): Producto[] {
  return JSON.parse(localStorage.getItem("productos") || "[]");
}

export function getNuevoProducto(producto: Producto): ProductoConCantidad {
  return { ...producto, cantidad: 1 };
}

export function actualizarCarrito(): number {
  const memoria: ProductoConCantidad[] = JSON.parse(localStorage.getItem("productos") || "[]");
  return memoria.reduce((acum, current) => acum + current.cantidad, 0);
}

export function obtenerCantidadCarrito(): number {
  return actualizarCarrito();
}

export function reiniciarCarrito(): void {
  localStorage.removeItem("productos");
  actualizarCarrito();
}