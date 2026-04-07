export interface Descuento {
  idDesc: number;
  porcentaje: number;
  fechaDesde: string | Date;
  fechaHasta: string | Date;
}

export interface DescuentoConProductos {
  porcentaje: number;
  fechaDesde: string | Date;
  fechaHasta: string | Date;
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
  fechaDesde: string | Date;
  fechaHasta: string | Date;
}
