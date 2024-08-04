import jwt from 'jsonwebtoken';
import { pool } from "../databasec/database.js";
import { TOKEN_SECRET } from "../databasec/config.js";

// Obtener el perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);

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
      role: user.role
    });

  } catch (error) {
    console.error('Error en getUserProfile:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
      const [products] = await pool.query('SELECT * FROM products');
      res.json({ products });
  } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "Error al obtener productos", message: error.message });
  }
};


// Obtener un producto por ID
export const getProduct = async (req, res) => {
  try {
    const [products] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (products.length === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(products[0]);
  } catch (error) {
    console.error('Error en getProduct:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Crear una orden de compra
export const createOrder = async (req, res) => {
  try {
    const { productIds, quantities } = req.body;

    if (!Array.isArray(productIds) || !Array.isArray(quantities) || productIds.length !== quantities.length) {
      return res.status(400).json({ message: "Datos de la orden inválidos" });
    }

    // Obtener detalles de productos en una sola consulta
    const [products] = await pool.query("SELECT * FROM products WHERE id IN (?)", [productIds]);

    const orderItems = [];
    let total = 0;

    for (let i = 0; i < productIds.length; i++) {
      const product = products.find(p => p.id === productIds[i]);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${productIds[i]} no encontrado` });
      }

      const quantity = quantities[i];
      if (quantity > product.quantity) {
        return res.status(400).json({ message: `Cantidad no disponible para el producto ${product.name}` });
      }

      orderItems.push({
        productID: product.id,
        quantity,
        price: product.price,
        total: product.price * quantity,
      });

      total += product.price * quantity;

      // Actualizar la cantidad del producto en la base de datos
      await pool.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [quantity, product.id]);
    }

    // Crear la orden
    const [result] = await pool.query("INSERT INTO orders (userID, orderDate) VALUES (?, ?)", [
      req.user.id,
      new Date(),
    ]);

    const orderID = result.insertId;

    // Insertar los ítems de la orden con userID
    await Promise.all(orderItems.map(item => 
      pool.query("INSERT INTO orderDetails (orderID, productID, quantity, price, userID) VALUES (?, ?, ?, ?, ?)", [
        orderID,
        item.productID,
        item.quantity,
        item.price,
        req.user.id,
      ])
    ));

    res.json({ orderID, orderItems, total });
  } catch (error) {
    console.error('Error en createOrder:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener todas las órdenes del usuario autenticado
export const getUserOrders = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders WHERE userID = ?", [req.user.id]);
    res.json(orders);
  } catch (error) {
    console.error('Error en getUserOrders:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener una orden por ID
export const getOrder = async (req, res) => {
  try {
    const [orders] = await pool.query("SELECT * FROM orders WHERE orderID = ?", [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ message: "Orden no encontrada" });

    const [orderDetails] = await pool.query("SELECT * FROM orderDetails WHERE orderID = ?", [req.params.id]);

    res.json({ ...orders[0], items: orderDetails });
  } catch (error) {
    console.error('Error en getOrder:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar y obtener el usuario autenticado
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No se proporcionó token de autenticación" });

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error en verifyToken:', error);
    return res.status(401).json({ message: "Token inválido" });
  }
};
