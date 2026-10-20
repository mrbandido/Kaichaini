import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { KaiDice } from '../components/Kai';

// H.U. 06 - Tutorial de bienvenida guiado por Kai
const PASOS = [
  {
    titulo: (n) => `¡Hola, ${n}!`,
    texto: 'Soy Kai, un gallito de las rocas. Te voy a acompañar mientras aprendes Historia, Geografía y más cursos de tu grado.',
    visual: '🏔️',
  },
  {
    titulo: () => 'Tus cursos y tu mapa',
    texto: 'Verás solo los cursos de tu grado. En cada uno, las lecciones forman un camino: al completar una, se desbloquea la siguiente.',
    visual: '🗺️',
  },
  {
    titulo: () => 'Cuida tu energía',
    texto: 'En cada lección tienes 3 rayos de energía ⚡. Si te equivocas pierdes uno, y si llegas a cero tendrás que volver a intentarlo.',
    visual: '⚡⚡⚡',
  },
  {
    titulo: () => 'Muchas formas de aprender',
    texto: 'Elegirás alternativas, escribirás respuestas, leerás (o escucharás) textos y ordenarás hechos arrastrándolos.',
    visual: '📜 ✍️ 🔊 🧩',
  },
  {
    titulo: () => '¡Gana XP!',
    texto: 'Cada lección completada te da puntos de experiencia. ¿Listo para empezar?',
    visual: '⭐',
  },
];

export default function Onboarding() {
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const p = PASOS[paso];
  const ultimo = paso === PASOS.length - 1;

  // al terminar o saltar se guarda en la BD para no volver a mostrarlo
  const terminar = async () => {
    setGuardando(true);
    try {
      const { data } = await api.put('/users/onboarding');
      setUsuario((u) => ({ ...u, ...data }));
      navigate('/', { replace: true });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="onboarding">
      <button className="saltar" onClick={terminar} disabled={guardando}>
        Saltar introducción →
      </button>

      <div className="onboarding-contenido" key={paso}>
        <div className="onboarding-visual" aria-hidden>{p.visual}</div>
        <KaiDice size={110}>
          <h2>{p.titulo(usuario.nombre.split(' ')[0])}</h2>
          <p>{p.texto}</p>
        </KaiDice>
      </div>

      <div className="onboarding-pie">
        <div className="puntos">
          {PASOS.map((_, i) => (
            <span key={i} className={i === paso ? 'punto activo' : 'punto'} />
          ))}
        </div>
        <div className="onboarding-botones">
          {paso > 0 && (
            <button className="btn btn-secundario" onClick={() => setPaso(paso - 1)}>
              Atrás
            </button>
          )}
          <button className="btn btn-primario" onClick={ultimo ? terminar : () => setPaso(paso + 1)} disabled={guardando}>
            {ultimo ? '¡Empezar!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
