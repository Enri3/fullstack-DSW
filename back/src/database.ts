import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Producto} from "../../entidades/producto";
import { Descuento} from "../../entidades/descuento";
import { ProductoDescuento} from "../../entidades/productos_descuentos"
import { TipoCliente } from "../../entidades/tipo-cliente";
import "reflect-metadata";


dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "test",
  synchronize: true, 
  logging: false,
  entities: [Producto, Descuento, ProductoDescuento, TipoCliente ], 
});
//, Cliente, TipoCliente