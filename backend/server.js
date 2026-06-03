const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/authRoutes");
const usuarioRoutes = require("./src/routes/usuarioRoutes");
const mascotaRoutes = require("./src/routes/mascotaRoutes");
const turnoRoutes = require("./src/routes/turnoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API veterinaria funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/turnos", turnoRoutes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexion a MySQL establecida correctamente.");

    await sequelize.sync();
    console.log("Modelos verificados correctamente.");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

startServer();
