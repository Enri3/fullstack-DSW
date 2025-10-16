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


