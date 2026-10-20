const { Router } = require('express');
const { autenticar } = require('../middlewares/auth');
const auth = require('../controllers/auth.controller');
const usuario = require('../controllers/usuario.controller');

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true, servicio: 'kaichaini-api' }));

// Autenticación (H.U. 01, 02)
router.get('/grados', auth.grados); // público, para el registro
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', autenticar, auth.me);

// Perfil (H.U. 03, 05)
router.get('/users/profile', autenticar, usuario.getPerfil);
router.put('/users/profile', autenticar, usuario.putPerfil);
router.put('/users/password', autenticar, usuario.putPassword);

module.exports = router;
