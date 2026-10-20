import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { KaiDice } from '../components/Kai';

// Pantalla temporal: en el Paso 8 se convierte en "Mis cursos"
export default function Inicio() {
  const { usuario } = useAuth();
  const color = usuario.grado?.color || '#0F5257';

  return (
    <div className="pagina-inicio">
      <section className="grado-banner" style={{ '--acento': color }}>
        <div className="banner-usuario">
          <Avatar id={usuario.avatar} size={72} />
          <div>
            <span className="grado-etiqueta">{usuario.grado?.nombre ?? 'Docente'}</span>
            <h1>¡Hola, {usuario.nombre.split(' ')[0]}!</h1>
            <p>Iniciaste sesión correctamente.</p>
          </div>
        </div>
        <div className="grado-numero" aria-hidden>{usuario.grado ? `${usuario.grado.id}°` : '👩‍🏫'}</div>
      </section>

      <KaiDice>
        <p>Muy pronto aquí verás tus cursos. Mientras tanto, personaliza tu perfil y elige tu avatar. 🎨</p>
      </KaiDice>

      <Link to="/perfil" className="btn btn-primario">Ir a mi perfil</Link>
    </div>
  );
}
