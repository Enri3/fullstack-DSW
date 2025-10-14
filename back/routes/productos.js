
const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");

// Obtener todos
router.get("/", productosController.getAll);

// Obtener por ID
router.get("/:idProd", productosController.getById);

// Crear
router.post("/", productosController.create);

// Actualizar
router.put("/:idProd", productosController.update);

//Eliminar
router.delete("/:idProd", productosController.delete);

router.post("/buscarPorNombre", productosController.buscarProducto);

module.exports = router;