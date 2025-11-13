import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { OneToMany } from "typeorm";
import { ProductoDescuento } from "./productos_descuentos";

@Entity({ name: "productos" })
export class Producto {
  @PrimaryGeneratedColumn({ name: "idProd" })
  idProd!: number;

  @Column({ name: "nombreProd", length: 100 })
  nombreProd!: string;

  @Column("decimal", { name: "precioProd", precision: 10, scale: 2 })
  precioProd!: number;

  @Column({ name: "urlImg", length: 256, nullable: true })
  urlImg!: string;

  @Column({ type: "tinyint", default: 0 })
  deleted!: number;

  @Column({ length: 45, nullable: true })
  medida!: string;

  @OneToMany(() => ProductoDescuento, productoDescuento => productoDescuento.producto)
  productoDescuento!: ProductoDescuento[];
}
