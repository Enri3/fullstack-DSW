import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./database"; // <-- cambiar aquí
import "reflect-metadata";

import productosRoutes from "./routes/productos";
// import authRoutes from "./routes/auth";
// import tipoUsuariosRoutes from "./routes/tipo_clientes";
 import descuentosRoutes from "./routes/descuentos";

dotenv.config();

const app: Application = express();
app.set("port", process.env.PORT ? parseInt(process.env.PORT) : 4000);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));


AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada con TypeORM");

  
    app.use("/productos", productosRoutes);
    // app.use("/auth", authRoutes);
    // app.use("/tipo_usuarios", tipoUsuariosRoutes);
     app.use("/descuentos", descuentosRoutes);

    // Ruta 404
    app.use((req: Request, res: Response): void => {
      res.status(404).json({ message: "Ruta no encontrada" });
    });

   
    app.listen(app.get("port"), () => {
      console.log(`Servidor escuchando en el puerto ${app.get("port")}`);
    });
  })
  .catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
  });