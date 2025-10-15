import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./producto"; // Asumo esta ruta de tu entidad Producto
import { Descuento } from "./descuento"; // Asumo esta ruta de tu entidad Descuento

@Entity("productos_descuentos")
export class ProductoDescuento {

    @PrimaryColumn({ name: "idDesc" })
    idDesc!: number;

    @PrimaryColumn({ name: "idProd" })
    idProd!: number;

    // Relación ManyToOne con Descuento
    @ManyToOne(() => Descuento, descuento => descuento.productoDescuentos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idDesc" })
    descuento!: Descuento;

    // Relación ManyToOne con Producto
    @ManyToOne(() => Producto, producto => producto.productoDescuento, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idProd" })
    producto!: Producto;
}