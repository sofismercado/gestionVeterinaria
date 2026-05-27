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

    
    if (nombre === "superadmin@vet.com" && contraseña === "super123") {
      login({ nombre: "Super Administrador", rol: "super-admin" });
      navigate("/home_superadministrador");
    } else if (nombre === "admin@vet.com" && contraseña === "admin123") {
      login({ nombre: "Administrador", rol: "admin" });
      navigate("/home_administrador");
    } else if (nombre === "cliente@vet.com" && contraseña === "cliente123") {
      login({ nombre: "Carlos", rol: "cliente" });
      navigate("/home");
    } else {
      setError("Usuario o contraseña incorrectos.");
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

        {/* Accesos rápidos para probar */}
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(255,255,255,0.15)", borderRadius: "10px" }}>
          <p style={{ color: "white", fontSize: "0.75rem", marginBottom: "0.5rem" }}>Accesos rápidos de prueba:</p>
          <button className="login-btn" style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}
            onClick={() => { setNombre("superadmin@vet.com"); setContraseña("super123"); }}>
            Entrar como Super Admin
          </button>
          <button className="login-btn" style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}
            onClick={() => { setNombre("admin@vet.com"); setContraseña("admin123"); }}>
            Entrar como Admin
          </button>
          <button className="login-btn" style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}
            onClick={() => { setNombre("cliente@vet.com"); setContraseña("cliente123"); }}>
            Entrar como Cliente
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
