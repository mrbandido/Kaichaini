const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Grado } = require('../models');
const ApiError = require('../utils/ApiError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
}

// Usuario con su grado (nombre y color de su interfaz)
async function cargarUsuario(id) {
  return Usuario.findByPk(id, { include: [{ model: Grado, as: 'grado' }] });
}

// Lo que se manda al frontend (nunca el passwordHash)
function usuarioPublico(u) {
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    grado: u.grado ? { id: u.grado.id, nombre: u.grado.nombre, color: u.grado.color } : null,
    avatar: u.avatar,
    xp: u.xp,
    onboardingCompletado: u.onboardingCompletado,
  };
}

// H.U. 01 - Registro de usuario
async function registrar({ nombre, email, password, confirmarPassword, rol, gradoId }) {
  const campos = {};
  if (!nombre || nombre.trim().length < 2) campos.nombre = 'Ingresa tu nombre (mínimo 2 letras)';
  if (!email || !EMAIL_RE.test(email)) campos.email = 'Correo inválido';
  if (!password || password.length < 8) campos.password = 'La contraseña debe tener al menos 8 caracteres';
  if (password !== confirmarPassword) campos.confirmarPassword = 'Las contraseñas no coinciden';
  if (!['estudiante', 'docente'].includes(rol)) campos.rol = 'Selecciona un rol válido';

  // el grado tiene que existir en la tabla grados
  let grado = null;
  if (rol === 'estudiante') {
    grado = Number.isInteger(Number(gradoId)) ? await Grado.findByPk(Number(gradoId)) : null;
    if (!grado) campos.gradoId = 'Selecciona tu grado';
  }
  if (Object.keys(campos).length) throw ApiError.badRequest('Revisa los datos del formulario', campos);

  const correo = email.trim().toLowerCase();
  const existe = await Usuario.findOne({ where: { email: correo } });
  if (existe) throw ApiError.conflict('Este correo ya está registrado', { email: 'Este correo ya está registrado' });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const creado = await Usuario.create({
    nombre: nombre.trim(),
    email: correo,
    passwordHash,
    rol,
    gradoId: grado ? grado.id : null,
    onboardingCompletado: rol === 'docente', // el docente no pasa por el onboarding
  });

  const usuario = await cargarUsuario(creado.id);
  return { token: generarToken(usuario), usuario: usuarioPublico(usuario) };
}

// H.U. 02 - Inicio de sesión
async function iniciarSesion({ email, password }) {
  if (!email || !password) throw ApiError.badRequest('Ingresa correo y contraseña');
  const usuario = await Usuario.findOne({
    where: { email: String(email).trim().toLowerCase() },
    include: [{ model: Grado, as: 'grado' }],
  });
  const ok = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  if (!ok) throw ApiError.unauthorized('Correo o contraseña incorrectos');
  return { token: generarToken(usuario), usuario: usuarioPublico(usuario) };
}

// Usuario de la sesión actual
async function obtenerSesion(id) {
  const usuario = await cargarUsuario(id);
  if (!usuario) throw ApiError.notFound('Usuario no encontrado');
  return usuarioPublico(usuario);
}

// Lista pública de grados (para el formulario de registro)
async function listarGrados() {
  const grados = await Grado.findAll({ order: [['id', 'ASC']] });
  return grados.map((g) => ({ id: g.id, nombre: g.nombre, color: g.color }));
}

module.exports = { registrar, iniciarSesion, obtenerSesion, listarGrados, usuarioPublico, cargarUsuario, SALT_ROUNDS };
