// Carga los grados y usuarios de prueba.
// Uso:  npm run seed            -> crea las tablas que falten y carga los datos
//       npm run seed -- --reset -> BORRA todo y vuelve a crear (solo desarrollo)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Grado, Usuario } = require('../models');

const grados = [
  { id: 1, nombre: '1.º de secundaria', color: '#F26B1D' },
  { id: 2, nombre: '2.º de secundaria', color: '#2E9E6A' },
  { id: 3, nombre: '3.º de secundaria', color: '#3A6FD8' },
  { id: 4, nombre: '4.º de secundaria', color: '#8E4FD1' },
  { id: 5, nombre: '5.º de secundaria', color: '#D64045' },
];

async function seed() {
  const reset = process.argv.includes('--reset');
  await sequelize.sync({ force: reset });

  // 1. Grados
  for (const g of grados) await Grado.upsert(g);
  console.log(`Grados cargados: ${grados.length}`);

  // 2. Usuarios de prueba (contraseña: kaichaini123)
  const hash = await bcrypt.hash('kaichaini123', 10);
  const demo = [
    ...grados.map((g) => ({
      nombre: `Estudiante ${g.id}.º`,
      email: `estudiante${g.id}@kaichaini.pe`,
      rol: 'estudiante',
      gradoId: g.id,
    })),
    { nombre: 'Docente Demo', email: 'docente@kaichaini.pe', rol: 'docente', gradoId: null, onboardingCompletado: true },
  ];
  for (const d of demo) {
    await Usuario.findOrCreate({ where: { email: d.email }, defaults: { ...d, passwordHash: hash } });
  }
  console.log('Usuarios demo: estudiante1@kaichaini.pe ... estudiante5@kaichaini.pe, docente@kaichaini.pe (clave: kaichaini123)');

  await sequelize.close();
}

seed().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});