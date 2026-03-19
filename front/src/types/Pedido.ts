import type { Cliente } from "./Cliente";
import type { PedidoProducto } from "./PedidoProducto";

export interface Pedido {
  idPedido: number;
  fechaPedido: Date;
  estadoPedido: string;
  formaEntrega?: string;
  medioPago?: string;
  montoTotal?: number;
  montoPagado?: number;
  vuelto?: number;
  idCli: number;
  cliente?: Cliente;
  pedidoProductos?: PedidoProducto[];
}
