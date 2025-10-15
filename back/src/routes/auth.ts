import { Router } from "express";
import { buscarClienteFiltro, getAllClientes, registrarCliente, loginCliente, editarCliente, eliminarClientes, cambiarPassword } from "../controllers/authController";

const router = Router();

router.get("/getAllClientes", getAllClientes);
router.post("/register", registrarCliente);
router.post("/login", loginCliente);
router.put("/edit", editarCliente);
router.delete("/eliminar-multiple", eliminarClientes);
router.put("/cambiar-password", cambiarPassword);
router.post("/buscarClienteFiltro", buscarClienteFiltro);

export default router; //