// src/api/user.js
import axios from "./axios";

// Obtener el perfil del usuario autenticado
export const getUserProfileRequest = async () => axios.get("/user/profile");

// Obtener todos los productos
export const getProductsRequest = async () => axios.get("/user/products");

// Obtener un producto por ID
export const getProductRequest = async (id) => axios.get(`/user/products/${id}`);

// Crear una orden de compra

// Obtener todas las órdenes del usuario autenticado
export const getUserOrdersRequest = async () => axios.get("/user/orders");


export const createOrderRequest = async (orderData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  try {
    const response = await axios.post('/user/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Asegúrate de incluir el prefijo "Bearer "
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Obtener una orden por ID
export const getOrderRequest = async (id) => axios.get(`/user/orders/${id}`);

export const refreshTokenRequest = async () => {
  try {
    const response = await axios.post('/refresh-token');
    return response;
  } catch (error) {
    throw new Error('Error al refrescar el token');
  }
};