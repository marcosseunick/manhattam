const fs = require('fs').promises;
const path = require('path');

class Entrada {
  static CSV_FILE = path.join(__dirname, '../data/registros.csv');
  static CSV_HEADERS = 'id_unicoUsuario,interesse,data,periodo,tempo_permanencia,monitor\n';

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
        const [id_unicoUsuario, interesse, data, periodo, tempo_permanencia, monitor] = line.split(',');
        return {
          id_unicoUsuario,
          interesse,
          data,
          periodo,
          tempo_permanencia,
          monitor
        };
      });
  }

  // Registrar novo registro com interesse
  static async registrarInteresse(idUnicoUsuario, interesse) {
    await this.initializeCSV();
    
    const agora = new Date();
    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
    const ano = agora.getFullYear();
    const data = `${dia}/${mes}/${ano}`;
    
    const hora = agora.getHours();
    
    // Determinar período
    let periodo = '';
    if (hora >= 12 && hora < 18) periodo = 'Tarde';
    else if (hora >= 18) periodo = 'Noite';
    // Manhã fica vazio
    
    // Tempo de permanência começa em 0
    const tempo_permanencia = '0';
    
    // Monitor fica vazio (preenchido depois)
    const monitor = '';
    
    const novaLinha = `${idUnicoUsuario},${interesse},${data},${periodo},${tempo_permanencia},${monitor}\n`;
    
    await fs.appendFile(this.CSV_FILE, novaLinha);
    
    return {
      id_unicoUsuario: idUnicoUsuario,
      interesse,
      data,
      periodo,
      tempo_permanencia,
      monitor
    };
  }

  // Buscar por ID
  static async findById(id) {
    const entradas = await this.readAll();
    return entradas.find(e => e.id === id);
  }

  // Buscar registros de um usuário
  static async findByUsuario(usuarioId) {
    const registros = await this.readAll();
    return registros.filter(e => e.id_unicoUsuario === usuarioId);
  }

  // Contar registros de um usuário
  static async contarVisitas(usuarioId) {
    const registros = await this.findByUsuario(usuarioId);
    return registros.length;
  }

  // Último registro de um usuário
  static async ultimaVisita(usuarioId) {
    const registros = await this.findByUsuario(usuarioId);
    if (registros.length === 0) return null;
    
    return registros[registros.length - 1];
  }

  // Registros de hoje
  static async entradasHoje() {
    const registros = await this.readAll();
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataHoje = `${dia}/${mes}/${ano}`;
    
    return registros.filter(e => e.data === dataHoje);
  }

  // Registros por período
  static async entrdasPorPeriodo(dataInicio, dataFim) {
    const registros = await this.readAll();
    
    return registros.filter(e => {
      // Converter formato DD/MM/YYYY para comparação
      const [dia, mes, ano] = e.data.split('/');
      const dataEntrada = `${ano}-${mes}-${dia}`;
      
      const [diaIni, mesIni, anoIni] = dataInicio.split('/');
      const dataInicioFormatada = `${anoIni}-${mesIni}-${diaIni}`;
      
      const [diaFim, mesFim, anoFim] = dataFim.split('/');
      const dataFimFormatada = `${anoFim}-${mesFim}-${diaFim}`;
      
      return dataEntrada >= dataInicioFormatada && dataEntrada <= dataFimFormatada;
    });
  }

  // Estatísticas gerais
  static async estatisticas() {
    const registros = await this.readAll();
    const hoje = await this.entradasHoje();
    
    // Usuários únicos
    const usuariosUnicos = new Set(registros.map(e => e.id_unicoUsuario)).size;
    const usuariosHoje = new Set(hoje.map(e => e.id_unicoUsuario)).size;
    
    // Por interesse
    const porInteresse = {};
    registros.forEach(e => {
      if (e.interesse) {
        porInteresse[e.interesse] = (porInteresse[e.interesse] || 0) + 1;
      }
    });
    
    // Por período
    const porPeriodo = {};
    registros.forEach(e => {
      const periodo = e.periodo || 'Manhã';
      porPeriodo[periodo] = (porPeriodo[periodo] || 0) + 1;
    });
    
    return {
      total_registros: registros.length,
      registros_hoje: hoje.length,
      usuarios_unicos: usuariosUnicos,
      usuarios_hoje: usuariosHoje,
      por_interesse: porInteresse,
      por_periodo: porPeriodo
    };
  }
}

module.exports = Entrada;

