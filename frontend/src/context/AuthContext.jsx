import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'kaichaini_token';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    const { data } = await api.get('/auth/me');
    setUsuario(data);
    return data;
  }, []);

  // Al abrir la página, si hay token guardado se recupera la sesión
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setCargando(false);
      return;
    }
    refrescar()
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setCargando(false));
  }, [refrescar]);

  const guardarSesion = ({ token, usuario }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUsuario(usuario);
    return usuario;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return guardarSesion(data);
  };

  const registrar = async (datos) => {
    const { data } = await api.post('/auth/register', datos);
    return guardarSesion(data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, cargando, login, registrar, logout, refrescar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);