import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import Kai from './Kai';

// Opciones del menú según el rol
export function itemsNav(rol) {
  return rol === 'docente'
    ? [
        { to: '/', icono: '📊', texto: 'Panel' },
        { to: '/perfil', icono: '👤', texto: 'Perfil' },
      ]
    : [
        { to: '/', icono: '📚', texto: 'Mis cursos' },
        { to: '/retos', icono: '⚔️', texto: 'Retos' },
        { to: '/perfil', icono: '👤', texto: 'Perfil' },
      ];
}

export function useActivo() {
  const { pathname } = useLocation();
  return (to) => (to === '/' ? pathname === '/' || pathname.startsWith('/curso') : pathname.startsWith(to));
}

// H.U. 08 - Barra de navegación persistente (arriba en escritorio)
export default function TopNav() {
  const { usuario } = useAuth();
  const activo = useActivo();
  return (
    <header className="topnav">
      <div className="topnav-interno">
        <Link to="/" className="marca">
          <Kai size={38} />
          <span>Kaichaini</span>
        </Link>

        <nav className="topnav-links" aria-label="Navegación principal">
          {itemsNav(usuario.rol).map((i) => (
            <NavLink key={i.to} to={i.to} className={activo(i.to) ? 'toplink activo' : 'toplink'}>
              <span aria-hidden>{i.icono}</span> {i.texto}
            </NavLink>
          ))}
        </nav>

        <div className="topnav-usuario">
          {usuario.rol === 'estudiante' && <div className="xp-chip">⭐ {usuario.xp} XP</div>}
          <Link to="/perfil" className="topnav-perfil" title="Mi perfil">
            <Avatar id={usuario.avatar} size={40} />
            <span className="topnav-nombre">{usuario.nombre.split(' ')[0]}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
