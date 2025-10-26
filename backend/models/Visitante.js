const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

class Visitante {
  static CSV_FILE = path.join(__dirname, '../data/visitantes.csv');
  static CSV_HEADERS = 'id,nome,telefone,senha_hash,data_cadastro,ativo\n';

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

  // Ler todos os visitantes do CSV
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1); // Remove header
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, nome, telefone, senha_hash, data_cadastro, ativo] = line.split(',');
        return { 
          id: parseInt(id), 
          nome, 
          telefone, 
          senha_hash,
          data_cadastro,
          ativo: ativo === 'true'
        };
      });
  }

  // Buscar visitante por ID
  static async findById(id) {
    const visitantes = await this.readAll();
    return visitantes.find(v => v.id === id && v.ativo);
  }

  // Buscar visitante por telefone
  static async findByTelefone(telefone) {
    const visitantes = await this.readAll();
    return visitantes.find(v => v.telefone === telefone && v.ativo);
  }

  // Buscar visitante por nome
  static async findByNome(nome) {
    const visitantes = await this.readAll();
    return visitantes.filter(v => 
      v.nome.toLowerCase().includes(nome.toLowerCase()) && v.ativo
    );
  }

  // Criar novo visitante
  static async create(visitanteData) {
    await this.initializeCSV();
    const { nome, telefone, senha } = visitanteData;
    
    const visitantes = await this.readAll();
    const novoId = visitantes.length > 0 ? Math.max(...visitantes.map(v => v.id)) + 1 : 1;
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    const dataCadastro = new Date().toISOString();
    
    const novaLinha = `${novoId},${nome},${telefone || ''},${senhaHash},${dataCadastro},true\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    return novoId;
  }

  // Verificar senha
  static async verifyPassword(id, senha) {
    const visitante = await this.findById(id);
    if (!visitante) return false;
    return await bcrypt.compare(senha, visitante.senha_hash);
  }

  // Verificar se telefone já existe
  static async existsByTelefone(telefone) {
    const visitantes = await this.readAll();
    return visitantes.some(v => v.telefone === telefone);
  }

  // Listar todos os visitantes ativos
  static async findAll() {
    const visitantes = await this.readAll();
    return visitantes
      .filter(v => v.ativo)
      .map(v => ({
        id: v.id,
        nome: v.nome,
        telefone: v.telefone,
        data_cadastro: v.data_cadastro
      }));
  }

  // Atualizar dados do visitante
  static async update(id, visitanteData) {
    const visitantes = await this.readAll();
    const index = visitantes.findIndex(v => v.id === id);
    
    if (index === -1) return false;
    
    visitantes[index] = { ...visitantes[index], ...visitanteData };
    await this.saveAll(visitantes);
    return true;
  }

  // Atualizar senha
  static async updatePassword(id, novaSenha) {
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    return await this.update(id, { senha_hash: senhaHash });
  }

  // Desativar visitante (soft delete)
  static async deactivate(id) {
    return await this.update(id, { ativo: false });
  }

  // Salvar todos os visitantes
  static async saveAll(visitantes) {
    const lines = visitantes.map(v => 
      `${v.id},${v.nome},${v.telefone},${v.senha_hash},${v.data_cadastro},${v.ativo}`
    ).join('\n');
    
    await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS + lines + '\n');
  }
}

module.exports = Visitante;
