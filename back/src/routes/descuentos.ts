import { Router } from "express";
import { addDescuento , getAllProductos , buscarDescuentoFiltro , eliminarDescuentos, buscarPorProd} from "../controllers/descuentosController";

const router = Router();

router.post("/add", addDescuento);
router.get("/getAllProd", getAllProductos);
router.post("/buscDescFilt", buscarDescuentoFiltro);
router.post("/buscPorProd", buscarPorProd);
router.delete("/delete", eliminarDescuentos);
router.post("/buscPorProd", buscarPorProd);
export default router;