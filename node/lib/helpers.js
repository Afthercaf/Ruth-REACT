import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../Database/config.js';

export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  console.error('ACCESS_TOKEN_SECRET no está definido en las variables de entorno');
  process.exit(1); // Salir del proceso si la variable no está definida
}

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.error('Token no proporcionado en la cabecera de autorización');
    return res.sendStatus(401); // No autorizado
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.sendStatus(403); // Prohibido
    }

    req.user = user;
    next();
  });
};


import bcrypt from "bcryptjs";

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const matchPassword = async (password, savedPassword) =>
  await bcrypt.compare(password, savedPassword);