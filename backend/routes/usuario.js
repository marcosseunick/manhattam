const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Cadastrar aluno
router.post('/cadastro/aluno', UsuarioController.cadastrarAluno);

// Cadastrar visitante/comunidade
router.post('/cadastro/visitante', UsuarioController.cadastrarVisitante);

// Buscar por QR Code
router.get('/qrcode/:qrCode', UsuarioController.buscarPorQRCode);

// Buscar por ID
router.get('/:id', UsuarioController.buscarPorId);

// Listar todos
router.get('/', UsuarioController.listarTodos);

// Atualizar interesses
router.put('/:id/interesses', UsuarioController.atualizarInteresses);

module.exports = router;

