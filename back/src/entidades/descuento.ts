import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { OneToMany } from "typeorm";
import { ProductoDescuento } from "./productos_descuentos";


@Entity("descuentos")
export class Descuento {

    @PrimaryGeneratedColumn({ name: "idDesc" }) 
    idDesc?: number;

    @Column({ name: "porcentaje", type: "decimal", precision: 5, scale: 2, nullable: false })
    porcentaje!: number;

    @Column({ name: "fechaDesde", type: "date", nullable: false }) 
    fechaDesde!: Date;

    @Column({ name: "fechaHasta", type: "date", nullable: false }) 
    fechaHasta!: Date;
    
    @OneToMany(() => ProductoDescuento, productoDescuento => productoDescuento.descuento)
    productoDescuentos!: ProductoDescuento[];
}
