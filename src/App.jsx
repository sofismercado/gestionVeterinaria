import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import HomeCliente from './pages/cliente/HomeCliente';
import MisMascotas from './pages/cliente/mis_mascotas';
import MisTurnos from './pages/cliente/MisTurnos';
import PedirTurno from './pages/cliente/PedirTurno';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home_administrador from './pages/administrador/Home_administrador';
import TurnosPanel from './pages/administrador/TurnosPanel';
import NuevoTurnoModal from './pages/administrador/NuevoTurnoModal';
import ClientesPanel from './pages/administrador/ClientesPanel';
import HomeSuperadministrador from './pages/superadministrador/HomeSuperadministrador';
import UsuariosPanel from './pages/superadministrador/UsuariosPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={
            <ProtectedRoute allowedRoles={["cliente", "super-admin"]}>
              <HomeCliente />
            </ProtectedRoute>
          } />
          <Route path="/mis-mascotas" element={
          
            <ProtectedRoute allowedRoles={["cliente", "super-admin"]}>
              <MisMascotas />
            </ProtectedRoute>
          } />
          <Route path="/mis-turnos" element={
            <ProtectedRoute allowedRoles={["cliente", "super-admin"]}>
              <MisTurnos />
            </ProtectedRoute>
          } />
          <Route path="/pedir-turno" element={
            <ProtectedRoute allowedRoles={["cliente", "super-admin"]}>
              <PedirTurno />
            </ProtectedRoute>
          } />
          <Route path="/home_superadministrador" element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <HomeSuperadministrador />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute allowedRoles={["super-admin"]}>
              <UsuariosPanel />
            </ProtectedRoute>
          } />
          <Route path="/home_administrador" element={
            <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
              <Home_administrador/>
            </ProtectedRoute>
          } />
          <Route path="/turnos" element={
            <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
              <TurnosPanel/>
            </ProtectedRoute>
          } />
          <Route path="/nuevo_turno" element={
            <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
              <NuevoTurnoModal/>
            </ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute allowedRoles={["admin", "super-admin"]}>
              <ClientesPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
