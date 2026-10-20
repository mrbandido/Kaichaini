const ApiError = require('../utils/ApiError');

// Middleware centralizado de errores: todas las respuestas de error tienen el mismo formato JSON
// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: { codigo: err.codigo, mensaje: err.message, ...(err.campos && { campos: err.campos }) },
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: { codigo: 'CONFLICTO', mensaje: 'El registro ya existe' } });
  }
  if (err.name === 'SequelizeValidationError') {
    const campos = {};
    err.errors.forEach((e) => (campos[e.path] = e.message));
    return res.status(400).json({ error: { codigo: 'VALIDACION', mensaje: 'Datos inválidos', campos } });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { codigo: 'VALIDACION', mensaje: 'JSON mal formado' } });
  }

  console.error(err);
  res.status(500).json({ error: { codigo: 'ERROR_INTERNO', mensaje: 'Error interno del servidor' } });
}

function noEncontrado(_req, _res, next) {
  next(ApiError.notFound('Ruta no encontrada'));
}

module.exports = { errorHandler, noEncontrado };