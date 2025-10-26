const fs = require('fs').promises;
const path = require('path');

class Sala {
  static CSV_FILE = path.join(__dirname, '../data/salas.csv');
  static CSV_HEADERS = 'id,criador_qr_code,nome,jogo,jogadores_qr_codes,status,data_criacao,data_inicio,data_fim\n';

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

  // Ler todas as salas
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1);
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, criador_qr_code, nome, jogo, jogadores_qr_codes, status, data_criacao, data_inicio, data_fim] = line.split(',');
        return { 
          id,
          criador_qr_code,
          nome,
          jogo,
          jogadores_qr_codes: jogadores_qr_codes ? jogadores_qr_codes.split('|').filter(j => j.trim()) : [],
          status,
          data_criacao,
          data_inicio,
          data_fim
        };
      });
  }

  // Gerar ID único de sala
  static gerarIdSala() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  // Criar nova sala
  static async create(salaData) {
    await this.initializeCSV();
    const { criador_qr_code, nome, jogo, jogadores_qr_codes } = salaData;
    
    const novoId = this.gerarIdSala();
    const dataCriacao = new Date().toISOString();
    
    // Jogadores deve ser um array de QR Codes
    const jogadoresStr = Array.isArray(jogadores_qr_codes) ? jogadores_qr_codes.join('|') : '';
    
    const novaLinha = `${novoId},${criador_qr_code},${nome || ''},${jogo || ''},${jogadoresStr},aguardando,${dataCriacao},,\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    return novoId;
  }

  // Buscar sala por ID
  static async findById(id) {
    const salas = await this.readAll();
    return salas.find(s => s.id === id);
  }

  // Buscar salas do usuário (por QR Code)
  static async findByUser(qrCode) {
    const salas = await this.readAll();
    return salas.filter(s => s.criador_qr_code === qrCode);
  }

  // Buscar salas disponíveis (aguardando jogadores)
  static async findAvailable() {
    const salas = await this.readAll();
    return salas.filter(s => s.status === 'aguardando');
  }

  // Adicionar jogador à sala (por QR Code)
  static async adicionarJogador(salaId, qrCodeJogador) {
    const salas = await this.readAll();
    const index = salas.findIndex(s => s.id === salaId);
    
    if (index === -1) return { success: false, message: 'Sala não encontrada' };
    
    const sala = salas[index];
    
    if (sala.status !== 'aguardando') {
      return { success: false, message: 'Sala não está disponível' };
    }
    
    // Verificar se o jogador já está na sala
    if (sala.jogadores_qr_codes.includes(qrCodeJogador)) {
      return { success: false, message: 'Jogador já está nesta sala' };
    }
    
    // Adicionar jogador
    salas[index].jogadores_qr_codes.push(qrCodeJogador);
    
    await this.saveAll(salas);
    return { success: true, sala: salas[index] };
  }

  // Remover jogador da sala (por QR Code)
  static async removerJogador(salaId, qrCodeJogador) {
    const salas = await this.readAll();
    const index = salas.findIndex(s => s.id === salaId);
    
    if (index === -1) return { success: false, message: 'Sala não encontrada' };
    
    const sala = salas[index];
    
    // Remover jogador
    salas[index].jogadores_qr_codes = sala.jogadores_qr_codes.filter(j => j !== qrCodeJogador);
    
    await this.saveAll(salas);
    return { success: true, sala: salas[index] };
  }

  // Iniciar sala (todos os jogadores confirmados)
  static async iniciarSala(salaId) {
    const salas = await this.readAll();
    const index = salas.findIndex(s => s.id === salaId);
    
    if (index === -1) return { success: false, message: 'Sala não encontrada' };
    
    salas[index].status = 'em_andamento';
    salas[index].data_inicio = new Date().toISOString();
    
    await this.saveAll(salas);
    return { success: true, sala: salas[index] };
  }

  // Atualizar status da sala
  static async updateStatus(salaId, novoStatus) {
    const salas = await this.readAll();
    const index = salas.findIndex(s => s.id === salaId);
    
    if (index === -1) return false;
    
    salas[index].status = novoStatus;
    
    if (novoStatus === 'finalizada') {
      salas[index].data_fim = new Date().toISOString();
    }
    
    await this.saveAll(salas);
    return true;
  }

  // Salvar todas as salas
  static async saveAll(salas) {
    const lines = salas.map(s => {
      const jogadoresStr = s.jogadores_qr_codes.join('|');
      return `${s.id},${s.criador_qr_code},${s.nome},${s.jogo},${jogadoresStr},${s.status},${s.data_criacao},${s.data_inicio || ''},${s.data_fim || ''}`;
    }).join('\n');
    
    await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS + lines + '\n');
  }
}

module.exports = Sala;
