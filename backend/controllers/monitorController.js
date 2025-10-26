const Monitor = require('../models/Monitor');

class MonitorController {
  // Criar monitor
  static async criar(req, res) {
    try {
      const { nome, email, senha, nivel } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          error: 'Nome, email e senha são obrigatórios'
        });
      }

      if (!['admin', 'admin_senior'].includes(nivel)) {
        return res.status(400).json({
          error: 'Nível deve ser "admin" ou "admin_senior"'
        });
      }

      // Verificar se email já existe
      const monitorExistente = await Monitor.findByEmail(email);
      if (monitorExistente) {
        return res.status(409).json({
          error: 'Email já cadastrado'
        });
      }

      const monitorId = await Monitor.create({
        nome,
        email,
        senha,
        nivel
      });

      res.status(201).json({
        message: 'Monitor cadastrado com sucesso!',
        monitor: {
          id: monitorId,
          nome,
          email,
          nivel
        }
      });

    } catch (error) {
      console.error('Erro ao criar monitor:', error);
      res.status(500).json({
        error: 'Erro ao criar monitor. Tente novamente.'
      });
    }
  }

  // Listar todos
  static async listar(req, res) {
    try {
      const monitores = await Monitor.findAll();

      res.json({
        monitores,
        total: monitores.length
      });

    } catch (error) {
      console.error('Erro ao listar monitores:', error);
      res.status(500).json({
        error: 'Erro ao listar monitores'
      });
    }
  }

  // Buscar por ID
  static async buscar(req, res) {
    try {
      const { id } = req.params;

      const monitor = await Monitor.findById(parseInt(id));

      if (!monitor) {
        return res.status(404).json({
          error: 'Monitor não encontrado'
        });
      }

      res.json({
        monitor: {
          id: monitor.id,
          nome: monitor.nome,
          email: monitor.email,
          nivel: monitor.nivel,
          data_cadastro: monitor.data_cadastro
        }
      });

    } catch (error) {
      console.error('Erro ao buscar monitor:', error);
      res.status(500).json({
        error: 'Erro ao buscar monitor'
      });
    }
  }

  // Atualizar nível
  static async atualizarNivel(req, res) {
    try {
      const { id } = req.params;
      const { nivel } = req.body;

      if (!['admin', 'admin_senior'].includes(nivel)) {
        return res.status(400).json({
          error: 'Nível deve ser "admin" ou "admin_senior"'
        });
      }

      const sucesso = await Monitor.updateNivel(parseInt(id), nivel);

      if (!sucesso) {
        return res.status(404).json({
          error: 'Monitor não encontrado'
        });
      }

      res.json({
        message: 'Nível atualizado com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao atualizar nível:', error);
      res.status(500).json({
        error: 'Erro ao atualizar nível'
      });
    }
  }

  // Desativar monitor
  static async desativar(req, res) {
    try {
      const { id } = req.params;

      const sucesso = await Monitor.deactivate(parseInt(id));

      if (!sucesso) {
        return res.status(404).json({
          error: 'Monitor não encontrado'
        });
      }

      res.json({
        message: 'Monitor desativado com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao desativar monitor:', error);
      res.status(500).json({
        error: 'Erro ao desativar monitor'
      });
    }
  }
}

module.exports = MonitorController;

