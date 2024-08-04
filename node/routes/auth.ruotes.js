import { Router } from "express";
import { getProfile } from "../controllers/global.router.js"; // Corregido el nombre de la función
import { validator } from "../middlewares/validator.middleware.js"; 
import { signupSchema, signinSchema } from "../schemas/auth.schema.js"; 
import { signUp, signIn} from "../controllers/auth.controller.js"; 

const router = Router();

// Ruta para el registro de usuario
router.post('/signup', validator(signupSchema), signUp);

// Ruta para el inicio de sesión
router.post('/signin', validator(signinSchema), signIn);


// Ruta para obtener el perfil del usuario (autenticado)
router.get("/profile", getProfile); // Corregido el nombre de la ruta


export default router;
