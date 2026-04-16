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

/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener todos los pedidos (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado completo de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", verificarToken, verificarAdmin, getAll);

/**
 * @swagger
 * /pedidos/cliente/{idCli}/enCarrito:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener pedido en carrito de un cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCli
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido en carrito encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: No hay pedido en carrito para ese cliente
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/cliente/:idCli/enCarrito", verificarToken, getEnCarritoByIdCliente);

/**
 * @swagger
 * /pedidos/cliente/{idCli}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener historial de pedidos de un cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idCli
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedidos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: No hay pedidos para el cliente
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/cliente/:idCli", verificarToken, getByIdCliente);

/**
 * @swagger
 * /pedidos/webhook:
 *   post:
 *     tags: [Pedidos]
 *     summary: Webhook de Mercado Pago
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WebhookMercadoPagoRequest'
 *     responses:
 *       200:
 *         description: Webhook recibido correctamente
 *       500:
 *         description: Error al procesar webhook
 */
router.post("/webhook", recibirWebhookMP);

/**
 * @swagger
 * /pedidos/{idPedido}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obtener pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:idPedido", verificarToken, getById);

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags: [Pedidos]
 *     summary: Crear pedido o agregar al pedido en carrito
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoCreateRequest'
 *     responses:
 *       201:
 *         description: Pedido creado/actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoCreateResponse'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", verificarToken, create);

/**
 * @swagger
 * /pedidos/{idPedido}:
 *   put:
 *     tags: [Pedidos]
 *     summary: Actualizar estado y datos de un pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoUpdateEstadoRequest'
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Datos invalidos
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:idPedido", verificarToken, updateEstado);

/**
 * @swagger
 * /pedidos/{idPedido}/productos/{idProd}:
 *   put:
 *     tags: [Pedidos]
 *     summary: Actualizar cantidad de un producto dentro del pedido en carrito
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idProd
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoUpdateCantidadRequest'
 *     responses:
 *       200:
 *         description: Cantidad actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoUpdateCantidadResponse'
 *       400:
 *         description: Datos invalidos o estado de pedido no editable
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:idPedido/productos/:idProd", verificarToken, updateProductoCantidad);

/**
 * @swagger
 * /pedidos/{idPedido}:
 *   delete:
 *     tags: [Pedidos]
 *     summary: Eliminar pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:idPedido", verificarToken, deletePedido);

/**
 * @swagger
 * /pedidos/crear-preferencia/{idPedido}:
 *   post:
 *     tags: [Pedidos]
 *     summary: Crear preferencia de pago en Mercado Pago
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Preferencia creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MercadoPagoPreferenceResponse'
 *       404:
 *         description: Pedido no encontrado
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/crear-preferencia/:idPedido", verificarToken, crearPreferencia);

export default router;
