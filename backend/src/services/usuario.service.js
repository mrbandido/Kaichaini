const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { AVATARES } = require('../utils/avatares');
const { usuarioPublico, cargarUsuario, SALT_ROUNDS } = require('./auth.service');

async function buscar(id) {
  const usuario = await cargarUsuario(id);
  if (!usuario) throw ApiError.notFound('Usuario no encontrado');
  return usuario;
}

// H.U. 03 - Consultar perfil
async function obtenerPerfil(id) {
  const usuario = await buscar(id);
  return { ...usuarioPublico(usuario), avataresDisponibles: AVATARES };
}

// H.U. 03 - Personalizar perfil (avatar y nombre)
async function actualizarPerfil(id, { nombre, avatar }) {
  const usuario = await buscar(id);
  const campos = {};
  if (nombre !== undefined && String(nombre).trim().length < 2) campos.nombre = 'Mínimo 2 letras';
  if (avatar !== undefined && !AVATARES.includes(avatar)) campos.avatar = 'Avatar no válido';
  if (Object.keys(campos).length) throw ApiError.badRequest('Datos de perfil inválidos', campos);

  if (nombre !== undefined) usuario.nombre = String(nombre).trim();
  if (avatar !== undefined) usuario.avatar = avatar;
  await usuario.save();
  return usuarioPublico(usuario);
}

// H.U. 05 - Cambiar contraseña
async function cambiarPassword(id, { passwordActual, passwordNueva, confirmarPassword }) {
  const usuario = await buscar(id);
  const campos = {};
  if (!passwordActual) campos.passwordActual = 'Ingresa tu contraseña actual';
  if (!passwordNueva || passwordNueva.length < 8) campos.passwordNueva = 'Mínimo 8 caracteres';
  if (passwordNueva !== confirmarPassword) campos.confirmarPassword = 'Las contraseñas no coinciden';
  if (Object.keys(campos).length) throw ApiError.badRequest('Revisa los datos', campos);

  const ok = await bcrypt.compare(passwordActual, usuario.passwordHash);
  if (!ok) throw ApiError.badRequest('La contraseña actual no es correcta', { passwordActual: 'Contraseña incorrecta' });
  if (await bcrypt.compare(passwordNueva, usuario.passwordHash)) {
    throw ApiError.badRequest('La nueva contraseña debe ser distinta', { passwordNueva: 'Debe ser distinta a la actual' });
  }

  usuario.passwordHash = await bcrypt.hash(passwordNueva, SALT_ROUNDS);
  await usuario.save();
}

module.exports = { obtenerPerfil, actualizarPerfil, cambiarPassword };
