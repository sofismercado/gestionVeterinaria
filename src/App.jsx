import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import HomeCliente from './pages/cliente/HomeCliente';
import MisMascotas from './pages/cliente/mis_mascotas';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home_administrador from './pages/administrador/Home_administrador';
import TurnosPanel from './pages/administrador/TurnosPanel';
import NuevoTurnoModal from './pages/administrador/NuevoTurnoModal';
import ClientesPanel from './pages/administrador/ClientesPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<HomeCliente />} />
          <Route path="/mis-mascotas" element={
          
            <ProtectedRoute>
              <MisMascotas />
            </ProtectedRoute>
          } />
          <Route path="/home_administrador" element={<Home_administrador/>} />
          <Route path="/turnos" element={<TurnosPanel/>} />
          <Route path="/nuevo_turno" element={<NuevoTurnoModal/>} />
          <Route path="/clientes" element={<ClientesPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;