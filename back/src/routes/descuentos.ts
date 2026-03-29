import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/adminMiddleware";
import { addDescuento , getAllProductos , buscarDescuentoFiltro , eliminarDescuentos} from "../controllers/descuentosController";

const router = Router();

router.post("/add", verificarToken, verificarAdmin, addDescuento);
router.get("/getAllProd", getAllProductos);
router.post("/buscDescFilt", buscarDescuentoFiltro);
router.delete("/delete", verificarToken, verificarAdmin, eliminarDescuentos);
export default router;