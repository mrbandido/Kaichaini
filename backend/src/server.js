require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

async function iniciar() {
  if (!process.env.JWT_SECRET) {
    console.error('Falta JWT_SECRET en el .env (copia .env.example a .env)');
    process.exit(1);
  }
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // crea las tablas si no existen
    console.log('Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`API Kaichaini en http://localhost:${PORT}/api`));
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
}

iniciar();