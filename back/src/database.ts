import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Producto} from "./entidades/producto";
import { Cliente} from "./entidades/cliente";
import { Descuento} from "./entidades/descuento";
import { ProductoDescuento} from "./entidades/productos_descuentos"
import { TipoCliente } from "./entidades/tipo-cliente";
import { Pedido } from "./entidades/pedido";
import { PedidoProducto } from "./entidades/pedido_productos";
import "reflect-metadata";


dotenv.config();

const isLocal = process.env.ENVIRONMENT === "local";

export const AppDataSource = new DataSource(
  isLocal
    ?
  {
  type: "mysql",
  host: process.env.DATABASE_URL || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.USER || "root",
  password: process.env.PASSWORD || "",
  database: process.env.DATABASE || "test",
  synchronize: true, 
  logging: false,
  entities: [Producto, Cliente, Descuento, ProductoDescuento, TipoCliente, Pedido, PedidoProducto], 
  }
:{
  type: "postgres",
  url: process.env.DATABASE_URL || "localhost",
  synchronize: true,
  logging: false,
  entities: [Producto, Cliente, Descuento, ProductoDescuento, TipoCliente, Pedido, PedidoProducto],
  });