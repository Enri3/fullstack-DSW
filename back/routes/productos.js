
const express = require("express");
const router = express.Router();
const { buscarProducto , getAll , getById , create , update , deleteProd } = require("../controllers/productosController");

// Obtener todos
router.get("/", getAll);

// Obtener por ID
router.get("/:idProd", getById);

// Crear
router.post("/", create);

// Actualizar
router.put("/:idProd", update);

//Eliminar
router.delete("/:idProd", deleteProd);

router.post("/buscarProductoPorNombre", buscarProducto);

module.exports = router;