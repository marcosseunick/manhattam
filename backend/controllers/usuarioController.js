const Usuario = require('../models/Usuario');
const TOTVSService = require('../services/TOTVSService');

class UsuarioController {
  // Cadastrar aluno (com dados do TOTVS)
  static async cadastrarAluno(req, res) {
    try {
      const { ra, interesses, tipo_aluno } = req.body;

      if (!ra || ra.trim() === '') {
        return res.status(400).json({
          error: 'RA é obrigatório'
        });
      }

      // Validar formato do RA (6 dígitos)
      if (!/^\d{6}$/.test(ra.trim())) {
        return res.status(400).json({
          error: 'RA deve conter exatamente 6 dígitos'
        });
      }

      // Verificar se já está cadastrado
      const jaExiste = await Usuario.findByRA(ra);
      if (jaExiste) {
        return res.status(409).json({
          error: 'Aluno já cadastrado',
          usuario: {
            id: jaExiste.id,
            nome: jaExiste.nome,
            qr_code: jaExiste.qr_code
          }
        });
      }

      // Buscar dados no "TOTVS"
      const resultadoTOTVS = await TOTVSService.buscarAlunoPorRA(ra);

      if (!resultadoTOTVS.encontrado) {
        return res.status(404).json({
          error: 'RA não encontrado no sistema acadêmico'
        });
      }

      // Criar usuário
      const usuario = await Usuario.criarAluno(
        resultadoTOTVS.dados,
        interesses || [],
        tipo_aluno || 'interno'
      );

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso!',
        usuario: {
          id: usuario.id,
          tipo: usuario.tipo,
          nome: usuario.nome,
          ra: usuario.ra,
          qr_code: usuario.qr_code,
          interesses: usuario.interesses,
          tipo_aluno: usuario.tipo_aluno
        }
      });

    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar aluno. Tente novamente.'
      });
    }
  }

  // Cadastrar visitante/comunidade
  static async cadastrarVisitante(req, res) {
    try {
      const { nome, tipo, telefone, email, interesses } = req.body;

      if (!nome || nome.trim() === '') {
        return res.status(400).json({
          error: 'Nome é obrigatório'
        });
      }

      if (!tipo || !['visitante', 'comunidade'].includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo deve ser "visitante" ou "comunidade"'
        });
      }

      // Criar usuário
      const usuario = await Usuario.criarVisitante({
        nome: nome.trim(),
        tipo,
        telefone: telefone || '',
        email: email || '',
        interesses: interesses || []
      });

      res.status(201).json({
        message: 'Visitante cadastrado com sucesso!',
        usuario: {
          id: usuario.id,
          tipo: usuario.tipo,
          nome: usuario.nome,
          qr_code: usuario.qr_code,
          interesses: usuario.interesses
        }
      });

    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar visitante. Tente novamente.'
      });
    }
  }

  // Buscar usuário por QR Code
  static async buscarPorQRCode(req, res) {
    try {
      const { qrCode } = req.params;

      const usuario = await Usuario.findByQRCode(qrCode);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        usuario: {
          id: usuario.id,
          tipo: usuario.tipo,
          nome: usuario.nome,
          ra: usuario.ra,
          qr_code: usuario.qr_code,
          interesses: usuario.interesses
        }
      });

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        error: 'Erro ao buscar usuário'
      });
    }
  }

  // Buscar usuário por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.json({ usuario });

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({
        error: 'Erro ao buscar usuário'
      });
    }
  }

  // Listar todos os usuários
  static async listarTodos(req, res) {
    try {
      const usuarios = await Usuario.findAll();

      res.json({
        usuarios,
        total: usuarios.length
      });

    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        error: 'Erro ao listar usuários'
      });
    }
  }

  // Atualizar interesses
  static async atualizarInteresses(req, res) {
    try {
      const { id } = req.params;
      const { interesses } = req.body;

      if (!Array.isArray(interesses)) {
        return res.status(400).json({
          error: 'Interesses deve ser um array'
        });
      }

      const sucesso = await Usuario.atualizarInteresses(id, interesses);

      if (!sucesso) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.json({
        message: 'Interesses atualizados com sucesso!'
      });

    } catch (error) {
      console.error('Erro ao atualizar interesses:', error);
      res.status(500).json({
        error: 'Erro ao atualizar interesses'
      });
    }
  }
}

module.exports = UsuarioController;

