const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ---------- Grado: 1.º a 5.º de secundaria ----------
// Cada alumno pertenece a un grado y solo verá el contenido de su grado.
const Grado = sequelize.define(
  'Grado',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true }, // 1..5
    nombre: { type: DataTypes.STRING(40), allowNull: false }, // "1.º de secundaria"
    color: { type: DataTypes.STRING(9), allowNull: false, defaultValue: '#F26B1D' }, // color de su interfaz
  },
  { tableName: 'grados', underscored: true }
);

// ---------- Usuario (H.U. 01, 02, 03, 05, 06) ----------
const Usuario = sequelize.define(
  'Usuario',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(80), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, unique: true, validate: { isEmail: true } },
    passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    rol: { type: DataTypes.ENUM('estudiante', 'docente'), allowNull: false, defaultValue: 'estudiante' },
    avatar: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'kai' },
    xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    onboardingCompletado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'onboarding_completado' },
  },
  { tableName: 'usuarios', underscored: true }
);

// ---------- Relaciones ----------
// grado_id es NULL para los docentes
Grado.hasMany(Usuario, { foreignKey: 'gradoId' });
Usuario.belongsTo(Grado, { foreignKey: 'gradoId', as: 'grado' });

module.exports = { sequelize, Grado, Usuario };