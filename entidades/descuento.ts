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

export interface DescuentoConProducto {
    porcentaje: number;
    fechaDesde: Date;
    fechaHasta: Date;
    idProd: number;
}

export const descuentoConProductoVacio: DescuentoConProducto = {
    porcentaje: 0,
    fechaDesde: new Date(),
    fechaHasta: new Date(),
    idProd: 0
};