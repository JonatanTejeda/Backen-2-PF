export const authorizations = (roles) => {
    
    return (req, res, next) => {
        console.log("Usuario autenticado:", req.user);
        if (!req.user) {
            console.log("Acceso denegado: Usuario no autenticado");
            return res.status(401).json({ message: "No autenticado" });
        }
        if (!roles.includes(req.user.role)) {
            console.log("Acceso denegado. Rol:", req.user.role);
            return res.status(403).json({ message: "No estás autorizado" });
        }
        next();
    };
};
