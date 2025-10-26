# 🧪 Teste Rápido - Sistema de Cadastro CSV

## ✅ Mudanças Implementadas

### O que foi alterado:
- ✅ **Removido MySQL** - Não precisa mais de banco de dados
- ✅ **Removida integração TOTVS** - Sistema simplificado para testes
- ✅ **Implementado armazenamento CSV** - Dados salvos em arquivos CSV
- ✅ **Criado diretório data/** - Onde os CSVs serão salvos
- ✅ **Atualizado package.json** - Removida dependência mysql2

### Arquivos modificados:
1. `backend/models/Aluno.js` - Agora usa CSV
2. `backend/models/Visitante.js` - Agora usa CSV
3. `backend/controllers/cadastroController.js` - Simplificado (sem TOTVS)
4. `backend/server.js` - Removida referência ao MySQL
5. `backend/package.json` - Removida dependência mysql2
6. `backend/.gitignore` - Adicionado data/*.csv

### Arquivos removidos:
- ❌ `backend/config/database.js` (não mais necessário)
- ❌ `backend/config/init-database.sql` (não mais necessário)

### Estrutura criada:
- ✅ `backend/data/` (diretório criado)
- Os arquivos CSV serão criados automaticamente quando você cadastrar o primeiro registro

---

## 🚀 Como Testar

### Passo 1: Iniciar o servidor

Abra um terminal na pasta `backend` e execute:

```bash
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

### Passo 2: Testar cadastro de aluno

1. Abra o navegador: `http://localhost:3000/cadastro.html`
2. Clique em **"Sim, sou Aluno"**
3. Digite um RA (exemplo: `123456`)
4. Clique em **"Validar e Continuar"**

✅ **Resultado esperado:**
- Mensagem de sucesso em verde
- Arquivo criado: `backend/data/alunos.csv`

### Passo 3: Testar cadastro de visitante

1. Volte para: `http://localhost:3000/cadastro.html`
2. Clique em **"Não, sou Visitante"**
3. Preencha:
   - Nome: `João da Silva`
   - Telefone: `(11) 98765-4321`
   - Senha: `senha123`
4. Clique em **"Cadastrar"**

✅ **Resultado esperado:**
- Mensagem de sucesso em verde
- Arquivo criado: `backend/data/visitantes.csv`

### Passo 4: Verificar os dados salvos

Abra os arquivos CSV com Excel, Google Sheets ou Bloco de Notas:

**`backend/data/alunos.csv`:**
```csv
id,ra,nome,email,curso,data_cadastro,ativo
1,123456,Aluno 123456,aluno123456@mackenzie.br,Curso de Teste,2025-10-26T06:00:00.000Z,true
```

**`backend/data/visitantes.csv`:**
```csv
id,nome,telefone,senha_hash,data_cadastro,ativo
1,João da Silva,(11) 98765-4321,$2b$10$...,2025-10-26T06:00:00.000Z,true
```

---

## 🧪 Testes da API com Postman/Insomnia

### Cadastrar Aluno

**POST** `http://localhost:3000/api/cadastro/aluno`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "ra": "654321"
}
```

**Resposta esperada:**
```json
{
  "message": "Aluno cadastrado com sucesso!",
  "aluno": {
    "id": 2,
    "ra": "654321",
    "nome": "Aluno 654321"
  }
}
```

### Cadastrar Visitante

**POST** `http://localhost:3000/api/cadastro/visitante`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Maria Santos",
  "telefone": "(11) 91234-5678",
  "senha": "minhasenha"
}
```

**Resposta esperada:**
```json
{
  "message": "Visitante cadastrado com sucesso!",
  "visitante": {
    "id": 2,
    "nome": "Maria Santos"
  }
}
```

---

## 📊 Visualizando os Dados

### No Excel:
1. Abra o Excel
2. Arquivo → Abrir
3. Navegue até `backend/data/`
4. Abra `alunos.csv` ou `visitantes.csv`
5. Dados serão exibidos em colunas organizadas!

### No Google Sheets:
1. Acesse sheets.google.com
2. Arquivo → Importar
3. Fazer upload → Selecione o CSV
4. Pronto!

### No Bloco de Notas:
Abra os arquivos diretamente para ver o formato CSV bruto.

---

## ✨ Vantagens desta Abordagem

✅ **Sem configuração de banco de dados**
✅ **Dados em formato legível e portável**
✅ **Fácil backup** (basta copiar os arquivos CSV)
✅ **Ideal para testes e prototipagem**
✅ **Pode ser aberto em qualquer planilha**
✅ **Sem dependências externas** (MySQL, etc)

---

## 🎯 Próximos Passos

Depois de testar com CSV, você pode:

1. **Migrar para MySQL** - Quando estiver pronto para produção
2. **Adicionar integração TOTVS** - Para validação real de alunos
3. **Implementar sistema de login** - Usando os dados do CSV
4. **Criar painéis administrativos** - Para gerenciar os cadastros

---

## ❓ Perguntas Frequentes

**Q: Os arquivos CSV são seguros?**
A: Para testes sim! As senhas são hashadas com bcrypt. Para produção, use um banco de dados.

**Q: Posso editar os CSV manualmente?**
A: Sim! Mas tenha cuidado com o formato e não remova o cabeçalho.

**Q: Quantos registros suporta?**
A: Para testes, alguns milhares. Para produção com muitos usuários, migre para MySQL.

**Q: Como faço backup?**
A: Copie a pasta `backend/data/` para outro lugar!

---

**Tudo pronto para testar!** 🎮
**Qualquer problema, verifique os logs do servidor no terminal.**

