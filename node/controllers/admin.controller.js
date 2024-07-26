import { pool } from "../Database/database.js";



export const renderAdminPanel = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE role = 'user'");
        const [products] = await pool.query("SELECT * FROM products");
        res.json({ users, products }); // Envía los datos como JSON
    } catch (error) {
        console.error("Error al obtener los datos del panel de administrador:", error);
        res.status(500).json({ error: "Error al obtener los datos del panel de administrador", message: error.message });
    }
};

export const addProduct = async (req, res) => {
    const { name, description, price, quantity, imageUrl } = req.body;
  
    try {
      await pool.query("INSERT INTO products SET ?", { name, description, price, quantity, image: imageUrl });
      res.json({ message: "Producto agregado exitosamente" });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      res.status(500).json({ error: "Error al agregar producto", message: error.message });
    }
  };
  
export const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price } = req.body;
        const image = req.file ? req.file.filename : req.body.current_image;
        await pool.query("UPDATE products SET ? WHERE id = ?", [{ name, description, price, image }, id]);
        await pool.query("INSERT INTO audit_logs SET ?", { user_id: req.user.id, action: 'Updated a product' });
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto", message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        
        await connection.beginTransaction();

        // Obtén los detalles del producto antes de eliminarlo
        const [productRows] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);
        if (productRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        const product = productRows[0];
        const productDetails = `Name: ${product.name}, Description: ${product.description}, Price: ${product.price}, Image: ${product.image}`;

        // Elimina el producto de la base de datos
        const [result] = await connection.query("DELETE FROM products WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Registra la acción en la tabla de auditoría sin el campo `product_id`
        const logEntry = {
            user_id: 'admin',
            action: 'Deleted a product',
            timestamp: new Date(),
            details: productDetails // Almacena los detalles del producto en el campo `details`
        };
        await connection.query("INSERT INTO audit_logs SET ?", logEntry);

        await connection.commit();
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        await connection.rollback();
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ error: "Error al eliminar producto", message: error.message });
    } finally {
        connection.release();
    }
};




export const viewUsers = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE role = 'user'");
        res.json({ users });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios", message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM users WHERE id = ?", [id]);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al eliminar usuario", message: error.message });
    }
};

export const getLogs = async (req, res) => {
    try {
        const [logs] = await pool.query("SELECT * FROM audit_logs");
        res.json({ logs });
    } catch (error) {
        console.error("Error al obtener logs de auditoría:", error);
        res.status(500).json({ error: "Error al obtener logs de auditoría", message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json({ products });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos", message: error.message });
    }
};
