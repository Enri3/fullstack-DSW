const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Todas las rutas de productos
router.get('/', productosController.getAll);
router.post('/', productosController.create);

module.exports = router;