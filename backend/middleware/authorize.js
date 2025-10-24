/**
 * Middleware de autorización para validar permisos por rol
 * Uso: authorize(['administrador', 'bodeguero'])
 */

const authorize = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario tenga rol
      if (!req.userRole) {
        return res.status(401).json({ 
          error: 'No autorizado. Debe iniciar sesión.' 
        });
      }

      // Verificar que el rol del usuario esté en los roles permitidos
      if (!rolesPermitidos.includes(req.userRole)) {
        return res.status(403).json({ 
          error: 'Acceso denegado. No tiene permisos para realizar esta acción.',
          rolRequerido: rolesPermitidos,
          rolActual: req.userRole
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Error en la verificación de permisos.' });
    }
  };
};

module.exports = authorize;
