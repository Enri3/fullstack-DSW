import { Router } from "express";
import { getAll, getById, getByIdCliente, create, updateEstado, deletePedido } from "../controllers/pedidosController";

const router = Router();

router.get("/", getAll);

router.get("/cliente/:idCli", getByIdCliente);

router.get("/:idPedido", getById);

router.post("/", create);

router.put("/:idPedido", updateEstado);

router.delete("/:idPedido", deletePedido);

export default router;
