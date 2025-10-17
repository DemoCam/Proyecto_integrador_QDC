const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.rol;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

module.exports = auth;
