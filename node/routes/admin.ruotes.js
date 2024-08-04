import { Router } from "express";
import { renderAdminPanel, addProduct, deleteProduct, updateProduct, deleteUser, getProducts, getLogs } from "../controllers/admin.controller.js";
import multer from "multer";


const router = Router();

// Multer disk storage configuration
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Admin routes
router.get("/panel", renderAdminPanel);
router.post("/add-product", upload.single('image'), addProduct);
router.delete("/delete-product/:id", deleteProduct);
router.post("/update-product/:id", updateProduct);
router.delete("/delete-user/:id", deleteUser);
router.get('/products', getProducts);
router.get('/logs', getLogs);

export default router;
