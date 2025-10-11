
const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");

// Obtener todos
router.get("/", productosController.getAll);

// Obtener por ID
router.get("/:id", productosController.getById);

// Crear
router.post("/", productosController.create);

// Actualizar
router.put("/:id", productosController.update);

module.exports = router;