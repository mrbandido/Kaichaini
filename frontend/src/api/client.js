import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kaichaini_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el token expiró, se limpia la sesión y se manda al login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || '';
    if (status === 401 && !url.includes('/auth/login')) {
      localStorage.removeItem('kaichaini_token');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Lee el formato único de error del backend: { error: { mensaje, campos } }
export function leerError(err) {
  const e = err.response?.data?.error;
  return {
    mensaje: e?.mensaje || (err.response ? 'Ocurrió un error' : 'No se pudo conectar con el servidor'),
    campos: e?.campos || {},
  };
}

export default api;