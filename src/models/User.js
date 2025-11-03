const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('bibliotecario', 'leitor'),
        allowNull: false,
        defaultValue: 'leitor'
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    endereco: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.senha) {
                const salt = await bcrypt.genSalt(10);
                user.senha = await bcrypt.hash(user.senha, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('senha')) {
                const salt = await bcrypt.genSalt(10);
                user.senha = await bcrypt.hash(user.senha, salt);
            }
        }
    }
});

User.prototype.validarSenha = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

module.exports = User;
