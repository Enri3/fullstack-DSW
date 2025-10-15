import { Router } from "express";
import { getNombreTipo } from "../controllers/tipo_clientesController";

const router = Router();

router.get("/obtener/:idTipoCli", getNombreTipo);

export default router;