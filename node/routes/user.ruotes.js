import express from 'express';
import { getUserProfile, getProducts, getProduct, createOrder, getUserOrders, getOrder, verifyToken } from '../controllers/user.controller.js';
import multer from "multer";
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'C:/Users/Afthercaft/Desktop/nodejs-mysql-links-master/src/public/img';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


const router = express.Router();

// Ruta para obtener todos los productos
router.get('/products', getProducts);

// Ruta para obtener un producto por ID
router.get('/products/:id', getProduct);

// Ruta para crear una orden de compra
router.post('/orders', verifyToken, createOrder);

// Ruta para obtener todas las órdenes del usuario autenticado
router.get('/orders', verifyToken, getUserOrders);

// Ruta para obtener una orden por ID
router.get('/orders/:id', verifyToken, getOrder);

export default router;
