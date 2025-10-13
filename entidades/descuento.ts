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

export interface DescuentoConProducto extends Descuento {
    idProd: number;
    nombreProd: string;
    precio: number;
    urlImg: string;
    deleted:number;
    medida:string;
}

export const descuentoConProductoVacio: DescuentoConProducto = {
    idDesc: 0,
    porcentaje: 0,
    fechaDesde: new Date(),
    fechaHasta: new Date(),
    idProd: 0,
    nombreProd: "",
    precio: 0,
    urlImg: "",
    deleted: 0,
    medida: ""
};