import { Router } from "express";
import { buscarProducto, getAll, getById, create, update, deleteProd } from "../controllers/productosController";

const router = Router();

router.get("/", getAll);

router.get("/:idProd", getById);

router.post("/", create);

router.put("/:idProd", update);

router.delete("/:idProd", deleteProd);

router.post("/buscarProductoPorNombre", buscarProducto);

export default router;