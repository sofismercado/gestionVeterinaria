import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png.png";

const API_URL = "http://localhost:3000/api";

const getHomeByRole = (rol) => {
  if (rol === "super-admin") return "/home_superadministrador";
  if (rol === "admin") return "/home_administrador";
  return "/home";
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.mensaje || "Usuario o contrasena incorrectos.");
        return;
      }

      login(data.usuario, data.token);
      navigate(getHomeByRole(data.usuario.rol));
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo de veterinaria" className="login-logo" />
        <h2>Iniciar Sesion</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Contrasena:</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesion"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </section>
  );
};

export default Login;
