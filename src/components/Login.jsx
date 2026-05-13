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

  // Estados para el registro
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regExito, setRegExito] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre === "" || contraseña === "") {
        setError("Todos los campos son obligatorios.");
        return;
    }

    setError("");

    fetch("http://localhost:3000/login", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email: nombre, password: contraseña })
    })
        .then(async res => {
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Error al iniciar sesión");
            }
            return res.json();
        })
        .then(data => {
            localStorage.setItem("veterinaria-token", data.token);
            login({ nombre: data.nombre, rol: data.rol });

            if (data.rol === "superadmin") navigate("/home-superadmin");
            else if (data.rol === "admin") navigate("/home-admin");
            else navigate("/home");
        })
        .catch(err => setError(err.message));
  };

  const handleRegistro = (e) => {
    e.preventDefault();

    if (!regNombre || !regEmail || !regPassword) {
        setRegError("Todos los campos son obligatorios.");
        return;
    }

    if (regPassword.length < 7) {
        setRegError("La contraseña debe tener al menos 7 caracteres.");
        return;
    }

    setRegError("");

    fetch("http://localhost:3000/register", {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ nombre: regNombre, email: regEmail, password: regPassword })
    })
        .then(async res => {
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Error al registrarse");
            }
            return res.json();
        })
        .then(() => {
            setRegExito("¡Usuario creado correctamente! Ya podés iniciar sesión.");
            setRegNombre("");
            setRegEmail("");
            setRegPassword("");
            setTimeout(() => {
                setMostrarRegistro(false);
                setRegExito("");
            }, 2000);
        })
        .catch(err => setRegError(err.message));
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo de veterinaria" className="login-logo" />

        {!mostrarRegistro ? (
          <>
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
            <p style={{ color: "white", marginTop: "1rem" }}>¿No tenés cuenta?</p>
            <button className="login-btn" onClick={() => setMostrarRegistro(true)}>
              Registrarse
            </button>
          </>
        ) : (
          <>
            <h2>Crear cuenta</h2>
            <form className="login-form" onSubmit={handleRegistro}>
              <div className="input-group">
                <label>Nombre: </label>
                <input 
                  type="text" 
                  placeholder="Tu nombre"
                  value={regNombre}
                  onChange={e => setRegNombre(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Email: </label>
                <input 
                  type="email" 
                  placeholder="ejemplo@email.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Contraseña: </label>
                <input 
                  type="password"
                  placeholder="Mínimo 7 caracteres"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                />
              </div>
              <button className="login-btn">Crear cuenta</button>
            </form>
            {regError && <p className="error-msg">{regError}</p>}
            {regExito && <p style={{ color: "green", marginTop: "1rem" }}>{regExito}</p>}
            <button className="login-btn" style={{ marginTop: "0.5rem" }} onClick={() => setMostrarRegistro(false)}>
              Volver al login
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Login;