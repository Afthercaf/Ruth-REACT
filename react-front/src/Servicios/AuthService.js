import axios from "axios";

const API_URL = "http://localhost:4000"; // Asegúrate de que esto sea correcto

export const signUp = async (fullname, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      fullname,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error during sign up", error);
    throw error;
  }
};

export const AuthService = {
  async signIn(email, password) {
    try {
      const response = await axios.post(`${API_URL}/signin`, { email, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      console.log('Current user:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`);
    AuthService.logout();
    return response.data;
  } catch (error) {
    console.error("Error during logout", error);
    throw error;
  }
};
