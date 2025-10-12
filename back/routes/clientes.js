const express = require('express');
const router = express.Router();
const { getAllClientes, registrarCliente, loginCliente, editarCliente, eliminarClientes } = require('../controllers/clientesController');

// Rutas para clientes
router.get("/getAllClientes", getAllClientes);
router.post('/register', registrarCliente);
router.post('/login', loginCliente);
router.put("/edit", editarCliente);
router.delete("/eliminar-multiple", eliminarClientes);

module.exports = router;