import type { Producto } from "./Producto";
import type { Pedido } from "./Pedido";

export interface PedidoProducto {
  idPedido: number;
  idProd: number;
  cantidadProdPed: number;
  pedido?: Pedido;
  producto?: Producto;
}
