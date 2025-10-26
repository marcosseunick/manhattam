const fs = require('fs').promises;
const path = require('path');

class Entrada {
  static CSV_FILE = path.join(__dirname, '../data/entradas.csv');
  static CSV_HEADERS = 'id,usuario_id,usuario_tipo,usuario_nome,qr_code,data_hora,dia_semana,periodo\n';

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

  // Ler todas as entradas
  static async readAll() {
    await this.initializeCSV();
    const content = await fs.readFile(this.CSV_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1);
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [id, usuario_id, usuario_tipo, usuario_nome, qr_code, data_hora, dia_semana, periodo] = line.split(',');
        return {
          id: parseInt(id),
          usuario_id,
          usuario_tipo,
          usuario_nome,
          qr_code,
          data_hora,
          dia_semana,
          periodo
        };
      });
  }

  // Registrar nova entrada (check-in)
  static async registrar(usuario) {
    await this.initializeCSV();
    
    const entradas = await this.readAll();
    const novoId = entradas.length > 0 ? Math.max(...entradas.map(e => e.id)) + 1 : 1;
    
    const agora = new Date();
    const dataHora = agora.toISOString();
    const diaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][agora.getDay()];
    const hora = agora.getHours();
    
    // Determinar período
    let periodo = 'Manhã';
    if (hora >= 12 && hora < 18) periodo = 'Tarde';
    else if (hora >= 18) periodo = 'Noite';
    
    const novaLinha = `${novoId},${usuario.id},${usuario.tipo},${usuario.nome},${usuario.qr_code},${dataHora},${diaSemana},${periodo}\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    
    return {
      id: novoId,
      usuario_id: usuario.id,
      usuario_nome: usuario.nome,
      data_hora: dataHora,
      dia_semana: diaSemana,
      periodo
    };
  }

  // Buscar por ID
  static async findById(id) {
    const entradas = await this.readAll();
    return entradas.find(e => e.id === id);
  }

  // Buscar entradas de um usuário
  static async findByUsuario(usuarioId) {
    const entradas = await this.readAll();
    return entradas.filter(e => e.usuario_id === usuarioId);
  }

  // Contar visitas de um usuário
  static async contarVisitas(usuarioId) {
    const entradas = await this.findByUsuario(usuarioId);
    return entradas.length;
  }

  // Última visita de um usuário
  static async ultimaVisita(usuarioId) {
    const entradas = await this.findByUsuario(usuarioId);
    if (entradas.length === 0) return null;
    
    return entradas[entradas.length - 1];
  }

  // Entradas de hoje
  static async entradasHoje() {
    const entradas = await this.readAll();
    const hoje = new Date().toISOString().split('T')[0];
    
    return entradas.filter(e => e.data_hora.startsWith(hoje));
  }

  // Entradas por período
  static async entrdasPorPeriodo(dataInicio, dataFim) {
    const entradas = await this.readAll();
    
    return entradas.filter(e => {
      const dataEntrada = e.data_hora.split('T')[0];
      return dataEntrada >= dataInicio && dataEntrada <= dataFim;
    });
  }

  // Estatísticas gerais
  static async estatisticas() {
    const entradas = await this.readAll();
    const hoje = await this.entradasHoje();
    
    // Visitantes únicos
    const visitantesUnicos = new Set(entradas.map(e => e.usuario_id)).size;
    const visitantesHoje = new Set(hoje.map(e => e.usuario_id)).size;
    
    // Por tipo
    const porTipo = {};
    entradas.forEach(e => {
      porTipo[e.usuario_tipo] = (porTipo[e.usuario_tipo] || 0) + 1;
    });
    
    // Por período
    const porPeriodo = {};
    entradas.forEach(e => {
      porPeriodo[e.periodo] = (porPeriodo[e.periodo] || 0) + 1;
    });
    
    return {
      total_entradas: entradas.length,
      entradas_hoje: hoje.length,
      visitantes_unicos: visitantesUnicos,
      visitantes_hoje: visitantesHoje,
      por_tipo: porTipo,
      por_periodo: porPeriodo
    };
  }
}

module.exports = Entrada;

