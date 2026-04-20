import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./producto"; 
import { Descuento } from "./descuento"; 

@Entity("productos_descuentos")
export class ProductoDescuento {

    @PrimaryColumn({ name: "idDesc" })
    idDesc!: number;

    @PrimaryColumn({ name: "idProd" })
    idProd!: number;

    @ManyToOne(() => Descuento, descuento => descuento.productoDescuentos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idDesc" })
    descuento!: Descuento;

    @ManyToOne(() => Producto, producto => producto.productoDescuento, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idProd" })
    producto!: Producto;
}