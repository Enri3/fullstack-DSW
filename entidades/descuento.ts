export interface Descuento {
    idDesc: number;
    porcentaje: number;
    fechaDesde: Date;
    fechaHasta: Date;
}

export const descuentoVacio: Descuento = {
    idDesc: 0,
    porcentaje: 0,
    fechaDesde: new Date(),
    fechaHasta: new Date(),
};
//Me deja poner más de un producto por descuento
export interface DescuentoConProductos {
  porcentaje: number;
  fechaDesde: Date;
  fechaHasta: Date;
  idsProductos: number[];
}


export const descuentoConProductosVacio: DescuentoConProductos = {
  porcentaje: 0,
  fechaDesde: new Date(),
  fechaHasta: new Date(),
  idsProductos: [],
};