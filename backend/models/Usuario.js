const fs = require('fs').promises;
const path = require('path');
const QRCodeService = require('../services/QRCodeService');

class Usuario {
  static CSV_FILE = path.join(__dirname, '../data/usuarios.csv');
  static CSV_HEADERS = 'id,tipo,ra,nome,telefone,email,sexo,data_nascimento,idade,curso,qr_code,interesses,tipo_aluno,responsavel_id,relacao,data_cadastro,ativo\n';

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

  // Ler todos os usuários
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1);
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, tipo, ra, nome, telefone, email, sexo, data_nascimento, idade, curso, qr_code, interesses, tipo_aluno, responsavel_id, relacao, data_cadastro, ativo] = line.split(',');
        return {
          id,
          tipo,
          ra,
          nome,
          telefone,
          email,
          sexo,
          data_nascimento,
          idade: parseInt(idade) || 0,
          curso,
          qr_code,
          interesses: interesses ? interesses.split('|') : [],
          tipo_aluno,
          responsavel_id,
          relacao,
          data_cadastro,
          ativo: ativo === 'true'
        };
      });
  }

  // Criar usuário ALUNO (com dados do TOTVS)
  static async criarAluno(dadosAluno, interesses = [], tipoAluno = 'interno') {
    await this.initializeCSV();
    
    const ra = dadosAluno.RA;
    const qrCode = QRCodeService.gerarCodigoQR('ALU', ra);
    const dataCadastro = new Date().toISOString();
    const interessesStr = interesses.join('|');
    
    const novaLinha = `${ra},aluno,${ra},${dadosAluno.Nome},${dadosAluno.Telefone},${dadosAluno.Email},${dadosAluno.Sexo},${dadosAluno.Data_Nascimento},${dadosAluno.Idade},${dadosAluno.Curso},${qrCode},${interessesStr},${tipoAluno},,${dataCadastro},true\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    
    return {
      id: ra,
      tipo: 'aluno',
      ra,
      nome: dadosAluno.Nome,
      qr_code: qrCode,
      interesses,
      tipo_aluno: tipoAluno
    };
  }

  // Criar usuário VISITANTE/COMUNIDADE
  static async criarVisitante(dadosVisitante) {
    await this.initializeCSV();
    
    const usuarios = await this.readAll();
    const novoId = `VIS${usuarios.length + 1000}`;
    
    const tipoQR = dadosVisitante.tipo === 'comunidade' ? 'COM' : 'VIS';
    const qrCode = QRCodeService.gerarCodigoQR(tipoQR, novoId);
    const dataCadastro = new Date().toISOString();
    
    const interessesStr = dadosVisitante.interesses ? dadosVisitante.interesses.join('|') : '';
    
    // Gerar senha automática: 2 primeiras letras do nome + 4 últimos dígitos do telefone
    const senha = this.gerarSenhaAutomatica(dadosVisitante.nome, dadosVisitante.telefone);
    
    const responsavel_id = dadosVisitante.responsavel_id || '';
    const relacao = dadosVisitante.relacao || '';
    
    const novaLinha = `${novoId},${dadosVisitante.tipo},,${dadosVisitante.nome},${dadosVisitante.telefone || ''},${dadosVisitante.email || ''},,,,${qrCode},${interessesStr},,${responsavel_id},${relacao},${dataCadastro},true\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    
    return {
      id: novoId,
      tipo: dadosVisitante.tipo,
      nome: dadosVisitante.nome,
      qr_code: qrCode,
      senha: senha,
      interesses: dadosVisitante.interesses || []
    };
  }

  // Gerar senha automática
  static gerarSenhaAutomatica(nome, telefone) {
    if (!nome || !telefone) {
      return 'SENHA123'; // Senha padrão se dados faltarem
    }
    
    // 2 primeiras letras do nome (maiúsculas)
    const prefixo = nome.trim().substring(0, 2).toUpperCase();
    
    // 4 últimos dígitos do telefone
    const telefoneNumeros = telefone.replace(/\D/g, ''); // Remove tudo exceto números
    const sufixo = telefoneNumeros.slice(-4);
    
    return `${prefixo}${sufixo}`;
  }

  // Buscar por ID
  static async findById(id) {
    const usuarios = await this.readAll();
    return usuarios.find(u => u.id === id && u.ativo);
  }

  // Buscar por QR Code
  static async findByQRCode(qrCode) {
    const usuarios = await this.readAll();
    return usuarios.find(u => u.qr_code === qrCode && u.ativo);
  }

  // Buscar por RA
  static async findByRA(ra) {
    const usuarios = await this.readAll();
    return usuarios.find(u => u.ra === ra && u.ativo);
  }

  // Verificar se já existe
  static async exists(id) {
    const usuario = await this.findById(id);
    return !!usuario;
  }

  // Listar todos ativos
  static async findAll() {
    const usuarios = await this.readAll();
    return usuarios.filter(u => u.ativo);
  }

  // Buscar dependentes de um responsável
  static async findDependentes(responsavelId) {
    const usuarios = await this.readAll();
    return usuarios.filter(u => u.responsavel_id === responsavelId && u.ativo);
  }

  // Atualizar interesses
  static async atualizarInteresses(id, interesses) {
    const usuarios = await this.readAll();
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) return false;
    
    usuarios[index].interesses = interesses;
    await this.saveAll(usuarios);
    return true;
  }

  // Desativar usuário
  static async deactivate(id) {
    const usuarios = await this.readAll();
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) return false;
    
    usuarios[index].ativo = false;
    await this.saveAll(usuarios);
    return true;
  }

  // Salvar todos
  static async saveAll(usuarios) {
    const lines = usuarios.map(u => 
      `${u.id},${u.tipo},${u.ra || ''},${u.nome},${u.telefone || ''},${u.email || ''},${u.sexo || ''},${u.data_nascimento || ''},${u.idade || 0},${u.curso || ''},${u.qr_code},${u.interesses.join('|')},${u.tipo_aluno || ''},${u.responsavel_id || ''},${u.relacao || ''},${u.data_cadastro},${u.ativo}`
    ).join('\n');
    
    await fs.writeFile(this.CSV_FILE, this.CSV_HEADERS + lines + '\n');
  }
}

module.exports = Usuario;

