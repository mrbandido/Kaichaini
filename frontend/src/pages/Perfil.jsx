import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { leerError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Avatar, { AVATARES } from '../components/Avatar';
import Campo from '../components/Campo';

// H.U. 03 - Perfil y avatares · H.U. 05 - Cambiar contraseña
export default function Perfil() {
  const { usuario, setUsuario, logout } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [aviso, setAviso] = useState('');

  const mostrarAviso = (t) => {
    setAviso(t);
    setTimeout(() => setAviso(''), 2200);
  };

  // guardado inmediato al elegir avatar o cambiar nombre
  const guardar = async (cambios) => {
    try {
      const { data } = await api.put('/users/profile', cambios);
      setUsuario((u) => ({ ...u, ...data }));
      mostrarAviso('Perfil guardado ✓');
    } catch (e) {
      mostrarAviso(leerError(e).mensaje);
    }
  };

  const salir = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="perfil">
      <Link to="/" className="volver">← Volver al inicio</Link>

      <section className="perfil-cabecera">
        <Avatar id={usuario.avatar} size={96} />
        <div className="perfil-cabecera-texto">
          <h1>{usuario.nombre}</h1>
          <p>{usuario.email} · {usuario.rol === 'docente' ? 'Docente' : usuario.grado?.nombre}</p>
        </div>
        {usuario.rol === 'estudiante' && (
          <div className="perfil-stats">
            <div><strong>⭐ {usuario.xp}</strong><small>XP total</small></div>
          </div>
        )}
      </section>

      <div className="perfil-columnas">
        <div>
          <section className="tarjeta">
            <h2>Elige tu avatar</h2>
            <div className="avatares">
              {Object.entries(AVATARES).map(([id, a]) => (
                <button
                  key={id}
                  className={usuario.avatar === id ? 'avatar-opcion activo' : 'avatar-opcion'}
                  onClick={() => usuario.avatar !== id && guardar({ avatar: id })}
                  aria-pressed={usuario.avatar === id}
                >
                  <Avatar id={id} size={52} />
                  <small>{a.nombre}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="tarjeta">
            <h2>Tu nombre</h2>
            <form
              className="fila-form"
              onSubmit={(e) => {
                e.preventDefault();
                guardar({ nombre });
              }}
            >
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={80} aria-label="Nombre" />
              <button className="btn btn-secundario" disabled={nombre.trim() === usuario.nombre || nombre.trim().length < 2}>
                Guardar
              </button>
            </form>
          </section>
        </div>

        <div>
          <CambiarPassword onExito={() => mostrarAviso('Contraseña actualizada ✓')} />
          <button className="btn btn-peligro btn-bloque" onClick={salir}>Cerrar sesión</button>
        </div>
      </div>

      {aviso && <div className="toast">{aviso}</div>}
    </div>
  );
}

function CambiarPassword({ onExito }) {
  const vacio = { passwordActual: '', passwordNueva: '', confirmarPassword: '' };
  const [form, setForm] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => {
    const nuevo = { ...form, [e.target.name]: e.target.value };
    setForm(nuevo);
    const err = { ...errores };
    delete err[e.target.name];
    if (nuevo.confirmarPassword && nuevo.passwordNueva !== nuevo.confirmarPassword) err.confirmarPassword = 'No coinciden';
    else delete err.confirmarPassword;
    setErrores(err);
  };

  const enviar = async (e) => {
    e.preventDefault(); // sin recargar la página
    const err = {};
    if (!form.passwordActual) err.passwordActual = 'Ingresa tu contraseña actual';
    if (form.passwordNueva.length < 8) err.passwordNueva = 'Mínimo 8 caracteres';
    if (form.passwordNueva !== form.confirmarPassword) err.confirmarPassword = 'No coinciden';
    setErrores(err);
    if (Object.keys(err).length) return;

    setEnviando(true);
    try {
      await api.put('/users/password', form);
      setForm(vacio);
      onExito();
    } catch (ex) {
      setErrores(leerError(ex).campos);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="tarjeta">
      <h2>Cambiar contraseña</h2>
      <form onSubmit={enviar} noValidate>
        <Campo label="Contraseña actual" name="passwordActual" type="password" value={form.passwordActual} onChange={cambiar} error={errores.passwordActual} autoComplete="current-password" />
        <Campo label="Nueva contraseña" name="passwordNueva" type="password" value={form.passwordNueva} onChange={cambiar} error={errores.passwordNueva} autoComplete="new-password" />
        <Campo label="Confirmar nueva contraseña" name="confirmarPassword" type="password" value={form.confirmarPassword} onChange={cambiar} error={errores.confirmarPassword} autoComplete="new-password" />
        <button className="btn btn-primario" disabled={enviando}>{enviando ? 'Guardando...' : 'Actualizar contraseña'}</button>
      </form>
    </section>
  );
}
