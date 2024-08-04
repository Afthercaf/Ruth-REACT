import { pool } from "../databasec/database.js";



export const renderAdminPanel = async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM users WHERE role = 'user'");
        
        res.json({ users}); // Envía los datos como JSON
    } catch (error) {
        console.error("Error al obtener los datos del panel de administrador:", error);
        res.status(500).json({ error: "Error al obtener los datos del panel de administrador", message: error.message });
    }
};

export const addProduct = async (req, res) => {
    const { name, description, price, quantity, imageUrl } = req.body;
    let connection;
  
    try {
        connection = await pool.getConnection(); // Obtén la conexión del pool
        await connection.beginTransaction(); // Inicia la transacción

        // Inserta el nuevo producto
        await connection.query("INSERT INTO products SET ?", { name, description, price, quantity, image: imageUrl });
        
        // Registra la acción en la tabla de auditoría
        const logEntry = {
            user_id: 'admin',
            action: 'Added a product',
            timestamp: new Date(),
            details: `Producto: ${name}, Descripción: ${description}, Precio: ${price}, Cantidad: ${quantity}, Imagen: ${imageUrl}`
        };
        await connection.query("INSERT INTO audit_logs SET ?", logEntry);

        await connection.commit(); // Confirma la transacción
        res.json({ message: "Producto agregado exitosamente" });
    } catch (error) {
        if (connection) {
            await connection.rollback(); // Revertir la transacción en caso de error
        }
        console.error("Error al agregar producto:", error);
        res.status(500).json({ error: "Error al agregar producto", message: error.message });
    } finally {
        if (connection) {
            connection.release(); // Libera la conexión
        }
    }
};


  
export const updateProduct = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;
        const { name, description, price, quantity, image } = req.body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Actualiza el producto
        await connection.query(
            "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image = ? WHERE id = ?",
            [name, description, price, quantity, image, id]
        );

        // Registra la acción en la tabla de auditoría
        const logEntry = {
            user_id: 'admin',
            action: 'Updated a product',
            timestamp: new Date(),
            details: `Producto ID: ${id}, Nombre: ${name}, Descripción: ${description}, Precio: ${price}, Cantidad: ${quantity}, Imagen: ${image}`
        };
        await connection.query("INSERT INTO audit_logs SET ?", logEntry);

        await connection.commit();
        res.json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ error: "Error al actualizar producto", message: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
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
