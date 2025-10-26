const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

class Monitor {
  static CSV_FILE = path.join(__dirname, '../data/monitores.csv');
  static CSV_HEADERS = 'id,nome,email,senha_hash,nivel,data_cadastro,ativo\n';

  // Inicializar arquivo CSV
  static async initializeCSV() {
    try {
      await fs.access(this.CSV_FILE);
    } catch {
      const dataDir = path.join(__dirname, '../data');
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS);
    }
  }

  // Ler todos os monitores
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1);
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, nome, email, senha_hash, nivel, data_cadastro, ativo] = line.split(',');
        return {
          id: parseInt(id),
          nome,
          email,
          senha_hash,
          nivel, // 'admin' ou 'admin_senior'
          data_cadastro,
          ativo: ativo === 'true'
        };
      });
  }

  // Criar monitor
  static async create(monitorData) {
    await this.initializeCSV();
    const { nome, email, senha, nivel } = monitorData;
    
    const monitores = await this.readAll();
    const novoId = monitores.length > 0 ? Math.max(...monitores.map(m => m.id)) + 1 : 1;
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    const dataCadastro = new Date().toISOString();
    
    const novaLinha = `${novoId},${nome},${email},${senhaHash},${nivel || 'admin'},${dataCadastro},true\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    return novoId;
  }

  // Buscar por ID
  static async findById(id) {
    const monitores = await this.readAll();
    return monitores.find(m => m.id === id && m.ativo);
  }

  // Buscar por email
  static async findByEmail(email) {
    const monitores = await this.readAll();
    return monitores.find(m => m.email === email && m.ativo);
  }

  // Verificar senha
  static async verifyPassword(id, senha) {
    const monitor = await this.findById(id);
    if (!monitor) return false;
    return await bcrypt.compare(senha, monitor.senha_hash);
  }

  // Listar todos ativos
  static async findAll() {
    const monitores = await this.readAll();
    return monitores.filter(m => m.ativo).map(m => ({
      id: m.id,
      nome: m.nome,
      email: m.email,
      nivel: m.nivel,
      data_cadastro: m.data_cadastro
    }));
  }

  // Atualizar nível
  static async updateNivel(id, novoNivel) {
    const monitores = await this.readAll();
    const index = monitores.findIndex(m => m.id === id);
    
    if (index === -1) return false;
    
    monitores[index].nivel = novoNivel;
    await this.saveAll(monitores);
    return true;
  }

  // Desativar monitor
  static async deactivate(id) {
    const monitores = await this.readAll();
    const index = monitores.findIndex(m => m.id === id);
    
    if (index === -1) return false;
    
    monitores[index].ativo = false;
    await this.saveAll(monitores);
    return true;
  }

  // Salvar todos
  static async saveAll(monitores) {
    const lines = monitores.map(m => 
      `${m.id},${m.nome},${m.email},${m.senha_hash},${m.nivel},${m.data_cadastro},${m.ativo}`
    ).join('\n');
    
    await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS + lines + '\n');
  }
}

module.exports = Monitor;

