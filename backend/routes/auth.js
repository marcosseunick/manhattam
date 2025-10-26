const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login de usuário padrão (por ID)
router.post('/usuario', AuthController.loginUsuario);

// Login de monitor/admin (por email e senha)
router.post('/monitor', AuthController.loginMonitor);

// Verificar autenticação
router.get('/verificar', AuthController.verificarAutenticacao);

module.exports = router;

