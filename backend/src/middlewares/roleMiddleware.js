function roleMiddleware(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: "No tenes permisos para esta accion." });
    }

    next();
  };
}

module.exports = roleMiddleware;
