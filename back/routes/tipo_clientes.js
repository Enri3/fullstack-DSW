const express = require("express");
const router = express.Router();
const { getNombreTipo } = require("../controllers/tipo_clientesController");

router.get("/obtener/:idTipoCli", getNombreTipo);

module.exports = router;
