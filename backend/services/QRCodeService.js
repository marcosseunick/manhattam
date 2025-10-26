/**
 * Service para geração de QR Codes
 * Por enquanto gera apenas o código (string)
 * Pode ser expandido para usar biblioteca de QR Code visual
 */
class QRCodeService {
  /**
   * Gera código QR único para usuário
   * Formato: TIPO-ID-HASH
   * Exemplo: ALU-12345-A3F8K2
   */
  static gerarCodigoQR(tipo, id) {
    const hash = this.gerarHash();
    return `${tipo}-${id}-${hash}`;
  }

  /**
   * Gera hash aleatório
   */
  static gerarHash() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  /**
   * Valida formato do QR Code
   */
  static validarQRCode(qrCode) {
    if (!qrCode || typeof qrCode !== 'string') {
      return { valido: false, erro: 'QR Code inválido' };
    }

    const partes = qrCode.split('-');
    
    if (partes.length !== 3) {
      return { valido: false, erro: 'Formato de QR Code inválido' };
    }

    const [tipo, id, hash] = partes;

    if (!['ALU', 'VIS', 'COM'].includes(tipo)) {
      return { valido: false, erro: 'Tipo de usuário inválido' };
    }

    if (!id || !hash) {
      return { valido: false, erro: 'QR Code incompleto' };
    }

    return {
      valido: true,
      tipo,
      id,
      hash
    };
  }

  /**
   * Decodifica QR Code e retorna informações
   */
  static decodificarQRCode(qrCode) {
    const validacao = this.validarQRCode(qrCode);
    
    if (!validacao.valido) {
      return validacao;
    }

    const tipoMap = {
      'ALU': 'aluno',
      'VIS': 'visitante',
      'COM': 'comunidade'
    };

    return {
      valido: true,
      tipo: tipoMap[validacao.tipo],
      id: validacao.id,
      qrCode: qrCode
    };
  }
}

module.exports = QRCodeService;

