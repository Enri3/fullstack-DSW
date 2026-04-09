import { Router } from "express";
import { buscarClienteFiltro, getAllClientes, registrarCliente, loginCliente, editarCliente, eliminarClientes, cambiarPassword } from "../controllers/authController";
import { verificarToken } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar un nuevo cliente
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       200:
 *         description: Cliente registrado con exito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Error de validacion o captcha invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", registrarCliente);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesion de cliente
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Credenciales invalidas o captcha invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 */
router.post("/login", loginCliente);

/**
 * @swagger
 * /auth/getAllClientes:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener listado de clientes (excepto admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientePublic'
 *       401:
 *         description: Token invalido o ausente
 *       500:
 *         description: Error interno del servidor
 */
router.get("/getAllClientes", verificarToken, getAllClientes);

/**
 * @swagger
 * /auth/edit:
 *   put:
 *     tags: [Auth]
 *     summary: Editar datos de cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthEditarClienteRequest'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Datos incompletos
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/edit", verificarToken, editarCliente);

/**
 * @swagger
 * /auth/eliminar-multiple:
 *   delete:
 *     tags: [Auth]
 *     summary: Eliminar multiples clientes por ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthEliminarMultipleRequest'
 *     responses:
 *       200:
 *         description: Clientes eliminados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Body invalido
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/eliminar-multiple", verificarToken, eliminarClientes);

/**
 * @swagger
 * /auth/cambiar-password:
 *   put:
 *     tags: [Auth]
 *     summary: Cambiar password de cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCambiarPasswordRequest'
 *     responses:
 *       200:
 *         description: Password actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Datos invalidos o password anterior incorrecta
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/cambiar-password", verificarToken, cambiarPassword);

/**
 * @swagger
 * /auth/buscarClienteFiltro:
 *   post:
 *     tags: [Auth]
 *     summary: Buscar clientes por criterio de nombre o email
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthBuscarClienteRequest'
 *     responses:
 *       200:
 *         description: Listado de clientes filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClientePublic'
 *       500:
 *         description: Error interno del servidor
 */
router.post("/buscarClienteFiltro", verificarToken, buscarClienteFiltro);

export default router;