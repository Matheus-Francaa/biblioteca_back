const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'API do Sistema de Biblioteca',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            books: '/api/books',
            loans: '/api/loans'
        }
    });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

// Rota 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada.'
    });
});

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Algo deu errado!'
    });
});

// Inicializar servidor
const startServer = async () => {
    try {
        await testConnection();
        await syncDatabase();

        app.listen(PORT, () => {
            console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📚 Acesse: http://localhost:${PORT}`);
            console.log(`\nEndpoints disponíveis:`);
            console.log(`  - POST   /api/auth/register`);
            console.log(`  - POST   /api/auth/login`);
            console.log(`  - GET    /api/auth/profile`);
            console.log(`  - GET    /api/books`);
            console.log(`  - GET    /api/books/:id`);
            console.log(`  - POST   /api/books (bibliotecário)`);
            console.log(`  - PUT    /api/books/:id (bibliotecário)`);
            console.log(`  - DELETE /api/books/:id (bibliotecário)`);
            console.log(`  - POST   /api/loans/request (leitor)`);
            console.log(`  - GET    /api/loans/my-loans`);
            console.log(`  - PUT    /api/loans/:id/return (leitor)`);
            console.log(`  - GET    /api/loans (bibliotecário)`);
            console.log(`  - PUT    /api/loans/:id/approve (bibliotecário)`);
            console.log(`  - PUT    /api/loans/:id/reject (bibliotecário)`);
            console.log(`  - PUT    /api/loans/:id/approve-return (bibliotecário)\n`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
