import { Router } from "express";
import{auth }from "../middlewares/auth.middleware.js";
import { renderAdminPanel, addProduct, deleteProduct, updateProduct, deleteUser, getProducts, getLogs } from "../controllers/admin.controller.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';

const router = Router();

// Multer disk storage configuration
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

// Admin routes
router.get("/panel", renderAdminPanel);
router.post("/add-product", upload.single('image'), addProduct);
router.delete("/delete-product/:id", deleteProduct);
router.post("/update-product/:id", upload.single('image'), updateProduct);
router.delete("/delete-user/:id", deleteUser);
router.get('/products', getProducts);
router.get('/logs', getLogs);

export default router;
