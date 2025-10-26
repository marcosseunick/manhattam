const express = require('express');
const router = express.Router();
const CadastroController = require('../controllers/cadastroController');

// Rota para cadastro de aluno
router.post('/aluno', CadastroController.cadastrarAluno);

// Rota para cadastro de visitante
router.post('/visitante', CadastroController.cadastrarVisitante);

module.exports = router;

