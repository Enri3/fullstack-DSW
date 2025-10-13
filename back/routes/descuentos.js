const express = require("express");
const router = express.Router();
const { addDescuento , getAllProductos } = require("../controllers/descuentos");

router.post("/add", addDescuento);
router.get("/getAllProd", getAllProductos)

module.exports = router;