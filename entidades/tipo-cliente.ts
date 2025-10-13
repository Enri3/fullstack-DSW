export interface TipoClientes {
  idTipoCli: number;
  nombreTipo: string;
  descuento: number;
}

export const tipoClienteVacio: TipoClientes = {
  idTipoCli: 0,
  nombreTipo: "",
  descuento: 0,
};