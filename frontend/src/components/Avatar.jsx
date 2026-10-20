import Kai from './Kai';

// Mismo catálogo que el backend (src/utils/avatares.js)
export const AVATARES = {
  kai: { nombre: 'Kai', icono: null },
  condor: { nombre: 'Cóndor', icono: '🦅' },
  llama: { nombre: 'Llama', icono: '🦙' },
  puma: { nombre: 'Puma', icono: '🐆' },
  colibri: { nombre: 'Colibrí', icono: '🐦' },
  tortuga: { nombre: 'Tortuga', icono: '🐢' },
  pez: { nombre: 'Pez', icono: '🐟' },
  mono: { nombre: 'Mono', icono: '🐒' },
};

export default function Avatar({ id = 'kai', size = 48 }) {
  const a = AVATARES[id] || AVATARES.kai;
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.55 }} title={a.nombre}>
      {a.icono ?? <Kai size={size * 0.85} />}
    </span>
  );
}
