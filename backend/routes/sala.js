const express = require('express');
const router = express.Router();
const SalaController = require('../controllers/salaController');

// Criar nova sala
router.post('/criar', SalaController.criarSala);

// Listar salas do usuário (por tipo e ID)
router.get('/minhas/:userType/:userId', SalaController.minhasSalas);

// Listar salas disponíveis
router.get('/disponiveis', SalaController.salasDisponiveis);

// Adicionar jogador à sala
router.post('/adicionar/:salaId', SalaController.adicionarJogador);

// Remover jogador da sala
router.post('/remover/:salaId', SalaController.removerJogador);

// Iniciar sala
router.post('/iniciar/:salaId', SalaController.iniciarSala);

// Detalhes da sala
router.get('/:salaId', SalaController.detalhesSala);

// Finalizar sala
router.put('/finalizar/:salaId', SalaController.finalizarSala);

module.exports = router;
