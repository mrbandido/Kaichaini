import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TopNav from './components/TopNav';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';
import Retos from './pages/Retos';

function Cargando() {
  return <div className="pantalla-centro"><div className="spinner" /></div>;
}

// Solo usuarios con sesión. Los estudiantes nuevos pasan primero por el onboarding (H.U. 06).
function Privada({ sinOnboarding = false }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!sinOnboarding && usuario.rol === 'estudiante' && !usuario.onboardingCompletado) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

// Solo usuarios SIN sesión (login y registro)
function Publica() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Cargando />;
  if (usuario) return <Navigate to="/" replace />;
  return <Outlet />;
}

// H.U. 08 - Layout con navegación persistente: solo cambia el contenido, la barra se mantiene.
// Cada grado pinta la interfaz con su color (tabla grados).
function ConNavegacion() {
  const { usuario } = useAuth();
  return (
    <div className="app-layout" style={{ '--acento': usuario.grado?.color || '#F26B1D' }}>
      <TopNav />
      <main className="app-contenido">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Publica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Route>

      <Route element={<Privada sinOnboarding />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      <Route element={<Privada />}>
        <Route element={<ConNavegacion />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/retos" element={<Retos />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
