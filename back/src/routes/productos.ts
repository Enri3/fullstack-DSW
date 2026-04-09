import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verificarToken } from "../middleware/authMiddleware";
import { verificarAdmin } from "../middleware/adminMiddleware";
import { buscarProducto, getAll,getAllenAlta, getById, create, update, deleteProd, darDeAlta } from "../controllers/productosController";

const router = Router();

const fotosDir = path.resolve(process.cwd(), "..", "entidades", "fotosProductos");
if (!fs.existsSync(fotosDir)) {
	fs.mkdirSync(fotosDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, fotosDir);
	},
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname);
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
		cb(null, uniqueName);
	}
});

const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) {
			cb(new Error("Solo se permiten imagenes"));
			return;
		}
		cb(null, true);
	},
	limits: { fileSize: 5 * 1024 * 1024 }
});

/**
 * @swagger
 * /productos/enAlta:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener productos en alta
 *     security: []
 *     parameters:
 *       - in: query
 *         name: idCli
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de cliente para calcular precios finales con descuentos
 *     responses:
 *       200:
 *         description: Listado de productos en alta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/enAlta", getAllenAlta);

/**
 * @swagger
 * /productos/enalta:
 *   get:
 *     tags: [Productos]
 *     summary: Alias de /productos/enAlta
 *     security: []
 *     responses:
 *       200:
 *         description: Listado de productos en alta
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 */
router.get("/enalta", getAllenAlta);

/**
 * @swagger
 * /productos/buscarProductoPorNombre:
 *   post:
 *     tags: [Productos]
 *     summary: Buscar productos por nombre
 *     security: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoBuscarRequest'
 *     responses:
 *       200:
 *         description: Resultados de busqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 */
router.post("/buscarProductoPorNombre", buscarProducto);

/**
 * @swagger
 * /productos:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener todos los productos
 *     security: []
 *     parameters:
 *       - in: query
 *         name: idCli
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de cliente para calcular precios finales con descuentos
 *     responses:
 *       200:
 *         description: Listado completo de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getAll);

/**
 * @swagger
 * /productos:
 *   post:
 *     tags: [Productos]
 *     summary: Crear un producto (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoCreateUpdateMultipart'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", verificarToken, verificarAdmin, upload.single("imagen"), create);

/**
 * @swagger
 * /productos/darDeAlta/{idProd}:
 *   put:
 *     tags: [Productos]
 *     summary: Dar de alta un producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProd
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto dado de alta correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/darDeAlta/:idProd", verificarToken, verificarAdmin, darDeAlta);

/**
 * @swagger
 * /productos/update/{idProd}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar un producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProd
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoCreateUpdateMultipart'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Datos invalidos
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update/:idProd", verificarToken, verificarAdmin, upload.single("imagen"), update);

/**
 * @swagger
 * /productos/{idProd}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: idProd
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: idCli
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID de cliente para calcular precio final
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:idProd", getById);

/**
 * @swagger
 * /productos/{idProd}:
 *   delete:
 *     tags: [Productos]
 *     summary: Dar de baja un producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProd
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Token invalido o ausente
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:idProd", verificarToken, verificarAdmin, deleteProd);

export default router;