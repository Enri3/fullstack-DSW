import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pedido } from "./pedido";

@Entity("clientes")
export class Cliente {
  @PrimaryGeneratedColumn()
  idCli!: number;

  @Column({ length: 100 })
  nombreCli!: string;

  @Column({ length: 100 })
  apellido!: string;

  @Column({ length: 200 })
  direccion!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ type: "timestamp" })
  creado_en!: Date;

  @Column()
  idTipoCli!: number;

  @OneToMany(() => Pedido, pedido => pedido.cliente)
  pedidos!: Pedido[];
}