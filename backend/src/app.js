require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Ruta de prueba para saber si la API está viva
app.get('/api/health', (_req, res) => res.json({ ok: true, servicio: 'kaichaini-api' }));

module.exports = app;
