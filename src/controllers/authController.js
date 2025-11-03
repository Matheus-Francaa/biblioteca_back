const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
    // Registro de novo usuário
    register: async (req, res) => {
        try {
            const { nome, email, senha, tipo, telefone, endereco } = req.body;

            // Validações
            if (!nome || !email || !senha) {
                return res.status(400).json({
                    error: 'Nome, email e senha são obrigatórios.'
                });
            }

            // Verifica se o email já existe
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({
                    error: 'Email já cadastrado.'
                });
            }

            // Cria o usuário
            const user = await User.create({
                nome,
                email,
                senha,
                tipo: tipo || 'leitor',
                telefone,
                endereco
            });

            // Remove a senha do retorno
            const userResponse = user.toJSON();
            delete userResponse.senha;

            res.status(201).json({
                message: 'Usuário cadastrado com sucesso!',
                user: userResponse
            });
        } catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({
                error: 'Erro ao cadastrar usuário.'
            });
        }
    },

    // Login
    login: async (req, res) => {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    error: 'Email e senha são obrigatórios.'
                });
            }

            // Busca o usuário
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    error: 'Credenciais inválidas.'
                });
            }

            // Verifica se o usuário está ativo
            if (!user.ativo) {
                return res.status(401).json({
                    error: 'Usuário inativo. Entre em contato com o administrador.'
                });
            }

            // Valida a senha
            const senhaValida = await user.validarSenha(senha);
            if (!senhaValida) {
                return res.status(401).json({
                    error: 'Credenciais inválidas.'
                });
            }

            // Gera o token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    tipo: user.tipo
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            // Remove a senha do retorno
            const userResponse = user.toJSON();
            delete userResponse.senha;

            res.json({
                message: 'Login realizado com sucesso!',
                token,
                user: userResponse
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                error: 'Erro ao fazer login.'
            });
        }
    },

    // Buscar perfil do usuário logado
    getProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['senha'] }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'Usuário não encontrado.'
                });
            }

            res.json(user);
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({
                error: 'Erro ao buscar perfil.'
            });
        }
    }
};

module.exports = authController;
