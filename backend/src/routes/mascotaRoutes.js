const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  listarMascotas,
  crearMascota,
  actualizarMascota,
  eliminarMascota,
} = require("../controllers/mascotaController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listarMascotas);
router.post("/", roleMiddleware(["admin", "super-admin"]), crearMascota);
router.put("/:id", roleMiddleware(["admin", "super-admin"]), actualizarMascota);
router.delete("/:id", roleMiddleware(["admin", "super-admin"]), eliminarMascota);

module.exports = router;
