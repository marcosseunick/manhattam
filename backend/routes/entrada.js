const express = require('express');
const router = express.Router();
const EntradaController = require('../controllers/entradaController');

// Registrar entrada (check-in)
router.post('/checkin', EntradaController.registrarEntrada);

// Entradas de um usuário
router.get('/usuario/:usuarioId', EntradaController.entradasUsuario);

// Entradas de hoje
router.get('/hoje', EntradaController.entradasHoje);

// Estatísticas gerais
router.get('/estatisticas', EntradaController.estatisticas);

module.exports = router;

