import { Router } from "express";
import { addDescuento , getAllProductos , buscarDescuentoFiltro , eliminarDescuentos} from "../controllers/descuentosController";

const router = Router();

router.post("/add", addDescuento);
router.get("/getAllProd", getAllProductos);
router.post("/buscDescFilt", buscarDescuentoFiltro);
router.delete("/delete", eliminarDescuentos);
export default router;