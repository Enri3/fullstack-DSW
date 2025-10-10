const express = require("express");
const router = express.Router();
const { registrarCliente, loginCliente } = require("../controllers/authController");

router.post("/register", registrarCliente);
router.post("/login", loginCliente);

module.exports = router;