# Savepoint Ludoteca - Backend (CSV Storage)

Backend da aplicação de gerenciamento da Ludoteca desenvolvido em Node.js com Express.
**Os dados são salvos em arquivos CSV para fácil visualização em planilhas.**

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- NPM ou Yarn

**Não é necessário MySQL!** Os dados são salvos em arquivos CSV.

## 🚀 Instalação

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure as variáveis de ambiente no arquivo `.env`:
```env
PORT=3000
```

## 🎯 Executar o servidor

### Modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo de produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### Cadastro

#### POST `/api/cadastro/aluno`
Cadastra um novo aluno

**Body:**
```json
{
  "ra": "12345678"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Aluno cadastrado com sucesso!",
  "aluno": {
    "id": 1,
    "ra": "12345678",
    "nome": "Aluno 12345678"
  }
}
```

#### POST `/api/cadastro/visitante`
Cadastra um novo visitante

**Body:**
```json
{
  "nome": "João da Silva",
  "telefone": "(11) 98765-4321",
  "senha": "senha123"
}
```

**Resposta de sucesso (201):**
```json
{
  "message": "Visitante cadastrado com sucesso!",
  "visitante": {
    "id": 1,
    "nome": "João da Silva"
  }
}
```

### Health Check

#### GET `/api/health`
Verifica o status do servidor

**Resposta:**
```json
{
  "status": "OK",
  "message": "Servidor rodando normalmente",
  "storage": "CSV Files",
  "timestamp": "2025-10-26T03:00:00.000Z"
}
```

## 📊 Arquivos CSV

Os dados são salvos em arquivos CSV na pasta `backend/data/`:

### `data/alunos.csv`
```csv
id,ra,nome,email,curso,data_cadastro,ativo
1,12345,Aluno 12345,aluno12345@mackenzie.br,Curso de Teste,2025-10-26T03:00:00.000Z,true
2,67890,Aluno 67890,aluno67890@mackenzie.br,Curso de Teste,2025-10-26T03:01:00.000Z,true
```

### `data/visitantes.csv`
```csv
id,nome,telefone,senha_hash,data_cadastro,ativo
1,João Silva,(11) 98765-4321,$2b$10$hash...,2025-10-26T03:00:00.000Z,true
2,Maria Santos,(11) 91234-5678,$2b$10$hash...,2025-10-26T03:01:00.000Z,true
```

**📝 Você pode abrir esses arquivos no Excel, Google Sheets ou qualquer editor de planilhas!**

## 🗂️ Estrutura do Projeto

```
backend/
├── config/                  # (removido - não é mais necessário)
├── controllers/
│   └── cadastroController.js # Lógica de cadastro (simplificada)
├── models/
│   ├── Aluno.js             # Model de Aluno (CSV)
│   └── Visitante.js         # Model de Visitante (CSV)
├── routes/
│   └── cadastro.js          # Rotas de cadastro
├── data/                    # Arquivos CSV (criados automaticamente)
│   ├── alunos.csv
│   └── visitantes.csv
├── .env                     # Configurações (opcional)
├── .gitignore
├── package.json
└── server.js                # Arquivo principal
```

## 🔧 Tecnologias Utilizadas

- **Express**: Framework web
- **bcrypt**: Hash de senhas
- **CORS**: Controle de acesso
- **dotenv**: Variáveis de ambiente
- **body-parser**: Parse de requisições
- **Node.js fs/promises**: Leitura/escrita de arquivos CSV

## 📝 Notas

- **Sem integração TOTVS**: Versão simplificada para testes
- **Sem banco de dados**: Dados salvos em CSV para fácil acesso
- As senhas são hashadas com bcrypt antes de serem armazenadas
- Os arquivos CSV são criados automaticamente na primeira execução
- Use soft delete (campo `ativo`)

## 🔒 Segurança

- Senhas hashadas com bcrypt
- Nunca commite arquivos `.csv` com dados reais
- Os arquivos CSV são ignorados pelo git (`.gitignore`)

## 📖 Como visualizar os dados

### Opção 1: Excel / LibreOffice Calc
1. Abra o Excel
2. Arquivo → Abrir
3. Navegue até `backend/data/`
4. Abra `alunos.csv` ou `visitantes.csv`

### Opção 2: Google Sheets
1. Acesse Google Sheets
2. Arquivo → Importar
3. Faça upload do arquivo CSV

### Opção 3: Editor de texto
Qualquer editor de texto pode abrir os arquivos CSV!

## 🆘 Solução de Problemas

### Erro: Cannot find module
**Solução:** Reinstale as dependências:
```bash
npm install
```

### Erro: Port 3000 already in use
**Solução:** Altere a porta no arquivo `.env`:
```env
PORT=3001
```

### Arquivos CSV não são criados
**Solução:** Verifique permissões da pasta `data/`. O servidor cria automaticamente.

---

**Desenvolvido para Savepoint Ludoteca** 🎮
**Versão: CSV Storage (Teste)**
