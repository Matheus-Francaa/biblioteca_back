const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    autor: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
    },
    editora: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    anoPublicacao: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    categoria: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    quantidadeTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    quantidadeDisponivel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    localizacao: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Localização física do livro na biblioteca (ex: Estante A, Prateleira 3)'
    }
}, {
    tableName: 'livros',
    timestamps: true
});

module.exports = Book;
