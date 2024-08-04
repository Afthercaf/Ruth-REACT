import jwt from 'jsonwebtoken';
import { pool } from "../databasec/database.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Asumiendo 'Bearer <token>'

    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token inválido" });
      }

      const [users] = await pool.query(
        "SELECT id, fullname, email, role FROM users WHERE id = ?", 
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const user = users[0];
      res.json({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        token // Devolvemos el mismo token que recibimos
      });
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const refreshToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Lógica para generar un nuevo token
    const newToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15d' });
    res.json({ token: newToken });
  });
};