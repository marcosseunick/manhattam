const fs = require('fs').promises;
const path = require('path');

/**
 * Service para simular integração com TOTVS
 * Lê dados de um arquivo CSV local ao invés de consultar API
 */
class TOTVSService {
  static CSV_FILE = path.join(__dirname, '../data/totvs_alunos.csv');

  /**
   * Busca aluno por RA no "TOTVS" (CSV)
   */
  static async buscarAlunoPorRA(ra) {
    try {
      const content = await fs.readFile(this.CSV_FILE, 'utf-8');
      const lines = content.trim().split('\n');
      
      // Primeira linha são os headers
      const headers = lines[0].split(',');
      
      // Buscar aluno
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const raAluno = values[0];
        
        if (raAluno === ra) {
          // Montar objeto com os dados
          const aluno = {};
          headers.forEach((header, index) => {
            aluno[header] = values[index] || '';
          });
          
          return {
            encontrado: true,
            dados: aluno
          };
        }
      }
      
      return {
        encontrado: false,
        mensagem: 'RA não encontrado no sistema acadêmico'
      };
      
    } catch (error) {
      console.error('Erro ao buscar no TOTVS:', error);
      throw new Error('Erro ao consultar sistema acadêmico');
    }
  }

  /**
   * Lista todos os alunos (para testes/admin)
   */
  static async listarTodosAlunos() {
    try {
      const content = await fs.readFile(this.CSV_FILE, 'utf-8');
      const lines = content.trim().split('\n');
      
      const headers = lines[0].split(',');
      const alunos = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const aluno = {};
        
        headers.forEach((header, index) => {
          aluno[header] = values[index] || '';
        });
        
        alunos.push(aluno);
      }
      
      return alunos;
      
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      throw new Error('Erro ao consultar sistema acadêmico');
    }
  }

  /**
   * Verifica se RA existe
   */
  static async verificarRA(ra) {
    const resultado = await this.buscarAlunoPorRA(ra);
    return resultado.encontrado;
  }
}

module.exports = TOTVSService;

