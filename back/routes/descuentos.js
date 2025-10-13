add
const express = require("express");
const router = express.Router();
const { addDescuento , getAllDescuentosConProductos , deleteMultipleDescuentos } = require("../controllers/authController");

router.post("/add", addDescuento);
router.get("/getAllConProductos", getAllDescuentosConProductos);
router.delete("/eliminar-multiple", deleteMultipleDescuentos);

module.exports = router;