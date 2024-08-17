import { Router } from "express";
import { userModel } from "../daos/mongodb/models/user.model.js";
import { validate } from "../middlewares/validation.middleware.js";
import { authDto } from "../dtos/auth.dto.js";
import { userDto } from "../dtos/user.dto.js";
import { createHash } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import passport from "passport";

const router = Router();


router.post(
    "/login",
    validate(authDto),
    passport.authenticate("login", { session: false }),
    async (req, res) => {
        try {
            const { first_name, last_name, email, role } = req.user;

            const token = generateToken({ first_name, last_name, email, role });

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60, 
            });

            return res.status(200).json({ message: "Autenticado", token });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error al iniciar sesión", details: error.message });
        }
    }
);


router.get('/login-error', (req, res) => {
    res.status(401).json({ message: "No autorizado" });
});


router.post(
    "/register",
    validate(userDto),
    async (req, res) => {
        const { first_name, last_name, email, age, role, password, cart } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        try {
            const hashPassword = await createHash(password);

            const user = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: hashPassword,
                role,
                cart,
            });

            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Error al registrar usuario", details: error.message });
        }
    }
);


router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        try {
            return res.status(200).json({
                message: "Bienvenido",
                user: req.user,
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: "Error al obtener el usuario", details: error.message });
        }
    }
);

export default router;
