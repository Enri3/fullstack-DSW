import { Router } from "express";
import { getNombreTipo } from "../controllers/tipo_clientesController";

const router = Router();

/**
 * @swagger
 * /tipo_usuarios/obtener/{idTipoCli}:
 *   get:
 *     tags: [TipoClientes]
 *     summary: Obtener nombre del tipo de cliente por ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: idTipoCli
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nombre del tipo de cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoClienteNombreResponse'
 *       400:
 *         description: Falta el idTipoCli
 *       404:
 *         description: Tipo de cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/obtener/:idTipoCli", getNombreTipo);

export default router;