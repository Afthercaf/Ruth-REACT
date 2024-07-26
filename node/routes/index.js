import { Router } from "express";
import authRoutes from "./auth.ruotes.js";
import indexRoutes from "./index.routes.js";
import userRoutes from "./user.ruotes.js";
import adminRoutes from "./admin.ruotes.js";
import redirectRoutes from "./redirection.ruotes.js";
import { getProfile,refreshToken } from "../controllers/global.router.js";
import {authenticateToken} from "../lib/helpers.js"

const router = Router();

router.use(indexRoutes);
router.use(authRoutes);

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/Perfil", getProfile);
router.post('/refresh-token', refreshToken,authenticateToken);
router.use(redirectRoutes);

export default router;
