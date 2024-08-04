// src/controllers/auth.controller.js

import { pool } from "../databasec/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createAccessToken } from "../lib/helpers.js";



export const signUp = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const [userFound] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userFound.length > 0) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO users SET ?", {
      fullname,
      email,
      password: passwordHash,
      role: 'user' // Mantenemos el rol de usuario por defecto para simplificar
    });

    const user = {
      id: result.insertId,
      fullname,
      email,
      role: 'user'
    };

    const token = await createAccessToken({ id: user.id, role: user.role });
    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV,
      secure: process.env.NODE_ENV,
      sameSite: "none",
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET no está definido en el archivo .env");
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "El correo electrónico no existe" });
    }

    const userFound = users[0];
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return res.status(400).json({ message: "La contraseña es incorrecta" });
    }

    const token = jwt.sign(
      { id: userFound.id, role: userFound.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15d' }
    );

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV,
      secure: process.env.NODE_ENV,
      sameSite: "none",
    });

    res.json({
      id: userFound.id,
      fullname: userFound.fullname,
      email: userFound.email,
      role: userFound.role,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

