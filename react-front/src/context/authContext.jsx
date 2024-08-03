// authContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../AuthP/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const ERROR_TIMEOUT = 5000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(''); // Agrega estado para el rol del usuario

  useEffect(() => {
    let timer;
    if (errors.length > 0) {
      timer = setTimeout(() => {
        setErrors([]);
      }, ERROR_TIMEOUT);
    }
    return () => clearTimeout(timer);
  }, [errors]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      const { userData, token } = res.data;
      // Se asume que userData.id es generado automáticamente y no es necesario pasarlo en la solicitud
      setUser({ id: userData.id, fullname: userData.fullname, username: userData.username });
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData.id);
      setRole(userData.role); // Establece el rol del usuario después de registrarse
    } catch (error) {
      console.error("Error during signup:", error.response?.data || error.message);
      setErrors([error.response?.data?.message || "Unknown error"]);
    }
  };
  

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      const { id, fullname, username, token, role } = res.data; // Extrae el rol desde la respuesta
      setUser({ id, fullname, username });
      setIsAuthenticated(true);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      setRole(role); // Establece el rol del usuario después de iniciar sesión
      return res;
    } catch (error) {
      console.error("Error during signin:", error.response?.data || error.message);
      setErrors([error.response?.data?.message || "Unknown error"]);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    setIsAuthenticated(false);
    setRole(''); // Limpia el rol al cerrar sesión
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(token);
        if (res.data) {
          setIsAuthenticated(true);
          setUser({ id: userId });
          setRole(res.data.role); // Establece el rol del usuario después de verificar el token
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error during token verification:", error.response?.data || error.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const value = {
    user,
    setUser,
    signup,
    signin,
    logout,
    isAuthenticated,
    errors,
    loading,
    role, // Exponer el rol en el valor del contexto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
