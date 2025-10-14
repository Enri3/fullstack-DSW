export interface Cliente {
  idCli: number;
  nombreCli: string;
  apellido: string;
  direccion: string;
  email: string;
  password: string;
  idTipoCli: number;
  creado_en: Date;
}

export const clienteVacio: Cliente = {
  idCli: 0,
  nombreCli: "",
  apellido: "",
  direccion: "",
  email: "",
  password: "",
  idTipoCli: 0,
  creado_en: new Date(),
};
