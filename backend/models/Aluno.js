const fs = require('fs').promises;
const path = require('path');

class Aluno {
  static CSV_FILE = path.join(__dirname, '../data/alunos.csv');
  static CSV_HEADERS = 'id,ra,nome,email,curso,data_cadastro,ativo\n';

  // Inicializar arquivo CSV se não existir
  static async initializeCSV() {
    try {
      await fs.access(this.CSV_FILE);
    } catch {
      const dataDir = path.join(__dirname, '../data');
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS);
    }
  }

  // Ler todos os alunos do CSV
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1); // Remove header
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, ra, nome, email, curso, data_cadastro, ativo] = line.split(',');
        return { 
          id: parseInt(id), 
          ra, 
          nome, 
          email, 
          curso, 
          data_cadastro,
          ativo: ativo === 'true'
        };
      });
  }

  // Buscar aluno por RA
  static async findByRA(ra) {
    const alunos = await this.readAll();
    return alunos.find(a => a.ra === ra && a.ativo);
  }

  // Criar novo aluno
  static async create(alunoData) {
    await this.initializeCSV();
    const { ra, nome, email, curso } = alunoData;
    
    const alunos = await this.readAll();
    const novoId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
    
    const dataCadastro = new Date().toISOString();
    const novaLinha = `${novoId},${ra},${nome || ''},${email || ''},${curso || ''},${dataCadastro},true\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    return novoId;
  }

  // Verificar se RA já existe
  static async exists(ra) {
    const alunos = await this.readAll();
    return alunos.some(a => a.ra === ra);
  }

  // Listar todos os alunos ativos
  static async findAll() {
    const alunos = await this.readAll();
    return alunos.filter(a => a.ativo);
  }

  // Atualizar dados do aluno
  static async update(ra, alunoData) {
    const alunos = await this.readAll();
    const index = alunos.findIndex(a => a.ra === ra);
    
    if (index === -1) return false;
    
    alunos[index] = { ...alunos[index], ...alunoData };
    await this.saveAll(alunos);
    return true;
  }

  // Desativar aluno (soft delete)
  static async deactivate(ra) {
    return await this.update(ra, { ativo: false });
  }

  // Salvar todos os alunos
  static async saveAll(alunos) {
    const lines = alunos.map(a => 
      `${a.id},${a.ra},${a.nome},${a.email},${a.curso},${a.data_cadastro},${a.ativo}`
    ).join('\n');
    
    await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS + lines + '\n');
  }
}

module.exports = Aluno;
