import{ BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import HomeCliente from './pages/cliente/HomeCliente';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Si la ruta es la raíz, muestra el Login */}
        <Route path="/" element={<Login />} />
        
        {/* Si la ruta es /home, muestra el Home del cliente */}
        <Route path="/home" element={<HomeCliente />} />
      </Routes>
    </Router>
  );
}

export default App;