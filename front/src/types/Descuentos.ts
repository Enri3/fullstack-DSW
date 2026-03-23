export interface Descuento {
  idDesc: number;
  porcentaje: number;
  fechaDesde: Date;
  fechaHasta: Date;
}

export interface DescuentoConProductos {
  porcentaje: number;
  fechaDesde: Date;
  fechaHasta: Date;
  idsProductos: number[];
}

export interface DescuentoEncontrado {
  idProd: number;
  nombreProd: string;
  medida: string;
  stock: number;
  urlImg?: string;
  idDesc: number;
  porcentaje: number;
  fechaDesde: Date;
  fechaHasta: Date;
}
