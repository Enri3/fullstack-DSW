export interface Cliente {
  idCli: number;
  nombre: string;
  apellido: string;
  direccion: string;
  email: string;
  password: string;
  idTipoCli: number;
  creado_en: Date;
}

export interface TipoClientes {
  idTipoCli: number;
  nombreTipo: string;
  descuento: number;
}

export interface Productos {
  idProd: number;
  nombreProd: string;
  precio: number;
  urlImg: string;
  deleted:number;
  medida:string;
}

export const clienteVacio: Cliente = {
  idCli: 0,
  nombre: "",
  apellido: "",
  direccion: "",
  email: "",
  password: "",
  idTipoCli: 0,
  creado_en: new Date(),
};
