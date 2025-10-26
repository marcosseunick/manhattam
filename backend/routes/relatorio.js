const express = require('express');
const router = express.Router();
const RelatorioController = require('../controllers/relatorioController');

// Relatório geral
router.get('/geral', RelatorioController.relatorioGeral);

// Relatório demográfico
router.get('/demografico', RelatorioController.relatorioDemografico);

// Relatório de interesses
router.get('/interesses', RelatorioController.relatorioInteresses);

module.exports = router;

