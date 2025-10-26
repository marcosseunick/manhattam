# 📡 API de Salas - Backend

## ✅ Sistema com Lista de Jogadores

Ao criar uma sala, você informa **os nomes de todos os jogadores** que vão participar.

---

## 🚀 Como Iniciar

```bash
cd backend
npm start
```

---

## 📡 Endpoints da API

### 1. **POST** `/api/sala/criar`
Cria uma nova sala informando os jogadores

**Request Body:**
```json
{
  "criador_id": "1",
  "criador_tipo": "aluno",
  "criador_nome": "João Silva",
  "jogo": "Catan",
  "jogadores": [
    "João Silva",
    "Maria Santos",
    "Pedro Costa",
    "Ana Lima"
  ]
}
```

**Response (201):**
```json
{
  "message": "Sala criada com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "criador_id": "1",
    "criador_tipo": "aluno",
    "criador_nome": "João Silva",
    "nome": "",
    "jogo": "Catan",
    "jogadores": [
      "João Silva",
      "Maria Santos",
      "Pedro Costa",
      "Ana Lima"
    ],
    "status": "aguardando",
    "data_criacao": "2025-10-26T07:00:00.000Z"
  }
}
```

**Validações:**
- ✅ `criador_nome` obrigatório
- ✅ `jogadores` deve ser array com pelo menos 1 nome
- ✅ Nomes vazios são removidos automaticamente

---

### 2. **GET** `/api/sala/minhas/:userType/:userId`
Lista salas criadas pelo usuário

**Exemplo:**
```
GET /api/sala/minhas/aluno/1
```

**Response (200):**
```json
{
  "salas": [
    {
      "id": "A3F8K2",
      "criador_nome": "João Silva",
      "jogo": "Catan",
      "jogadores": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"],
      "status": "aguardando"
    }
  ],
  "total": 1
}
```

---

### 3. **GET** `/api/sala/disponiveis`
Lista salas disponíveis (status: aguardando)

**Response (200):**
```json
{
  "salas": [
    {
      "id": "A3F8K2",
      "criador_nome": "João Silva",
      "jogo": "Catan",
      "jogadores": ["João Silva", "Maria Santos"],
      "status": "aguardando"
    }
  ],
  "total": 1
}
```

---

### 4. **POST** `/api/sala/adicionar/:salaId`
Adiciona um jogador à sala (opcional)

**Request Body:**
```json
{
  "nome_jogador": "Carlos Silva"
}
```

**Response (200):**
```json
{
  "message": "Jogador adicionado com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "jogadores": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima", "Carlos Silva"]
  }
}
```

---

### 5. **POST** `/api/sala/remover/:salaId`
Remove um jogador da sala

**Request Body:**
```json
{
  "nome_jogador": "Carlos Silva"
}
```

**Response (200):**
```json
{
  "message": "Jogador removido com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "jogadores": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"]
  }
}
```

---

### 6. **POST** `/api/sala/iniciar/:salaId`
Inicia o jogo (muda status para "em_andamento")

**Response (200):**
```json
{
  "message": "Sala iniciada com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "status": "em_andamento",
    "data_inicio": "2025-10-26T08:00:00.000Z"
  }
}
```

---

### 7. **GET** `/api/sala/:salaId`
Obtém detalhes da sala

**Response (200):**
```json
{
  "sala": {
    "id": "A3F8K2",
    "criador_nome": "João Silva",
    "jogo": "Catan",
    "jogadores": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"],
    "status": "aguardando"
  }
}
```

---

### 8. **PUT** `/api/sala/finalizar/:salaId`
Finaliza a sala

**Response (200):**
```json
{
  "message": "Sala finalizada com sucesso!"
}
```

---

## 📊 Armazenamento CSV

### Arquivo: `backend/data/salas.csv`

```csv
id,criador_id,criador_tipo,criador_nome,nome,jogo,jogadores,status,data_criacao,data_inicio,data_fim
A3F8K2,1,aluno,João Silva,,Catan,João Silva|Maria Santos|Pedro Costa|Ana Lima,aguardando,2025-10-26T07:00:00.000Z,,
B7G4J1,2,visitante,Pedro Costa,,Pandemic,Pedro Costa|Ana Lima|Carlos Silva,em_andamento,2025-10-26T07:05:00.000Z,2025-10-26T07:10:00.000Z,
```

**Colunas:**
- `id` - ID único
- `criador_id` - ID do criador
- `criador_tipo` - 'aluno' ou 'visitante'
- `criador_nome` - Nome do criador
- `nome` - Nome da sala (opcional)
- `jogo` - Nome do jogo
- `jogadores` - **Lista de nomes separados por |**
- `status` - aguardando | em_andamento | finalizada
- `data_criacao`, `data_inicio`, `data_fim`

---

## 🔄 Fluxo

```
1. Criar Sala
   → Informar jogadores: ["João", "Maria", "Pedro", "Ana"]
   → Sala criada com todos os jogadores
   → status: "aguardando"

2. (Opcional) Adicionar/Remover Jogadores
   → POST /adicionar ou /remover

3. Iniciar Jogo
   → POST /iniciar/:salaId
   → status: "em_andamento"

4. Finalizar
   → PUT /finalizar/:salaId
   → status: "finalizada"
```

---

## 🧪 Exemplos

### Criar Sala com 4 Jogadores:
```bash
curl -X POST http://localhost:3000/api/sala/criar \
  -H "Content-Type: application/json" \
  -d '{
    "criador_id": "1",
    "criador_tipo": "aluno",
    "criador_nome": "João Silva",
    "jogo": "Catan",
    "jogadores": ["João Silva", "Maria Santos", "Pedro Costa", "Ana Lima"]
  }'
```

### Adicionar Jogador:
```bash
curl -X POST http://localhost:3000/api/sala/adicionar/A3F8K2 \
  -H "Content-Type: application/json" \
  -d '{"nome_jogador": "Carlos Silva"}'
```

### Iniciar Sala:
```bash
curl -X POST http://localhost:3000/api/sala/iniciar/A3F8K2
```

---

## ✅ Mudanças

### ❌ Antes:
- Criar sala → Definir `max_jogadores: 4`
- Jogadores entram depois um por um

### ✅ Agora:
- Criar sala → Informar todos os jogadores: `["João", "Maria", "Pedro", "Ana"]`
- Sala já é criada com todos os participantes
- Pode adicionar/remover depois se necessário

---

## 📝 Endpoints Disponíveis

```
POST   /api/sala/criar              ← jogadores[] obrigatório
GET    /api/sala/minhas/:type/:id
GET    /api/sala/disponiveis
POST   /api/sala/adicionar/:salaId  
POST   /api/sala/remover/:salaId    
POST   /api/sala/iniciar/:salaId    
GET    /api/sala/:salaId
PUT    /api/sala/finalizar/:salaId
```

---

**Sistema atualizado! 🎉**
