import { Router } from "express";
import {
	getAll,
	getById,
	getByIdCliente,
	getEnCarritoByIdCliente,
	create,
	updateEstado,
	updateProductoCantidad,
	deletePedido,
	crearPreferencia
} from "../controllers/pedidosController";

const router = Router();

router.get("/", getAll);

router.get("/cliente/:idCli/enCarrito", getEnCarritoByIdCliente);

router.get("/cliente/:idCli", getByIdCliente);

router.get("/:idPedido", getById);

router.post("/", create);

router.put("/:idPedido", updateEstado);

router.put("/:idPedido/productos/:idProd", updateProductoCantidad);

router.delete("/:idPedido", deletePedido);

router.post("/crear-preferencia/:idPedido", crearPreferencia);

export default router;
