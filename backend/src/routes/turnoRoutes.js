const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  listarTurnos,
  crearTurno,
  actualizarTurno,
  eliminarTurno,
} = require("../controllers/turnoController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listarTurnos);
router.post("/", roleMiddleware(["admin", "super-admin"]), crearTurno);
router.put("/:id", roleMiddleware(["cliente", "admin", "super-admin"]), actualizarTurno);
router.delete("/:id", roleMiddleware(["admin", "super-admin"]), eliminarTurno);

module.exports = router;
