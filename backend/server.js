const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static('../frontend'));

// Rotas
const cadastroRoutes = require('./routes/cadastro');
app.use('/api/cadastro', cadastroRoutes);

const salaRoutes = require('./routes/sala');
app.use('/api/sala', salaRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor rodando normalmente',
    storage: 'CSV Files',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🎮 Savepoint Ludoteca - Backend API     ║
║  🚀 Servidor rodando na porta ${PORT}       ║
║  📡 http://localhost:${PORT}                ║
║  💾 Dados salvos em CSV                   ║
╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
