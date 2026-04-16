import { Router } from "express";
import { verificarToken } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/adminMiddleware";
import { addDescuento , getAllProductos , buscarDescuentoFiltro , eliminarDescuentos} from "../controllers/descuentosController";

const router = Router();

/**
 * @swagger
 * /descuentos/add:
 *   post:
 *     tags: [Descuentos]
 *     summary: Crear descuento y asociarlo a productos (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescuentoAddRequest'
 *     responses:
 *       200:
 *         description: Descuento creado y asociado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DescuentoAddResponse'
 *       400:
 *         description: Datos invalidos o descuento solapado
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/add", verificarToken, verificarAdmin, addDescuento);

/**
 * @swagger
 * /descuentos/getAllProd:
 *   get:
 *     tags: [Descuentos]
 *     summary: Obtener todos los productos
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/getAllProd", getAllProductos);

/**
 * @swagger
 * /descuentos/buscDescFilt:
 *   post:
 *     tags: [Descuentos]
 *     summary: Buscar descuentos vigentes por id o nombre de producto
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescuentoBuscarRequest'
 *     responses:
 *       200:
 *         description: Resultados de descuentos filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DescuentoResultado'
 *       500:
 *         description: Error interno del servidor
 */
router.post("/buscDescFilt", buscarDescuentoFiltro);

/**
 * @swagger
 * /descuentos/delete:
 *   delete:
 *     tags: [Descuentos]
 *     summary: Eliminar descuentos por IDs (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DescuentoDeleteRequest'
 *     responses:
 *       200:
 *         description: Descuentos eliminados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Body invalido
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: No se encontraron descuentos
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/delete", verificarToken, verificarAdmin, eliminarDescuentos);
export default router;