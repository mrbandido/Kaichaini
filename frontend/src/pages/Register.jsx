import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { leerError } from '../api/client';
import Campo from '../components/Campo';
import Kai from '../components/Kai';
import AuthLayout from '../components/AuthLayout';

// H.U. 01 - Registro de usuario
export default function Register() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmarPassword: '', rol: 'estudiante', gradoId: '' });
  const [grados, setGrados] = useState([]);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  // los grados vienen de la base de datos (tabla grados)
  useEffect(() => {
    api.get('/grados').then(({ data }) => setGrados(data)).catch(() => setGrados([]));
  }, []);

  const cambiar = (e) => {
    const nuevo = { ...form, [e.target.name]: e.target.value };
    setForm(nuevo);
    // validación en tiempo real
    const err = { ...errores };
    delete err[e.target.name];
    if (nuevo.confirmarPassword && nuevo.password !== nuevo.confirmarPassword) err.confirmarPassword = 'Las contraseñas no coinciden';
    else delete err.confirmarPassword;
    setErrores(err);
  };

  const validar = () => {
    const err = {};
    if (form.nombre.trim().length < 2) err.nombre = 'Ingresa tu nombre';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Correo inválido';
    if (form.password.length < 8) err.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmarPassword) err.confirmarPassword = 'Las contraseñas no coinciden';
    if (form.rol === 'estudiante' && !form.gradoId) err.gradoId = 'Selecciona tu grado';
    return err;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    const err = validar();
    setErrores(err);
    if (Object.keys(err).length) return;

    setEnviando(true);
    try {
      await registrar({ ...form, gradoId: form.rol === 'estudiante' ? Number(form.gradoId) : null });
      navigate('/', { replace: true });
    } catch (ex) {
      const { mensaje, campos } = leerError(ex);
      setErrores(campos);
      if (!Object.keys(campos).length) setError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-marca">
        <Kai size={56} />
        <h1>Crea tu cuenta</h1>
      </div>

      <form onSubmit={enviar} noValidate>
        <div className="selector-rol" role="radiogroup" aria-label="Rol">
          {[
            { v: 'estudiante', t: '🎒 Soy estudiante' },
            { v: 'docente', t: '🧑‍🏫 Soy docente' },
          ].map((r) => (
            <button
              key={r.v}
              type="button"
              role="radio"
              aria-checked={form.rol === r.v}
              className={form.rol === r.v ? 'rol activo' : 'rol'}
              onClick={() => cambiar({ target: { name: 'rol', value: r.v } })}
            >
              {r.t}
            </button>
          ))}
        </div>

        <Campo label="Nombre" name="nombre" value={form.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" />
        <Campo label="Correo" name="email" type="email" value={form.email} onChange={cambiar} error={errores.email} autoComplete="email" />

        {form.rol === 'estudiante' && (
          <div className={`campo ${errores.gradoId ? 'con-error' : ''}`}>
            <label htmlFor="gradoId">Grado</label>
            <select id="gradoId" name="gradoId" value={form.gradoId} onChange={cambiar}>
              <option value="">Selecciona...</option>
              {grados.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
            {errores.gradoId && <small className="error-texto">{errores.gradoId}</small>}
          </div>
        )}

        <Campo label="Contraseña" name="password" type="password" value={form.password} onChange={cambiar} error={errores.password} autoComplete="new-password" />
        <Campo label="Confirmar contraseña" name="confirmarPassword" type="password" value={form.confirmarPassword} onChange={cambiar} error={errores.confirmarPassword} autoComplete="new-password" />

        {error && <div className="alerta-error">{error}</div>}
        <button className="btn btn-primario btn-bloque" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="auth-pie">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}