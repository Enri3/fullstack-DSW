import { Router } from "express";
import { addDescuento, getAllProductos } from "../controllers/descuentosController";

const router = Router();

router.post("/add", addDescuento);
router.get("/getAllProd", getAllProductos);

export default router;