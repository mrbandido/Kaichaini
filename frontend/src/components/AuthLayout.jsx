import Kai from './Kai';

export default function AuthLayout({ children }) {
  return (
    <div className="auth-pagina">
      <section className="auth-hero">
        <div className="auth-hero-interno">
          <div className="marca marca-grande">
            <Kai size={64} />
            <span>Kaichaini</span>
          </div>
          <h1>Aprende jugando, a tu ritmo.</h1>
          <p>Historia del Perú, Geografía y más cursos pensados para tu grado, con lecciones cortas, retos y la compañía de Kai.</p>
          <ul className="auth-beneficios">
            <li><span>🎒</span> Contenido distinto para cada grado, de 1.º a 5.º</li>
            <li><span>📜</span> Lecturas, preguntas y ejercicios para ordenar hechos</li>
            <li><span>⭐</span> Gana XP y sube de nivel mientras aprendes</li>
          </ul>
          <small>Para estudiantes de 1.º a 5.º de secundaria y sus docentes.</small>
        </div>
      </section>
      <section className="auth-formulario">
        <div className="auth-tarjeta">{children}</div>
      </section>
    </div>
  );
}