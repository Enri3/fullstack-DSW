const express = require("express");
const router = express.Router();
const { getNombreTipo } = require("../controllers/tipo_clientesController");

router.get("/obtener", getNombreTipo);

module.exports = router;
