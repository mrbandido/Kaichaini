const { Router } = require('express');
const { autenticar } = require('../middlewares/auth');
const auth = require('../controllers/auth.controller');

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true, servicio: 'kaichaini-api' }));

// Autenticación (H.U. 01, 02)
router.get('/grados', auth.grados); // público, para el registro
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);
router.get('/auth/me', autenticar, auth.me);

module.exports = router;