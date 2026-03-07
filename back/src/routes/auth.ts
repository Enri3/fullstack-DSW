import { Router } from "express";
import { buscarClienteFiltro, getAllClientes, registrarCliente, loginCliente, editarCliente, eliminarClientes, cambiarPassword } from "../controllers/authController";
import { verificarToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registrarCliente);
router.post("/login", loginCliente);

router.get("/getAllClientes", verificarToken, getAllClientes);
router.put("/edit", verificarToken, editarCliente);
router.delete("/eliminar-multiple", verificarToken, eliminarClientes);
router.put("/cambiar-password", verificarToken, cambiarPassword);
router.post("/buscarClienteFiltro", verificarToken, buscarClienteFiltro);

export default router;