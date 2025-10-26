# 🧪 Guia de Teste Completo - SavePoint Ludoteca

## 🚀 Início Rápido

### 1. Iniciar o Servidor
```bash
cd backend
npm start
```

Você deve ver:
```
╔═══════════════════════════════════════════╗
║  🎮 Savepoint Ludoteca - Backend API     ║
║  🚀 Servidor rodando na porta 3000       ║
║  📡 http://localhost:3000                ║
║  💾 Dados salvos em CSV                   ║
╚═══════════════════════════════════════════╝
```

---

## 📋 Cenários de Teste

### Cenário 1: Cadastro de Aluno

**1.1 - Cadastrar aluno com RA válido (6 dígitos):**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{
    "ra": "412345",
    "interesses": ["cartas", "tabuleiro", "videogame"]
  }'
```

**Resposta esperada:**
```json
{
  "message": "Aluno cadastrado com sucesso!",
  "usuario": {
    "id": "412345",
    "tipo": "aluno",
    "nome": "João Silva Santos",
    "ra": "412345",
    "qr_code": "ALU-412345-XXXXXX",
    "interesses": ["cartas", "tabuleiro", "videogame"]
  }
}
```

**1.2 - Tentar RA com menos de 6 dígitos:**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"123"}'
```

**Resposta esperada:**
```json
{
  "error": "RA deve conter exatamente 6 dígitos"
}
```

**1.3 - Tentar RA com mais de 6 dígitos:**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"1234567"}'
```

**Resposta esperada:**
```json
{
  "error": "RA deve conter exatamente 6 dígitos"
}
```

**1.4 - Tentar RA com letras:**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"ABC123"}'
```

**Resposta esperada:**
```json
{
  "error": "RA deve conter exatamente 6 dígitos"
}
```

**1.5 - Tentar RA válido mas não existente no TOTVS:**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"999999"}'
```

**Resposta esperada:**
```json
{
  "error": "RA não encontrado no sistema acadêmico"
}
```

---

### Cenário 2: Cadastro de Visitante

**2.1 - Cadastrar visitante:**
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/visitante \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "tipo": "visitante",
    "telefone": "11987654321",
    "email": "maria@email.com",
    "interesses": ["quebra-cabeça", "xadrez"]
  }'
```

---

### Cenário 3: Check-in (Entrada)

**3.1 - Fazer check-in com QR Code:**

Primeiro, cadastre um aluno e anote o QR Code retornado (ex: `ALU-412345-A3F8K2`)

```bash
curl -X POST http://localhost:3000/api/entrada/checkin \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "ALU-412345-A3F8K2"}'
```

**Resposta esperada:**
```json
{
  "message": "Bem-vindo, João Silva Santos!",
  "entrada": {
    "id": 1,
    "usuario": {
      "id": "412345",
      "nome": "João Silva Santos",
      "tipo": "aluno"
    },
    "data_hora": "2025-10-26T10:30:00.000Z",
    "total_visitas": 1
  }
}
```

---

## 📝 RAs Válidos para Teste (6 dígitos)

Use estes RAs para cadastrar alunos:

- **412345** - João Silva Santos (Ciência da Computação)
- **423456** - Maria Oliveira Costa (Engenharia Civil)
- **434567** - Pedro Henrique Lima (Administração)
- **445678** - Ana Carolina Souza (Psicologia)
- **456789** - Lucas Rodrigues Alves (Direito)
- **467890** - Beatriz Fernandes (Arquitetura)
- **478901** - Carlos Eduardo Pereira (Engenharia Elétrica)
- **489012** - Juliana Santos Rocha (Design)
- **490123** - Rafael Martins Silva (Ciência da Computação)
- **401234** - Fernanda Costa Lima (Jornalismo)
- **411111** - Gabriel Almeida Souza (Publicidade)
- **422222** - Camila Rodrigues Dias (Enfermagem)
- **433333** - Thiago Santos Oliveira (Sistemas de Informação)
- **444444** - Larissa Pereira Costa (Nutrição)
- **455555** - Rodrigo Lima Santos (Fisioterapia)

---

## ✅ Validações de RA

✅ Deve ter exatamente 6 dígitos  
✅ Deve conter apenas números  
✅ Deve existir na planilha TOTVS  
✅ Não pode estar duplicado  

### Exemplos:

- ✅ `412345` - Válido
- ✅ `423456` - Válido
- ❌ `123` - Inválido (menos de 6 dígitos)
- ❌ `1234567` - Inválido (mais de 6 dígitos)
- ❌ `ABC123` - Inválido (contém letras)
- ❌ `999999` - Inválido (não existe no TOTVS)

---

## 🎯 Teste Completo Passo a Passo

### 1. Cadastre alunos com RAs válidos:
```bash
# Aluno 1
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"412345","interesses":["cartas"]}'

# Aluno 2
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"423456","interesses":["tabuleiro"]}'

# Aluno 3
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"434567","interesses":["videogame"]}'
```

### 2. Teste validações (devem retornar erro):
```bash
# RA com 5 dígitos
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"12345"}'

# RA com 7 dígitos
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"1234567"}'

# RA com letras
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"ABC123"}'
```

---

**Sistema atualizado com validação de 6 dígitos! 🎉**
