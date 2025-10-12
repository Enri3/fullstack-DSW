const express = require('express');
const router = express.Router();
const { registrarCliente, loginCliente, editarCliente } = require('../controllers/clientesController');

// Rutas para clientes
router.post('/register', registrarCliente);
router.post('/login', loginCliente);
router.put("/edit", editarCliente);

module.exports = router;