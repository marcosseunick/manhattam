const Monitor = require('../models/Monitor');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

class AuthController {
  // Login para usuário padrão (aluno/visitante) por ID
  static async loginUsuario(req, res) {
    try {
      const { id } = req.body;

      if (!id || id.trim() === '') {
        return res.status(400).json({
          error: 'ID é obrigatório'
        });
      }

      // Buscar usuário
      const usuario = await Usuario.findById(id.trim());

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      if (!usuario.ativo) {
        return res.status(403).json({
          error: 'Usuário inativo'
        });
      }

      // Retornar dados do usuário (sem senha)
      res.json({
        message: 'Login realizado com sucesso!',
        usuario: {
          id: usuario.id,
          tipo: usuario.tipo,
          nome: usuario.nome,
          ra: usuario.ra,
          qr_code: usuario.qr_code
        }
      });

    } catch (error) {
      console.error('Erro no login do usuário:', error);
      res.status(500).json({
        error: 'Erro ao fazer login. Tente novamente.'
      });
    }
  }

  // Login para monitor/admin
  static async loginMonitor(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      // Buscar monitor por email
      const monitor = await Monitor.findByEmail(email);

      if (!monitor) {
        return res.status(404).json({
          error: 'Credenciais inválidas'
        });
      }

      if (!monitor.ativo) {
        return res.status(403).json({
          error: 'Conta inativa'
        });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, monitor.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Retornar dados do monitor (sem senha)
      res.json({
        message: 'Login realizado com sucesso!',
        monitor: {
          id: monitor.id,
          nome: monitor.nome,
          email: monitor.email,
          nivel: monitor.nivel // 'admin' ou 'admin_senior'
        }
      });

    } catch (error) {
      console.error('Erro no login do monitor:', error);
      res.status(500).json({
        error: 'Erro ao fazer login. Tente novamente.'
      });
    }
  }

  // Verificar se usuário está autenticado (para futuras implementações de sessão)
  static async verificarAutenticacao(req, res) {
    try {
      // Por enquanto, apenas confirma que o endpoint existe
      res.json({
        message: 'Endpoint de verificação de autenticação'
      });
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      res.status(500).json({
        error: 'Erro ao verificar autenticação'
      });
    }
  }
}

module.exports = AuthController;

