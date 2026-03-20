import { Router } from "express";
import { buscarProducto, getAll,getAllenAlta, getById, create, update, deleteProd, darDeAlta } from "../controllers/productosController";

const router = Router();
router.get("/enAlta", getAllenAlta);
router.post("/buscarProductoPorNombre", buscarProducto);
router.get("/", getAll);
router.post("/", create);
router.put("/darDeAlta/:idProd", darDeAlta);
router.put("/update/:idProd", update);
router.get("/:idProd", getById);
router.delete("/:idProd", deleteProd);

export default router;