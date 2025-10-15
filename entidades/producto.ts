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

/*export interface Producto {
  idProd: number;
  nombreProd: string;
  precioProd: number;
  urlImg: string;
  deleted:number;
  medida:string;
}

export const productoVacio: Producto = {
    idProd: 0,
    nombreProd: "",
    precioProd: 0,
    urlImg: "",
    deleted: 0,
    medida: ""
};

export const PRODUCTOS_MOCK_DATA: Producto[] = [
    {
        idProd: 101,
        nombreProd: 'Vela Aromática de Coco y Vainilla',
        precioProd: 18.50,
        urlImg: 'https://placehold.co/600x400/F0EAD6/6C5B4E?text=Vela+Coco',
        deleted: 0,
        medida: '200gr',
    },
    {
        idProd: 102,
        nombreProd: 'Jabón Sólido de Lavanda Relajante',
        precioProd: 5.99,
        urlImg: 'https://placehold.co/600x400/E3D9BD/6C5B4E?text=Jabon+Lavanda',
        deleted: 0,
        medida: '100gr',
    },
    {
        idProd: 103,
        nombreProd: 'Difusor de Aromas Eléctrico',
        precioProd: 45.00,
        urlImg: 'https://placehold.co/600x400/C7BCA3/3D332C?text=Difusor+Electric',
        deleted: 0,
        medida: 'Unidad',
    },
    {
        idProd: 104,
        nombreProd: 'Aceite Esencial de Eucalipto',
        precioProd: 12.75,
        urlImg: 'https://placehold.co/600x400/6C5B4E/FFFFFF?text=Aceite+Eucalipto',
        deleted: 0,
        medida: '10ml',
    },
    {
        idProd: 105,
        nombreProd: 'Set de Regalo "Bienestar en Casa"',
        precioProd: 75.90,
        urlImg: 'https://placehold.co/600x400/7A6F62/FFFFFF?text=Set+Regalo',
        deleted: 0,
        medida: 'Caja',
    },
    {
        idProd: 106,
        nombreProd: 'Sales de Baño Minerales',
        precioProd: 9.99,
        urlImg: 'https://placehold.co/600x400/F0EAD6/3D332C?text=Sales+Baño',
        deleted: 1, // Ejemplo de un producto eliminado
        medida: '300gr',
    },
];*/