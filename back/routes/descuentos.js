const express = require("express");
const router = express.Router();
const { addDescuento , getAllProductos } = require("../controllers/descuentosController");

router.post("/add", addDescuento);
router.get("/getAllProd", getAllProductos);

module.exports = router;