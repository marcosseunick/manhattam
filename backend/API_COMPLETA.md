# 📡 API Completa - SavePoint Ludoteca

## Sistema de Cadastro e Check-in para Ludoteca Universitária

Backend completo desenvolvido em Node.js com armazenamento em CSV (sem dependências externas).

---

## 🚀 Iniciar o Servidor

```bash
cd backend
npm start
```

Servidor disponível em: `http://localhost:3000`

---

## 📊 Estrutura de Dados

### Arquivos CSV Gerados:

```
backend/data/
├── totvs_alunos.csv      # Base de dados simulando TOTVS (15 alunos de exemplo)
├── usuarios.csv          # Usuários cadastrados no sistema
├── entradas.csv          # Registro de check-ins
├── salas.csv             # Salas de jogo criadas
├── alunos.csv            # Cadastros antigos (compatibilidade)
└── visitantes.csv        # Cadastros antigos (compatibilidade)
```

---

## 📡 Endpoints da API

### 1️⃣ **Usuários** (`/api/usuario`)

#### POST `/api/usuario/cadastro/aluno`
Cadastra um aluno (busca dados do TOTVS simulado)

**Request:**
```json
{
  "ra": "12345",
  "interesses": ["cartas", "tabuleiro", "videogame"]
}
```

**Response (201):**
```json
{
  "message": "Aluno cadastrado com sucesso!",
  "usuario": {
    "id": "12345",
    "tipo": "aluno",
    "nome": "João Silva Santos",
    "ra": "12345",
    "qr_code": "ALU-12345-A3F8K2",
    "interesses": ["cartas", "tabuleiro", "videogame"]
  }
}
```

---

#### POST `/api/usuario/cadastro/visitante`
Cadastra visitante ou membro da comunidade

**Request:**
```json
{
  "nome": "Maria Santos",
  "tipo": "visitante",
  "telefone": "11987654321",
  "email": "maria@email.com",
  "interesses": ["quebra-cabeça", "xadrez"]
}
```

**Response (201):**
```json
{
  "message": "Visitante cadastrado com sucesso!",
  "usuario": {
    "id": "VIS1000",
    "tipo": "visitante",
    "nome": "Maria Santos",
    "qr_code": "VIS-VIS1000-B7G4J1",
    "interesses": ["quebra-cabeça", "xadrez"]
  }
}
```

---

#### GET `/api/usuario/qrcode/:qrCode`
Busca usuário por QR Code

**Exemplo:**
```
GET /api/usuario/qrcode/ALU-12345-A3F8K2
```

**Response:**
```json
{
  "usuario": {
    "id": "12345",
    "tipo": "aluno",
    "nome": "João Silva Santos",
    "ra": "12345",
    "qr_code": "ALU-12345-A3F8K2",
    "interesses": ["cartas", "tabuleiro"]
  }
}
```

---

#### GET `/api/usuario`
Lista todos os usuários cadastrados

**Response:**
```json
{
  "usuarios": [...],
  "total": 25
}
```

---

### 2️⃣ **Entradas (Check-in)** (`/api/entrada`)

#### POST `/api/entrada/checkin`
Registra entrada via QR Code (escaneamento pelo monitor)

**Request:**
```json
{
  "qr_code": "ALU-12345-A3F8K2"
}
```

**Response (201):**
```json
{
  "message": "Bem-vindo, João Silva Santos!",
  "entrada": {
    "id": 1,
    "usuario": {
      "id": "12345",
      "nome": "João Silva Santos",
      "tipo": "aluno"
    },
    "data_hora": "2025-10-26T10:30:00.000Z",
    "total_visitas": 5
  }
}
```

---

#### GET `/api/entrada/hoje`
Lista todas as entradas de hoje

**Response:**
```json
{
  "entradas": [
    {
      "id": 1,
      "usuario_id": "12345",
      "usuario_nome": "João Silva Santos",
      "data_hora": "2025-10-26T10:30:00.000Z",
      "dia_semana": "Sábado",
      "periodo": "Manhã"
    }
  ],
  "total": 15
}
```

---

#### GET `/api/entrada/usuario/:usuarioId`
Lista entradas de um usuário específico

**Exemplo:**
```
GET /api/entrada/usuario/12345
```

---

#### GET `/api/entrada/estatisticas`
Estatísticas gerais do sistema

**Response:**
```json
{
  "total_entradas": 1543,
  "entradas_hoje": 47,
  "visitantes_unicos": 234,
  "visitantes_hoje": 32,
  "por_tipo": {
    "aluno": 1200,
    "visitante": 243,
    "comunidade": 100
  },
  "por_periodo": {
    "Manhã": 456,
    "Tarde": 789,
    "Noite": 298
  }
}
```

---

### 3️⃣ **Relatórios** (`/api/relatorio`)

#### GET `/api/relatorio/geral`
Relatório geral com análises

**Query params (opcionais):**
- `data_inicio`: formato YYYY-MM-DD
- `data_fim`: formato YYYY-MM-DD

**Exemplo:**
```
GET /api/relatorio/geral?data_inicio=2025-10-01&data_fim=2025-10-31
```

**Response:**
```json
{
  "periodo": {
    "inicio": "2025-10-01",
    "fim": "2025-10-31"
  },
  "resumo": {
    "total_entradas": 543,
    "visitantes_unicos": 187,
    "total_usuarios_cadastrados": 234
  },
  "por_tipo": {
    "aluno": 400,
    "visitante": 100,
    "comunidade": 43
  },
  "por_periodo": {
    "Manhã": 123,
    "Tarde": 278,
    "Noite": 142
  },
  "por_dia_semana": {
    "Segunda": 89,
    "Terça": 95,
    "Quarta": 102,
    "Quinta": 87,
    "Sexta": 98,
    "Sábado": 45,
    "Domingo": 27
  },
  "top_visitantes": [
    {
      "usuario_id": "12345",
      "nome": "João Silva Santos",
      "tipo": "aluno",
      "visitas": 23
    }
  ]
}
```

---

#### GET `/api/relatorio/demografico`
Relatório demográfico (alunos)

**Response:**
```json
{
  "total_alunos": 150,
  "por_sexo": {
    "M": 78,
    "F": 72
  },
  "por_curso": {
    "Ciência da Computação": 45,
    "Engenharia Civil": 23,
    "Administração": 18,
    "Psicologia": 15
  },
  "por_faixa_etaria": {
    "18-20": 45,
    "21-23": 67,
    "24-26": 28,
    "27+": 10
  }
}
```

---

#### GET `/api/relatorio/interesses`
Relatório de interesses dos usuários

**Response:**
```json
{
  "total_usuarios_com_interesses": 187,
  "interesses": [
    { "nome": "tabuleiro", "quantidade": 123 },
    { "nome": "cartas", "quantidade": 98 },
    { "nome": "videogame", "quantidade": 87 },
    { "nome": "quebra-cabeça", "quantidade": 65 },
    { "nome": "xadrez", "quantidade": 54 }
  ]
}
```

---

### 4️⃣ **Salas de Jogo** (`/api/sala`)

*(Já documentado em API_SALAS.md)*

---

## 🔄 Fluxo Completo do Sistema

### Cadastro de Aluno:
```
1. POST /api/usuario/cadastro/aluno
   Body: { "ra": "12345", "interesses": ["cartas", "tabuleiro"] }

2. Sistema busca dados no TOTVS (CSV)

3. Gera QR Code único: "ALU-12345-A3F8K2"

4. Retorna dados completos + QR Code
```

### Check-in (Entrada):
```
1. Monitor escaneia QR Code

2. POST /api/entrada/checkin
   Body: { "qr_code": "ALU-12345-A3F8K2" }

3. Sistema valida QR Code

4. Registra entrada com timestamp

5. Retorna: "Bem-vindo, João! Esta é sua 5ª visita!"
```

---

## 🧪 Testando Localmente

### 1. Cadastrar Aluno (RA válido do CSV):
```bash
curl -X POST http://localhost:3000/api/usuario/cadastro/aluno \
  -H "Content-Type: application/json" \
  -d '{"ra":"12345","interesses":["cartas","tabuleiro"]}'
```

### 2. Fazer Check-in:
```bash
curl -X POST http://localhost:3000/api/entrada/checkin \
  -H "Content-Type: application/json" \
  -d '{"qr_code":"ALU-12345-A3F8K2"}'
```

### 3. Ver Estatísticas:
```bash
curl http://localhost:3000/api/entrada/estatisticas
```

### 4. Relatório Geral:
```bash
curl http://localhost:3000/api/relatorio/geral
```

---

## 📝 RAs Disponíveis para Teste

Use estes RAs para cadastrar alunos (estão no CSV):

- 12345 - João Silva Santos
- 23456 - Maria Oliveira Costa
- 34567 - Pedro Henrique Lima
- 45678 - Ana Carolina Souza
- 56789 - Lucas Rodrigues Alves
- 67890 - Beatriz Fernandes
- 78901 - Carlos Eduardo Pereira
- 89012 - Juliana Santos Rocha
- 90123 - Rafael Martins Silva
- 01234 - Fernanda Costa Lima

---

## 🎯 Formato dos QR Codes

```
TIPO-ID-HASH

Tipos:
- ALU: Aluno
- VIS: Visitante
- COM: Comunidade

Exemplos:
- ALU-12345-A3F8K2
- VIS-VIS1000-B7G4J1
- COM-COM2000-C9H2K5
```

---

## 📊 Dados Armazenados

### usuarios.csv:
```csv
id,tipo,ra,nome,telefone,email,sexo,data_nascimento,idade,curso,qr_code,interesses,data_cadastro,ativo
12345,aluno,12345,João Silva Santos,11987654321,joao.silva@mackenzie.br,M,2000-05-15,24,Ciência da Computação,ALU-12345-A3F8K2,cartas|tabuleiro,2025-10-26T10:00:00.000Z,true
```

### entradas.csv:
```csv
id,usuario_id,usuario_tipo,usuario_nome,qr_code,data_hora,dia_semana,periodo
1,12345,aluno,João Silva Santos,ALU-12345-A3F8K2,2025-10-26T10:30:00.000Z,Sábado,Manhã
```

---

## ✅ Funcionalidades Implementadas

✅ Cadastro de alunos com busca no TOTVS (CSV)  
✅ Cadastro de visitantes/comunidade  
✅ Geração de QR Codes únicos  
✅ Check-in via QR Code  
✅ Registro de entradas com timestamp  
✅ Estatísticas em tempo real  
✅ Relatórios demográficos  
✅ Relatórios de interesses  
✅ Análise por período, dia da semana, horário  
✅ Top visitantes  
✅ Sistema de salas de jogo  

---

## 🔒 Validações

- ✅ RA deve existir no TOTVS (CSV)
- ✅ QR Code deve ser válido
- ✅ Não permite duplicar cadastro
- ✅ Formato de dados validado
- ✅ Todos os campos obrigatórios verificados

---

**Sistema 100% testável localmente sem dependências externas!** 🎉

