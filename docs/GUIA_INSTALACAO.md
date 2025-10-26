# 🚀 Guia de Instalação - Savepoint Ludoteca

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v14 ou superior) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- **NPM** (vem com o Node.js)

## 🗄️ Passo 1: Configurar o Banco de Dados

### 1.1 Instalar MySQL

Se ainda não tiver o MySQL instalado, baixe e instale a partir do site oficial.

### 1.2 Criar o Banco de Dados

Abra o MySQL Workbench ou linha de comando do MySQL e execute:

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS ludoteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar o banco
USE ludoteca;
```

### 1.3 Importar o Schema

Execute o script SQL localizado em `backend/config/init-database.sql`:

**Opção 1: MySQL Workbench**
- Abra o arquivo `backend/config/init-database.sql`
- Execute todo o script

**Opção 2: Linha de comando**
```bash
mysql -u root -p ludoteca < backend/config/init-database.sql
```

## ⚙️ Passo 2: Configurar o Backend

### 2.1 Navegar até a pasta do backend

```bash
cd backend
```

### 2.2 Configurar variáveis de ambiente

Edite o arquivo `.env` com suas credenciais do MySQL:

```env
# Configuração do Servidor
PORT=3000

# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=ludoteca
DB_PORT=3306

# API TOTVS (deixe vazio por enquanto)
TOTVS_API_URL=https://api.totvs.com.br
TOTVS_API_KEY=
```

**⚠️ IMPORTANTE:** Substitua `sua_senha_mysql` pela senha real do seu MySQL!

### 2.3 As dependências já foram instaladas!

As dependências do Node.js já foram instaladas. Você pode verificar com:

```bash
npm list --depth=0
```

## 🎯 Passo 3: Executar a Aplicação

### 3.1 Iniciar o servidor backend

Na pasta `backend`, execute:

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

Você deverá ver:

```
╔═══════════════════════════════════════════╗
║  🎮 Savepoint Ludoteca - Backend API     ║
║  🚀 Servidor rodando na porta 3000       ║
║  📡 http://localhost:3000                ║
╚═══════════════════════════════════════════╝
```

### 3.2 Testar a API

Abra o navegador e acesse:
- **Health Check:** http://localhost:3000/api/health

Ou use o Postman/Insomnia para testar os endpoints.

### 3.3 Acessar o Frontend

Abra o navegador e acesse:
- **Cadastro:** http://localhost:3000/cadastro.html

## 🧪 Testando o Sistema

### Cadastro de Aluno

1. Acesse http://localhost:3000/cadastro.html
2. Clique em "Sim, sou Aluno"
3. Digite qualquer RA que comece com números (ex: 12345678)
4. Clique em "Validar e Continuar"

### Cadastro de Visitante

1. Acesse http://localhost:3000/cadastro.html
2. Clique em "Não, sou Visitante"
3. Preencha:
   - Nome: Seu nome completo
   - Telefone: Seu telefone
   - Senha: Mínimo 6 caracteres
4. Clique em "Cadastrar"

## 📁 Estrutura do Projeto

```
manhattam/
├── backend/
│   ├── config/
│   │   ├── database.js          # Configuração MySQL
│   │   └── init-database.sql    # Script do banco
│   ├── controllers/
│   │   └── cadastroController.js
│   ├── models/
│   │   ├── Aluno.js
│   │   └── Visitante.js
│   ├── routes/
│   │   └── cadastro.js
│   ├── .env                     # Suas configurações
│   ├── .env.example             # Exemplo
│   ├── package.json
│   ├── server.js                # Servidor principal
│   └── README.md
├── frontend/
│   ├── cadastro.html            # Escolha: Aluno ou Visitante
│   ├── cadastro-aluno.html      # Formulário de aluno
│   ├── cadastro-visitante.html  # Formulário de visitante
│   └── login.html               # (existente)
└── GUIA_INSTALACAO.md          # Este arquivo
```

## 🐛 Solução de Problemas

### Erro de conexão com MySQL

**Erro:** `Error: Access denied for user 'root'@'localhost'`

**Solução:** Verifique se a senha no arquivo `.env` está correta.

### Erro: ECONNREFUSED

**Erro:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solução:** Certifique-se de que o MySQL está rodando:
```bash
# Windows
net start MySQL80

# Mac/Linux
sudo systemctl start mysql
```

### Erro: Cannot find module

**Solução:** Reinstale as dependências:
```bash
cd backend
npm install
```

### Porta 3000 já está em uso

**Solução:** Altere a porta no arquivo `.env`:
```env
PORT=3001
```

## 📊 Verificando os Dados

Para ver os dados cadastrados no banco:

```sql
USE ludoteca;

-- Ver alunos cadastrados
SELECT * FROM alunos;

-- Ver visitantes cadastrados
SELECT id, nome, telefone, data_cadastro FROM visitantes;
```

## 🔒 Segurança

- ✅ Senhas são hashadas com bcrypt
- ✅ CORS habilitado
- ✅ Validação de dados
- ⚠️ Nunca commite o arquivo `.env` no Git
- ⚠️ Use senhas fortes em produção

## 📝 Próximos Passos

Agora que o sistema de cadastro está funcionando, você pode:

1. Implementar o sistema de login
2. Criar os painéis de administração
3. Adicionar funcionalidade de empréstimo de jogos
4. Integrar com a API real do TOTVS

## 💡 Dicas

- Use `npm run dev` durante o desenvolvimento (auto-reload)
- Use `npm start` para produção
- Confira os logs do console para debug
- Use ferramentas como Postman para testar a API

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs do console do backend
2. Verifique o console do navegador (F12)
3. Certifique-se de que todas as configurações estão corretas
4. Revise este guia desde o início

---

**Desenvolvido para Savepoint Ludoteca** 🎮

