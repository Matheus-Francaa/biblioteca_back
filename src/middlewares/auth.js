const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Token não fornecido. Acesso negado.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido ou expirado.'
        });
    }
};

const isBibliotecario = (req, res, next) => {
    if (req.user.tipo !== 'bibliotecario') {
        return res.status(403).json({
            error: 'Acesso negado. Apenas bibliotecários podem realizar esta ação.'
        });
    }
    next();
};

const isLeitor = (req, res, next) => {
    if (req.user.tipo !== 'leitor') {
        return res.status(403).json({
            error: 'Acesso negado. Apenas leitores podem realizar esta ação.'
        });
    }
    next();
};

module.exports = {
    authMiddleware,
    isBibliotecario,
    isLeitor
};
