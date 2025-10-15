import { Router } from "express";
import { buscarProducto, getAll, getById, create, update, deleteProd } from "../controllers/productosController";

const router = Router();

// Obtener todos
router.get("/", getAll);

// Obtener por ID
router.get("/:idProd", getById);

// Crear
router.post("/", create);

// Actualizar
router.put("/:idProd", update);

// Eliminar
router.delete("/:idProd", deleteProd);

// Buscar por nombre
router.post("/buscarProductoPorNombre", buscarProducto);

export default router;