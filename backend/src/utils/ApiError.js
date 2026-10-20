// Error de negocio con código HTTP. El errorHandler lo convierte al formato JSON único:
// { "error": { "codigo": "...", "mensaje": "...", "campos": { ... } } }
class ApiError extends Error {
  constructor(status, codigo, mensaje, campos) {
    super(mensaje);
    this.status = status;
    this.codigo = codigo;
    this.campos = campos;
  }

  static badRequest(mensaje, campos) {
    return new ApiError(400, 'VALIDACION', mensaje, campos);
  }
  static unauthorized(mensaje = 'No autenticado') {
    return new ApiError(401, 'NO_AUTENTICADO', mensaje);
  }
  static forbidden(mensaje = 'No tienes permiso para esta acción') {
    return new ApiError(403, 'PROHIBIDO', mensaje);
  }
  static notFound(mensaje = 'Recurso no encontrado') {
    return new ApiError(404, 'NO_ENCONTRADO', mensaje);
  }
  static conflict(mensaje, campos) {
    return new ApiError(409, 'CONFLICTO', mensaje, campos);
  }
}

module.exports = ApiError;