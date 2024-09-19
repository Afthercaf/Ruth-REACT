// src/api/user.js
import {API_URL} from "../api";

// Obtener el perfil del usuario autenticado
export const getUserProfileRequest = async () => API_URL.get("/user/profile");

// Obtener todos los productos
export const getProductsRequest = async () => API_URL.get("/user/products");

// Obtener un producto por ID
export const getProductRequest = async (id) => API_URL.get(`/user/products/${id}`);

// Crear una orden de compra

// Obtener todas las órdenes del usuario autenticado
export const getUserOrdersRequest = async () => API_URL.get("/user/orders");


export const createOrderRequest = async (orderData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  try {
    const response = await API_URL.post('/user/orders', orderData, {
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
export const getOrderRequest = async (id) => API_URL.get(`/user/orders/${id}`);

export const refreshTokenRequest = async () => {
  try {
    const response = await API_URL.post('/refresh-token');
    return response;
  } catch (error) {
    throw new Error('Error al refrescar el token');
  }
};