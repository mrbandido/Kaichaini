import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leerError } from '../api/client';
import Campo from '../components/Campo';
import Kai from '../components/Kai';
import AuthLayout from '../components/AuthLayout';

// H.U. 02 - Inicio de sesión
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(leerError(err).mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-marca">
        <Kai size={56} />
        <h1>Inicia sesión</h1>
        <p>¡Qué bueno verte de nuevo!</p>
      </div>

      <form onSubmit={enviar} noValidate>
        <Campo label="Correo" name="email" type="email" value={form.email} onChange={cambiar} autoComplete="email" />
        <Campo label="Contraseña" name="password" type="password" value={form.password} onChange={cambiar} autoComplete="current-password" />
        {error && <div className="alerta-error">{error}</div>}
        <button className="btn btn-primario btn-bloque" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-pie">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </AuthLayout>
  );
}