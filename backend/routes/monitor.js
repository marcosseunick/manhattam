const express = require('express');
const router = express.Router();
const MonitorController = require('../controllers/monitorController');

// Criar monitor
router.post('/', MonitorController.criar);

// Listar todos
router.get('/', MonitorController.listar);

// Buscar por ID
router.get('/:id', MonitorController.buscar);

// Atualizar nível
router.put('/:id/nivel', MonitorController.atualizarNivel);

// Desativar
router.delete('/:id', MonitorController.desativar);

module.exports = router;

