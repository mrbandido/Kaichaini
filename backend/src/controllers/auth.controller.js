const authService = require('../services/auth.service');

const register = async (req, res) => {
  const data = await authService.registrar(req.body);
  res.status(201).json(data);
};

const login = async (req, res) => {
  res.json(await authService.iniciarSesion(req.body));
};

const me = async (req, res) => {
  res.json(await authService.obtenerSesion(req.usuario.id));
};

const grados = async (_req, res) => {
  res.json(await authService.listarGrados());
};

module.exports = { register, login, me, grados };