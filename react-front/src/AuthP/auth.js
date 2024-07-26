// src/api/auth.js
import axios from 'axios';
import { API_URL } from '../api';

export const loginRequest = async (user) => {
  try {
    const response = await API_URL.post('/signin', user);
    return response;
  } catch (error) {
    console.error('Error during login request:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const registerRequest = async (user) => {
  try {
    const response = await API_URL.post('/signup', user);
    return response;
  } catch (error) {
    console.error('Error during registration request:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const verifyTokenRequest = async (token) => {
  try {
    const response = await axios.get('http://localhost:4000/Perfil', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error('Error during token verification request:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logoutRequest = async () => {
  try {
    const response = await API_URL.post('/logout');
    return response;
  } catch (error) {
    console.error('Error during logout request:', error.response ? error.response.data : error.message);
    throw error;
  }
};