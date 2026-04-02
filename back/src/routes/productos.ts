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

router.get("/enAlta", getAllenAlta);
router.post("/buscarProductoPorNombre", buscarProducto);
router.get("/", getAll);
router.post("/", verificarToken, verificarAdmin, upload.single("imagen"), create);
router.put("/darDeAlta/:idProd", verificarToken, verificarAdmin, darDeAlta);
router.put("/update/:idProd", verificarToken, verificarAdmin, upload.single("imagen"), update);
router.get("/:idProd", getById);
router.delete("/:idProd", verificarToken, verificarAdmin, deleteProd);

export default router;