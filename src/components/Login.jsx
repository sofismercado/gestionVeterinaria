import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nombre, setNombre] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre === "" || contraseña === "") {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setError("");

    if (nombre === "Sofi@gmail.com") {
      login({ id: 1, nombre: "Sofi", email: nombre, rol: "cliente" });
      navigate("/home_administrador");
    } else {
      setError("Usuario no reconocido.");
    }
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo de veterinaria" className="login-logo" />
        <h2>Iniciar Sesión</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario: </label>
            <input 
              type="text" 
              placeholder="ejemplo@email"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña: </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
            />
          </div>

          <button className="login-btn">Iniciar sesión</button>
        </form>

        {error && <p className="error-msg">{error}</p>}
      </div>
    </section>
  );
};

export default Login;