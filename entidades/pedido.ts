import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Cliente } from "./cliente";
import { PedidoProducto } from "./pedido_productos";

@Entity("pedidos")
export class Pedido {
  @PrimaryGeneratedColumn()
  idPedido!: number;

  @Column({ name: "fechaPedido", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fechaPedido!: Date;

  @Column({ length: 50 })
  estadoPedido!: string;

  @Column({ length: 30, nullable: true })
  formaEntrega?: string;

  @Column({ length: 30, nullable: true })
  medioPago?: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  montoTotal?: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  montoPagado?: number;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  vuelto?: number;

  @Column({ name: "idCli" })
  idCli!: number;

  @ManyToOne(() => Cliente, cliente => cliente.pedidos)
  @JoinColumn({ name: "idCli" })
  cliente!: Cliente;

  @OneToMany(() => PedidoProducto, pedidoProducto => pedidoProducto.pedido)
  pedidoProductos!: PedidoProducto[];
}
