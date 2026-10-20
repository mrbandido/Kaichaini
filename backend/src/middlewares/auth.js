const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Verifica el token JWT del header Authorization: Bearer <token>
function autenticar(req, _res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) return next(ApiError.unauthorized('Falta el token de acceso'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id, rol: payload.rol };
    next();
  } catch {
    next(ApiError.unauthorized('Sesión expirada o token inválido'));
  }
}

// Restringe una ruta a ciertos roles: soloRol('docente')
function soloRol(...roles) {
  return (req, _res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) return next(ApiError.forbidden());
    next();
  };
}

module.exports = { autenticar, soloRol };