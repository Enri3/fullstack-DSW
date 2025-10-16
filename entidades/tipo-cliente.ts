import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "tipo_clientes" })
export class TipoCliente {
  @PrimaryGeneratedColumn({ name: "idTipoCli" })
  idTipoCli!: number;

  @Column({ name: "nombreTipo", length: 100 })
  nombreTipo!: string;

  @Column({ name: "descuento", type: "float", default: 0 })
  descuento!: number;
}