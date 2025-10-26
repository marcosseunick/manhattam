# 🎮 Como Testar o Sistema - Savepoint Ludoteca

## 🚀 Início Rápido

### 1️⃣ Iniciar o Servidor

```bash
cd backend
npm start
```

### 2️⃣ Testar Sistema de Cadastro

**Acesse:** `http://localhost:3000/cadastro.html`

#### Cadastrar Aluno:
1. Clique em "Sim, sou Aluno"
2. Digite um RA (ex: 12345)
3. Clique em "Validar e Continuar"
✅ Salvo em: `backend/data/alunos.csv`

#### Cadastrar Visitante:
1. Clique em "Não, sou Visitante"
2. Preencha nome, telefone e senha
3. Clique em "Cadastrar"
✅ Salvo em: `backend/data/visitantes.csv`

---

### 3️⃣ Testar Painel de Usuário

**Acesse:** `http://localhost:3000/painel_usuario.html`

#### Criar Sala:
1. Clique em "Criar Nova Sala de Jogo"
2. Digite o nome do jogo (ex: "Catan")
3. Digite o número máximo de jogadores (ex: 4)
4. Clique OK
✅ Sala criada e aparece na lista!

#### Entrar na Sala:
1. Veja a sala criada na lista "Minhas Salas"
2. Clique no botão "🎮 Entrar na Sala"
✅ Contador de jogadores aumenta!

#### Ver Dados Salvos:
Abra no Excel/Google Sheets:
- `backend/data/salas.csv`

---

## 📊 Visualizar os Dados CSV

### No Excel:
1. Abra o Excel
2. Arquivo → Abrir
3. Navegue até `backend/data/`
4. Abra os arquivos `.csv`

### No Google Sheets:
1. Acesse sheets.google.com
2. Arquivo → Importar
3. Fazer upload dos arquivos `.csv`

---

## 🧪 Testar API com Postman/Insomnia

### Criar Sala
```
POST http://localhost:3000/api/sala/criar
Content-Type: application/json

{
  "criador_id": "1",
  "criador_tipo": "aluno",
  "jogo": "Catan",
  "max_jogadores": 4
}
```

### Listar Minhas Salas
```
GET http://localhost:3000/api/sala/minhas/aluno/1
```

### Entrar na Sala
```
POST http://localhost:3000/api/sala/entrar/A3F8K2
```
(Substitua A3F8K2 pelo ID da sua sala)

### Salas Disponíveis
```
GET http://localhost:3000/api/sala/disponiveis
```

---

## 📁 Arquivos CSV Gerados

Após testar, você terá:

```
backend/data/
├── alunos.csv       # Alunos cadastrados
├── visitantes.csv   # Visitantes cadastrados
└── salas.csv        # Salas de jogo criadas
```

---

## ✅ Checklist de Testes

### Cadastro:
- [ ] Cadastrar aluno
- [ ] Cadastrar visitante
- [ ] Ver dados no CSV

### Painel de Usuário:
- [ ] Criar sala
- [ ] Ver sala na lista
- [ ] Entrar na sala
- [ ] Ver contador de jogadores aumentar
- [ ] Ver status mudar quando sala encher

### API:
- [ ] Criar sala via API
- [ ] Listar salas via API
- [ ] Entrar em sala via API

---

## 🆘 Problemas Comuns

### ❌ Servidor não inicia
**Solução:** Certifique-se de estar na pasta `backend`:
```bash
cd backend
npm start
```

### ❌ Erro ao carregar salas
**Solução:** Verifique se o servidor está rodando

### ❌ Arquivos CSV não aparecem
**Solução:** Faça um cadastro/crie uma sala primeiro. Os arquivos são criados automaticamente.

---

## 🎯 O Que Foi Implementado

✅ Sistema de cadastro (alunos e visitantes) em CSV  
✅ Sistema de salas de jogo em CSV  
✅ Painel de usuário com interface completa  
✅ API RESTful completa  
✅ Auto-atualização da lista de salas  
✅ Feedback visual de status  

---

**Tudo funcionando! Divirta-se testando! 🎉**

