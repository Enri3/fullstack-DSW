export interface Producto {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  precioFinalProd?: number;
  porcentajeDescuentoProducto?: number;
  porcentajeDescuentoTipoCliente?: number;
  urlImg?: string;
  deleted?: number;
  medida?: string;
  stock: number;
}


