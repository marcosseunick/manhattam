const Entrada = require('../models/Entrada');
const Usuario = require('../models/Usuario');

class RelatorioController {
  // Relatório geral
  static async relatorioGeral(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      let entradas;
      
      if (data_inicio && data_fim) {
        entradas = await Entrada.entrdasPorPeriodo(data_inicio, data_fim);
      } else {
        entradas = await Entrada.readAll();
      }

      const usuarios = await Usuario.findAll();

      // Análises
      const visitantesUnicos = new Set(entradas.map(e => e.usuario_id)).size;
      
      // Por tipo de usuário
      const porTipo = {};
      entradas.forEach(e => {
        porTipo[e.usuario_tipo] = (porTipo[e.usuario_tipo] || 0) + 1;
      });

      // Por período do dia
      const porPeriodo = {};
      entradas.forEach(e => {
        porPeriodo[e.periodo] = (porPeriodo[e.periodo] || 0) + 1;
      });

      // Por dia da semana
      const porDiaSemana = {};
      entradas.forEach(e => {
        porDiaSemana[e.dia_semana] = (porDiaSemana[e.dia_semana] || 0) + 1;
      });

      // Top visitantes
      const contagemPorUsuario = {};
      entradas.forEach(e => {
        contagemPorUsuario[e.usuario_id] = (contagemPorUsuario[e.usuario_id] || 0) + 1;
      });

      const topVisitantes = Object.entries(contagemPorUsuario)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([usuario_id, visitas]) => {
          const usuario = usuarios.find(u => u.id === usuario_id);
          return {
            usuario_id,
            nome: usuario ? usuario.nome : 'Desconhecido',
            tipo: usuario ? usuario.tipo : 'Desconhecido',
            visitas
          };
        });

      res.json({
        periodo: {
          inicio: data_inicio || 'Início',
          fim: data_fim || 'Agora'
        },
        resumo: {
          total_entradas: entradas.length,
          visitantes_unicos: visitantesUnicos,
          total_usuarios_cadastrados: usuarios.length
        },
        por_tipo: porTipo,
        por_periodo: porPeriodo,
        por_dia_semana: porDiaSemana,
        top_visitantes: topVisitantes
      });

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório'
      });
    }
  }

  // Relatório demográfico (alunos)
  static async relatorioDemografico(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      const alunos = usuarios.filter(u => u.tipo === 'aluno');

      // Por sexo
      const porSexo = {};
      alunos.forEach(a => {
        if (a.sexo) {
          porSexo[a.sexo] = (porSexo[a.sexo] || 0) + 1;
        }
      });

      // Por curso
      const porCurso = {};
      alunos.forEach(a => {
        if (a.curso) {
          porCurso[a.curso] = (porCurso[a.curso] || 0) + 1;
        }
      });

      // Por faixa etária
      const porIdade = {
        '18-20': 0,
        '21-23': 0,
        '24-26': 0,
        '27+': 0
      };

      alunos.forEach(a => {
        if (a.idade) {
          if (a.idade <= 20) porIdade['18-20']++;
          else if (a.idade <= 23) porIdade['21-23']++;
          else if (a.idade <= 26) porIdade['24-26']++;
          else porIdade['27+']++;
        }
      });

      res.json({
        total_alunos: alunos.length,
        por_sexo: porSexo,
        por_curso: porCurso,
        por_faixa_etaria: porIdade
      });

    } catch (error) {
      console.error('Erro ao gerar relatório demográfico:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório'
      });
    }
  }

  // Relatório de interesses
  static async relatorioInteresses(req, res) {
    try {
      const usuarios = await Usuario.findAll();

      const interesses = {};

      usuarios.forEach(u => {
        if (u.interesses && u.interesses.length > 0) {
          u.interesses.forEach(interesse => {
            if (interesse.trim()) {
              interesses[interesse] = (interesses[interesse] || 0) + 1;
            }
          });
        }
      });

      const interessesOrdenados = Object.entries(interesses)
        .sort(([, a], [, b]) => b - a)
        .map(([nome, quantidade]) => ({ nome, quantidade }));

      res.json({
        total_usuarios_com_interesses: usuarios.filter(u => u.interesses.length > 0).length,
        interesses: interessesOrdenados
      });

    } catch (error) {
      console.error('Erro ao gerar relatório de interesses:', error);
      res.status(500).json({
        error: 'Erro ao gerar relatório'
      });
    }
  }
}

module.exports = RelatorioController;

