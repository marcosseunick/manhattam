const Entrada = require('../models/Entrada');
const Usuario = require('../models/Usuario');
const QRCodeService = require('../services/QRCodeService');

class EntradaController {
  // Registrar entrada (check-in via QR Code)
  static async registrarEntrada(req, res) {
    try {
      const { qr_code } = req.body;

      if (!qr_code || qr_code.trim() === '') {
        return res.status(400).json({
          error: 'QR Code é obrigatório'
        });
      }

      // Validar formato do QR Code
      const validacao = QRCodeService.validarQRCode(qr_code);
      if (!validacao.valido) {
        return res.status(400).json({
          error: validacao.erro
        });
      }

      // Buscar usuário
      const usuario = await Usuario.findByQRCode(qr_code);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado. QR Code inválido.'
        });
      }

      // Registrar entrada
      const entrada = await Entrada.registrar(usuario);

      // Contar total de visitas do usuário
      const totalVisitas = await Entrada.contarVisitas(usuario.id);

      res.status(201).json({
        message: `Bem-vindo${usuario.sexo === 'F' ? 'a' : ''}, ${usuario.nome}!`,
        entrada: {
          id: entrada.id,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
          },
          data_hora: entrada.data_hora,
          total_visitas: totalVisitas
        }
      });

    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      res.status(500).json({
        error: 'Erro ao registrar entrada. Tente novamente.'
      });
    }
  }

  // Buscar entradas de um usuário
  static async entradasUsuario(req, res) {
    try {
      const { usuarioId } = req.params;

      const entradas = await Entrada.findByUsuario(usuarioId);

      res.json({
        entradas,
        total: entradas.length
      });

    } catch (error) {
      console.error('Erro ao buscar entradas:', error);
      res.status(500).json({
        error: 'Erro ao buscar entradas'
      });
    }
  }

  // Entradas de hoje
  static async entradasHoje(req, res) {
    try {
      const entradas = await Entrada.entradasHoje();

      res.json({
        entradas,
        total: entradas.length
      });

    } catch (error) {
      console.error('Erro ao buscar entradas de hoje:', error);
      res.status(500).json({
        error: 'Erro ao buscar entradas'
      });
    }
  }

  // Estatísticas gerais
  static async estatisticas(req, res) {
    try {
      const stats = await Entrada.estatisticas();

      res.json(stats);

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        error: 'Erro ao buscar estatísticas'
      });
    }
  }
}

module.exports = EntradaController;

