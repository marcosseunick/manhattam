# 🎮 Painel de Usuário - Sistema de Salas

## ✅ Implementação Completa

O sistema de salas para o painel de usuário foi implementado com sucesso!

### 📁 Arquivos Criados

#### Backend:
1. **`backend/models/Sala.js`** - Model para gerenciar salas (CSV)
2. **`backend/controllers/salaController.js`** - Lógica de negócio das salas
3. **`backend/routes/sala.js`** - Rotas da API de salas
4. **`backend/server.js`** - Atualizado com rotas de sala

#### Frontend:
5. **`frontend/painel_usuario.html`** - Atualizado com integração completa

---

## 🚀 Como Testar

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

### 2. Acessar o Painel

Abra no navegador:
```
http://localhost:3000/painel_usuario.html
```

### 3. Testar Funcionalidades

#### ✅ Criar Nova Sala
1. Clique em **"Criar Nova Sala de Jogo"**
2. Digite o nome do jogo (ex: "Catan") ou deixe em branco
3. Digite o número máximo de jogadores (padrão: 4)
4. Clique OK
5. ✅ Sala criada com ID único (ex: A3F8K2)

#### ✅ Ver Minhas Salas
- A lista é carregada automaticamente
- Mostra: ID da sala, jogo, jogadores, status, data de criação
- Auto-atualiza a cada 10 segundos

#### ✅ Entrar na Sala
1. Clique no botão **"🎮 Entrar na Sala"**
2. Contador de jogadores aumenta
3. Quando a sala enche, status muda para "Em andamento"
4. Botão fica desabilitado

---

## 📡 Endpoints da API

### POST `/api/sala/criar`
Cria uma nova sala de jogo

**Body:**
```json
{
  "criador_id": "1",
  "criador_tipo": "aluno",
  "jogo": "Catan",
  "max_jogadores": 4
}
```

**Resposta:**
```json
{
  "message": "Sala criada com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "criador_id": "1",
    "criador_tipo": "aluno",
    "jogo": "Catan",
    "max_jogadores": 4,
    "jogadores_atual": 0,
    "status": "aguardando",
    "data_criacao": "2025-10-26T07:00:00.000Z"
  }
}
```

### GET `/api/sala/minhas/:userType/:userId`
Lista todas as salas criadas pelo usuário

**Exemplo:**
```
GET /api/sala/minhas/aluno/1
```

**Resposta:**
```json
{
  "salas": [
    {
      "id": "A3F8K2",
      "criador_id": "1",
      "criador_tipo": "aluno",
      "jogo": "Catan",
      "max_jogadores": 4,
      "jogadores_atual": 2,
      "status": "aguardando",
      "data_criacao": "2025-10-26T07:00:00.000Z"
    }
  ],
  "total": 1
}
```

### GET `/api/sala/disponiveis`
Lista todas as salas disponíveis para entrar

**Resposta:**
```json
{
  "salas": [
    {
      "id": "A3F8K2",
      "jogo": "Catan",
      "jogadores_atual": 2,
      "max_jogadores": 4,
      "status": "aguardando"
    }
  ],
  "total": 1
}
```

### POST `/api/sala/entrar/:salaId`
Entra em uma sala existente

**Exemplo:**
```
POST /api/sala/entrar/A3F8K2
```

**Resposta:**
```json
{
  "message": "Entrou na sala com sucesso!",
  "sala": {
    "id": "A3F8K2",
    "jogadores_atual": 3,
    "max_jogadores": 4,
    "status": "aguardando"
  }
}
```

### GET `/api/sala/:salaId`
Obtém detalhes de uma sala específica

**Exemplo:**
```
GET /api/sala/A3F8K2
```

### PUT `/api/sala/finalizar/:salaId`
Finaliza uma sala (muda status para 'finalizada')

**Exemplo:**
```
PUT /api/sala/finalizar/A3F8K2
```

---

## 📊 Arquivo CSV Gerado

### `backend/data/salas.csv`

```csv
id,criador_id,criador_tipo,nome,jogo,max_jogadores,jogadores_atual,status,data_criacao,data_inicio,data_fim
A3F8K2,1,aluno,,Catan,4,2,aguardando,2025-10-26T07:00:00.000Z,,
B7G4J1,1,aluno,,Pandemic,3,3,em_andamento,2025-10-26T07:05:00.000Z,2025-10-26T07:10:00.000Z,
C9H2K5,2,visitante,,Ticket to Ride,4,0,aguardando,2025-10-26T07:15:00.000Z,,
```

**Campos:**
- `id` - ID único da sala (6 caracteres)
- `criador_id` - ID do usuário que criou
- `criador_tipo` - Tipo: 'aluno' ou 'visitante'
- `nome` - Nome da sala (opcional)
- `jogo` - Nome do jogo
- `max_jogadores` - Máximo de jogadores
- `jogadores_atual` - Quantidade atual de jogadores
- `status` - aguardando | em_andamento | finalizada
- `data_criacao` - Quando foi criada
- `data_inicio` - Quando começou (quando encheu)
- `data_fim` - Quando terminou

---

## 🎯 Fluxo do Sistema

### 1. Criar Sala
```
Usuário → Clica "Criar Sala" 
       → Informa jogo e max. jogadores
       → POST /api/sala/criar
       → Sala criada com status "aguardando"
       → Aparece na lista "Minhas Salas"
```

### 2. Entrar na Sala
```
Usuário → Vê sala na lista
       → Clica "Entrar na Sala"
       → POST /api/sala/entrar/:id
       → Contador de jogadores aumenta
       → Se encheu → Status muda para "em_andamento"
```

### 3. Estados da Sala
```
🕐 aguardando     → Esperando jogadores (botão habilitado)
🎮 em_andamento   → Sala cheia e jogo começou (botão desabilitado)
✅ finalizada     → Jogo terminou (botão desabilitado)
```

---

## 🎨 Interface do Painel

### Elementos Visuais

**Cabeçalho:**
- Nome do usuário (ex: "Olá, João Silva")
- Link para sair

**Carteirinha Digital:**
- QR Code (placeholder por enquanto)
- Conterá dados do usuário codificados

**Gestão de Salas:**
- Botão verde "Criar Nova Sala de Jogo"
- Lista de salas criadas com:
  - ID da sala
  - Nome do jogo
  - Contagem de jogadores
  - Status colorido
  - Data de criação
  - Botão "Entrar na Sala"

### Feedback Visual

- **Status Aguardando**: Laranja (⏳)
- **Status Em Andamento**: Verde (🎮)
- **Status Finalizada**: Cinza (✅)
- **Botão Habilitado**: Azul
- **Botão Desabilitado**: Cinza

---

## 🔄 Auto-Atualização

A lista de salas é atualizada automaticamente a cada 10 segundos para mostrar:
- Novos jogadores que entraram
- Mudanças de status
- Novas salas criadas

---

## 🧪 Testando com Múltiplos Usuários

Para simular múltiplos usuários:

1. **Abra múltiplas abas** do navegador
2. **Em cada aba**, edite o JavaScript para mudar o `usuarioLogado.id`:
   - Aba 1: `id: '1'`
   - Aba 2: `id: '2'`
   - Aba 3: `id: '3'`
3. **Crie uma sala** na Aba 1
4. **Entre na sala** nas outras abas
5. **Veja o contador** aumentar em todas as abas

---

## 📝 Próximos Passos Sugeridos

1. **Autenticação real** - Implementar leitura de QR Code
2. **Geração de QR Code** - Gerar QR com dados do usuário
3. **Chat da sala** - Comunicação entre jogadores
4. **Histórico de partidas** - Ver jogos anteriores
5. **Sistema de pontuação** - Registrar vencedores
6. **Notificações** - Avisar quando sala encher
7. **Filtros de salas** - Buscar por jogo específico

---

## 🐛 Troubleshooting

### Erro: "Erro ao carregar salas"
**Solução:** Verifique se o servidor está rodando na porta 3000

### Sala não aparece na lista
**Solução:** Aguarde 10 segundos (auto-refresh) ou recarregue a página

### Botão "Entrar" não funciona
**Solução:** Verifique o console do navegador (F12) para ver erros

### CSV não é criado
**Solução:** Os arquivos são criados automaticamente na primeira sala criada

---

## ✨ Funcionalidades Implementadas

✅ Criar salas de jogo  
✅ Listar minhas salas  
✅ Entrar em salas  
✅ Contador de jogadores  
✅ Mudança automática de status  
✅ Auto-atualização da lista  
✅ Feedback visual por status  
✅ Armazenamento em CSV  
✅ Interface responsiva  
✅ Validações de segurança  

---

**Tudo funcionando! 🎉**
**Bom teste! 🎮**

