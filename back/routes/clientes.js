import express from "express";
import { registrarCliente, loginCliente } from "../controllers/clientesController.js";

const router = express.Router();

router.post("/register", registrarCliente);
router.post("/login", loginCliente);

export default router;