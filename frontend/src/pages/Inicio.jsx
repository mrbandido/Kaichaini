import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KaiDice } from '../components/Kai';

// Pantalla temporal: muestra que la sesión funciona y el color del grado
export default function Inicio() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const color = usuario.grado?.color || '#0F5257';

  const salir = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="pagina-inicio">
      <section className="grado-banner" style={{ '--acento': color }}>
        <div>
          <span className="grado-etiqueta">{usuario.grado?.nombre ?? 'Docente'}</span>
          <h1>¡Hola, {usuario.nombre.split(' ')[0]}!</h1>
          <p>Iniciaste sesión correctamente.</p>
        </div>
        <div className="grado-numero" aria-hidden>{usuario.grado ? `${usuario.grado.id}°` : '👩‍🏫'}</div>
      </section>

      <KaiDice>
        <p>Muy pronto aquí verás tus cursos. ¡Estamos construyendo Kaichaini! 🛠️</p>
      </KaiDice>

      <button className="btn btn-secundario" onClick={salir}>Cerrar sesión</button>
    </div>
  );
}