import type { Cliente } from "./Cliente";
import type { PedidoProducto } from "./PedidoProducto";

export interface Pedido {
  idPedido: number;
  fechaPedido: Date;
  estadoPedido: string;
  idCli: number;
  cliente?: Cliente;
  pedidoProductos?: PedidoProducto[];
}
