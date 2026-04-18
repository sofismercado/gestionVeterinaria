import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png.png";

const Login = () => {
  const navigate= useNavigate();
  const [nombre, setNombre] = useState("")
  const [constraseña, setContraseña] = useState("")
  const [error, setError] = useState(false)

  const handlesubmit = (e) => {
    e.preventDefault();

    if (nombre === "" || constraseña === "") {
      setError(true);
      return;
    }

    setError(false);
    // aca es donde agregamos la lógica de:
    // if(nombre === "admin") navigate("/admin") ...
    if (nombre === "Sofi@gmail.com"){
      navigate("/home");
      }else {
        alert("Usuario no reconocido");
      }
  }

  return (
    <section className="login-container">
      <div className="login-card">
        <img
        src={logo}
        alt="Logo de veterinaria"
        className="login-logo"/>
        <h2>Iniciar Sesión</h2>
        
        <form className="login-form" onSubmit={handlesubmit}>
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
              value={constraseña}
              onChange={e => setContraseña(e.target.value)}
            />
          </div>

          <button className="login-btn">Iniciar sesión</button>
        </form>

        {error && <p className="error-msg">Todos los campos son obligatorios</p>}
      </div>
    </section>
  )
}

export default Login;