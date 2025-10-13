export interface Producto {
  idProd: number;
  nombreProd: string;
  precio: number;
  urlImg: string;
  deleted:number;
  medida:string;
}

export const productoVacio: Producto = {
    idProd: 0,
    nombreProd: "",
    precio: 0,
    urlImg: "",
    deleted: 0,
    medida: ""
};