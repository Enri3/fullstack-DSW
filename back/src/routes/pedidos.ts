import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/adminMiddleware";
import {
	getAll,
	getById,
	getByIdCliente,
	getEnCarritoByIdCliente,
	create,
	updateEstado,
	updateProductoCantidad,
	deletePedido,
	crearPreferencia,
	recibirWebhookMP
} from "../controllers/pedidosController";

const router = Router();

router.get("/", verificarToken, verificarAdmin, getAll);

router.get("/cliente/:idCli/enCarrito", verificarToken, getEnCarritoByIdCliente);

router.get("/cliente/:idCli", verificarToken, getByIdCliente);

router.post("/webhook", recibirWebhookMP);

router.get("/:idPedido", verificarToken, getById);

router.post("/", verificarToken, create);

router.put("/:idPedido", verificarToken, updateEstado);

router.put("/:idPedido/productos/:idProd", verificarToken, updateProductoCantidad);

router.delete("/:idPedido", verificarToken, deletePedido);

router.post("/crear-preferencia/:idPedido", verificarToken, crearPreferencia);

export default router;
