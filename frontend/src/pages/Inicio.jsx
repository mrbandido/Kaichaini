import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { KaiDice } from '../components/Kai';

// Pantalla temporal: en el Paso 8 se convierte en "Mis cursos"
export default function Inicio() {
  const { usuario } = useAuth();

  return (
    <div className="pagina-inicio">
      <section className="grado-banner">
        <div className="banner-usuario">
          <Avatar id={usuario.avatar} size={72} />
          <div>
            <span className="grado-etiqueta">{usuario.grado?.nombre ?? 'Docente'}</span>
            <h1>¡Hola, {usuario.nombre.split(' ')[0]}!</h1>
            <p>Bienvenido a Kaichaini.</p>
          </div>
        </div>
        <div className="grado-numero" aria-hidden>{usuario.grado ? `${usuario.grado.id}°` : '👩‍🏫'}</div>
      </section>

      <KaiDice>
        <p>Muy pronto aquí verás tus cursos. Usa la barra de arriba para ir a tu perfil o a retos. 🧭</p>
      </KaiDice>
    </div>
  );
}
