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

