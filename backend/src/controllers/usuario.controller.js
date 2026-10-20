const usuarioService = require('../services/usuario.service');

const getPerfil = async (req, res) => {
  res.json(await usuarioService.obtenerPerfil(req.usuario.id));
};

const putPerfil = async (req, res) => {
  res.json(await usuarioService.actualizarPerfil(req.usuario.id, req.body));
};

const putPassword = async (req, res) => {
  await usuarioService.cambiarPassword(req.usuario.id, req.body);
  res.json({ mensaje: 'Contraseña actualizada correctamente' });
};

const putOnboarding = async (req, res) => {
  res.json(await usuarioService.completarOnboarding(req.usuario.id));
};

module.exports = { getPerfil, putPerfil, putPassword, putOnboarding };
