const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const database = require("./database");
const productosRoutes = require("../routes/productos");
const authRoutes = require("../routes/auth");

const app = express();
app.set("port", 4000);

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

app.use("/productos", productosRoutes);
app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(app.get("port"), () => {
  console.log("Servidor escuchando en el puerto " + app.get("port"));
});