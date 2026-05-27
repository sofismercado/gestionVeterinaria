import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const usuarioGuardado = localStorage.getItem("veterinaria-user");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("veterinaria-token"));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("veterinaria-user", JSON.stringify(userData));
    localStorage.setItem("veterinaria-token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("veterinaria-user");
    localStorage.removeItem("veterinaria-token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
