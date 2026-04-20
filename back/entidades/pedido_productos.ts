import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";
import { Pedido } from "./pedido";
import { Producto } from "./producto";

@Entity("pedidos_productos")
export class PedidoProducto {
  @PrimaryColumn({ name: "idPedido" })
  idPedido!: number;

  @PrimaryColumn({ name: "idProd" })
  idProd!: number;

  @Column({ type: "int" })
  cantidadProdPed!: number;

  @ManyToOne(() => Pedido, pedido => pedido.pedidoProductos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idPedido" })
  pedido!: Pedido;

  @ManyToOne(() => Producto, producto => producto.pedidoProductos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "idProd" })
  producto!: Producto;
}
