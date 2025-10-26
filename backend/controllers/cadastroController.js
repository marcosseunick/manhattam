const Aluno = require('../models/Aluno');
const Visitante = require('../models/Visitante');

class CadastroController {
  // Cadastro de Aluno (simplificado - sem integração TOTVS)
  static async cadastrarAluno(req, res) {
    try {
      const { ra } = req.body;

      // Validação básica
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

      // Verificar se o RA já existe
      const alunoExistente = await Aluno.exists(ra);
      if (alunoExistente) {
        return res.status(409).json({
          error: 'Este RA já está cadastrado'
        });
      }

      // Criar aluno diretamente (sem validação TOTVS para teste)
      const alunoId = await Aluno.create({
        ra,
        nome: `Aluno ${ra}`, // Nome genérico para teste
        email: `aluno${ra}@mackenzie.br`,
        curso: 'Curso de Teste'
      });

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso!',
        aluno: {
          id: alunoId,
          ra,
          nome: `Aluno ${ra}`
        }
      });

    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar aluno. Tente novamente.'
      });
    }
  }

  // Cadastro de Visitante
  static async cadastrarVisitante(req, res) {
    try {
      const { nome, telefone, senha } = req.body;

      // Validação básica
      if (!nome || nome.trim() === '') {
        return res.status(400).json({
          error: 'Nome é obrigatório'
        });
      }

      if (!senha || senha.length < 6) {
        return res.status(400).json({
          error: 'Senha deve ter no mínimo 6 caracteres'
        });
      }

      // Verificar se telefone já existe (se fornecido)
      if (telefone) {
        const telefoneExistente = await Visitante.existsByTelefone(telefone);
        if (telefoneExistente) {
          return res.status(409).json({
            error: 'Este telefone já está cadastrado'
          });
        }
      }

      // Criar visitante
      const visitanteId = await Visitante.create({
        nome,
        telefone,
        senha
      });

      res.status(201).json({
        message: 'Visitante cadastrado com sucesso!',
        visitante: {
          id: visitanteId,
          nome
        }
      });

    } catch (error) {
      console.error('Erro ao cadastrar visitante:', error);
      res.status(500).json({
        error: 'Erro ao cadastrar visitante. Tente novamente.'
      });
    }
  }
}

module.exports = CadastroController;
