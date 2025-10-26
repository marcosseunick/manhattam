const Sala = require('../models/Sala');

class SalaController {
  // Criar nova sala
  static async criarSala(req, res) {
    try {
      const { criador_id, criador_tipo, criador_nome, nome, jogo, jogadores } = req.body;

      // Validação básica
      if (!criador_id || !criador_tipo) {
        return res.status(400).json({
          error: 'Identificação do criador é obrigatória'
        });
      }

      if (!criador_nome || criador_nome.trim() === '') {
        return res.status(400).json({
          error: 'Nome do criador é obrigatório'
        });
      }

      if (!jogadores || !Array.isArray(jogadores) || jogadores.length === 0) {
        return res.status(400).json({
          error: 'Lista de jogadores é obrigatória (array de nomes)'
        });
      }

      // Validar que todos os jogadores têm nome
      const jogadoresValidos = jogadores.filter(j => j && j.trim() !== '');
      if (jogadoresValidos.length === 0) {
        return res.status(400).json({
          error: 'Pelo menos um jogador válido é necessário'
        });
      }

      const salaId = await Sala.create({
        criador_id,
        criador_tipo,
        criador_nome: criador_nome.trim(),
        nome: nome || 'Sala sem nome',
        jogo: jogo || 'Jogo a definir',
        jogadores: jogadoresValidos.map(j => j.trim())
      });

      const sala = await Sala.findById(salaId);

      res.status(201).json({
        message: 'Sala criada com sucesso!',
        sala
      });

    } catch (error) {
      console.error('Erro ao criar sala:', error);
      res.status(500).json({
        error: 'Erro ao criar sala. Tente novamente.'
      });
    }
  }

  // Listar salas do usuário
  static async minhasSalas(req, res) {
    try {
      const { userId, userType } = req.params;

      if (!userId || !userType) {
        return res.status(400).json({
          error: 'Identificação do usuário é obrigatória'
        });
      }

      const salas = await Sala.findByUser(userId, userType);

      res.json({
        salas,
        total: salas.length
      });

    } catch (error) {
      console.error('Erro ao listar salas:', error);
      res.status(500).json({
        error: 'Erro ao listar salas. Tente novamente.'
      });
    }
  }

  // Listar salas disponíveis
  static async salasDisponiveis(req, res) {
    try {
      const salas = await Sala.findAvailable();

      res.json({
        salas,
        total: salas.length
      });

    } catch (error) {
      console.error('Erro ao listar salas disponíveis:', error);
      res.status(500).json({
        error: 'Erro ao listar salas. Tente novamente.'
      });
    }
  }

  // Adicionar jogador à sala
  static async adicionarJogador(req, res) {
    try {
      const { salaId } = req.params;
      const { nome_jogador } = req.body;

      if (!salaId) {
        return res.status(400).json({
          error: 'ID da sala é obrigatório'
        });
      }

      if (!nome_jogador || nome_jogador.trim() === '') {
        return res.status(400).json({
          error: 'Nome do jogador é obrigatório'
        });
      }

      const resultado = await Sala.adicionarJogador(salaId, nome_jogador.trim());

      if (!resultado.success) {
        return res.status(400).json({
          error: resultado.message
        });
      }

      res.json({
        message: 'Jogador adicionado com sucesso!',
        sala: resultado.sala
      });

    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      res.status(500).json({
        error: 'Erro ao adicionar jogador. Tente novamente.'
      });
    }
  }

  // Remover jogador da sala
  static async removerJogador(req, res) {
    try {
      const { salaId } = req.params;
      const { nome_jogador } = req.body;

      if (!salaId) {
        return res.status(400).json({
          error: 'ID da sala é obrigatório'
        });
      }

      if (!nome_jogador || nome_jogador.trim() === '') {
        return res.status(400).json({
          error: 'Nome do jogador é obrigatório'
        });
      }

      const resultado = await Sala.removerJogador(salaId, nome_jogador.trim());

      if (!resultado.success) {
        return res.status(400).json({
          error: resultado.message
        });
      }

      res.json({
        message: 'Jogador removido com sucesso!',
        sala: resultado.sala
      });

    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      res.status(500).json({
        error: 'Erro ao remover jogador. Tente novamente.'
      });
    }
  }

  // Iniciar sala
  static async iniciarSala(req, res) {
    try {
      const { salaId } = req.params;

      const resultado = await Sala.iniciarSala(salaId);

      if (!resultado.success) {
        return res.status(400).json({
          error: resultado.message
        });
      }

      res.json({
        message: 'Sala iniciada com sucesso!',
        sala: resultado.sala
      });

    } catch (error) {
      console.error('Erro ao iniciar sala:', error);
      res.status(500).json({
        error: 'Erro ao iniciar sala. Tente novamente.'
      });
    }
  }

  // Obter detalhes da sala
  static async detalhesSala(req, res) {
    try {
      const { salaId } = req.params;

      const sala = await Sala.findById(salaId);

      if (!sala) {
        return res.status(404).json({
          error: 'Sala não encontrada'
        });
      }

      res.json({ sala });

    } catch (error) {
      console.error('Erro ao buscar sala:', error);
      res.status(500).json({
        error: 'Erro ao buscar sala. Tente novamente.'
      });
    }
  }

  // Finalizar sala
  static async finalizarSala(req, res) {
    try {
      const { salaId } = req.params;

      const sucesso = await Sala.updateStatus(salaId, 'finalizada');

      if (!sucesso) {
        return res.status(404).json({
          error: 'Sala não encontrada'
        });
      }

      res.json({
        message: 'Sala finalizada com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao finalizar sala:', error);
      res.status(500).json({
        error: 'Erro ao finalizar sala. Tente novamente.'
      });
    }
  }
}

module.exports = SalaController;
