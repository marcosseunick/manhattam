# 🚀 Início Rápido - Savepoint Ludoteca (CSV)

## ⚡ Como Executar o Projeto em 2 Passos

### 1️⃣ Instalar Dependências (se ainda não instalou)

```bash
cd backend
npm install
```

### 2️⃣ Iniciar o Servidor

```bash
npm start
```

Pronto! Acesse: **http://localhost:3000/frontend/lgpd.html**

---

## 📱 Testando o Sistema

### Cadastro de Aluno
1. Acesse http://localhost:3000/frontend/lgpd.html
2. Aceite os termos e condições
3. Clique em "Aceitar e Continuar"
4. Clique em **"Sim, sou Aluno"**
5. Digite qualquer RA (ex: 12345)
6. Clique em **"Validar e Continuar"**

✅ O aluno será salvo em `backend/data/alunos.csv`

### Cadastro de Visitante
1. Acesse http://localhost:3000/frontend/lgpd.html
2. Aceite os termos e condições
3. Clique em "Aceitar e Continuar"
4. Clique em **"Não, sou Visitante"**
5. Preencha o formulário:
   - Nome: Seu nome completo
   - Telefone: (11) 98765-4321
   - Senha: mínimo 6 caracteres
6. Clique em **"Cadastrar"**

✅ O visitante será salvo em `backend/data/visitantes.csv`

---

## 📊 Visualizando os Dados

### No Excel/Google Sheets
1. Abra o Excel ou Google Sheets
2. Importe os arquivos:
   - `backend/data/alunos.csv`
   - `backend/data/visitantes.csv`

### No Bloco de Notas
Abra os arquivos CSV em qualquer editor de texto!

**Formato do alunos.csv:**
```csv
id,ra,nome,email,curso,data_cadastro,ativo
1,12345,Aluno 12345,aluno12345@mackenzie.br,Curso de Teste,2025-10-26T03:00:00.000Z,true
```

**Formato do visitantes.csv:**
```csv
id,nome,telefone,senha_hash,data_cadastro,ativo
1,João Silva,(11) 98765-4321,$2b$10$hash...,2025-10-26T03:00:00.000Z,true
```

---

## 🔧 Comandos Úteis

### Iniciar servidor (modo produção)
```bash
cd backend
npm start
```

### Iniciar servidor (modo desenvolvimento - auto-reload)
```bash
cd backend
npm run dev
```

### Verificar se o servidor está funcionando
Abra no navegador: http://localhost:3000/api/health

---

## 📂 Estrutura do Projeto

```
manhattam/
├── backend/              # Servidor Node.js
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Modelos (CSV)
│   ├── routes/          # Rotas da API
│   ├── data/            # Arquivos CSV (criados automaticamente)
│   │   ├── alunos.csv
│   │   └── visitantes.csv
│   └── server.js        # Arquivo principal
│
└── frontend/            # Páginas HTML
    ├── lgpd.html               # Aceitar termos (página inicial)
    ├── cadastro.html           # Escolha: Aluno ou Visitante
    ├── cadastro-aluno.html     # Form aluno
    └── cadastro-visitante.html # Form visitante
```

---

## ✨ Vantagens do CSV

✅ **Não precisa de MySQL** - Mais simples para testar
✅ **Fácil visualização** - Abra no Excel ou Google Sheets
✅ **Portável** - Copie os arquivos para qualquer lugar
✅ **Legível** - Abra em qualquer editor de texto

---

## 🆘 Problemas Comuns

### ❌ Erro: Port 3000 already in use
**Solução:** Mude a porta criando um arquivo `.env`:
```env
PORT=3001
```

### ❌ Erro: Cannot find module
**Solução:** Instale as dependências:
```bash
cd backend
npm install
```

### ❌ Arquivos CSV não aparecem
**Solução:** Faça um cadastro primeiro! Os arquivos são criados automaticamente.

---

## 📖 Documentação Completa

Para mais detalhes, veja o arquivo `backend/README.md`

---

**Sistema simplificado para testes** 🎮
**Sem MySQL | Sem TOTVS | Apenas CSV** 📊
