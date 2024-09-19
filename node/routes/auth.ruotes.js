import { Router } from "express";
import { validator } from "../middlewares/validator.middleware.js"; 
import { signupSchema, signinSchema } from "../schemas/auth.schema.js"; 
import { signUp, signIn} from "../controllers/auth.controller.js"; 

const router = Router();

// Ruta para el registro de usuario
router.post('/signup', validator(signupSchema), signUp);

// Ruta para el inicio de sesión
router.post('/signin', validator(signinSchema), signIn);


export default router;
