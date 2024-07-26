import { createContext, useContext, useState, useEffect } from 'react';
import { verifyTokenRequest } from '../AuthP/auth'; // Ajusta la ruta según tu estructura de carpetas
import Cookies from 'js-cookie';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarAdmin = async () => {
      const token = localStorage.getItem('token'); // Cambia esto si prefieres usar Cookies
      if (token) {
        try {
          const respuesta = await verifyTokenRequest(token);
          console.log('Respuesta de verificación:', respuesta.data);
          setEsAdmin(respuesta.data.role === 'admin');
        } catch (error) {
          console.error('Error al verificar el estado de administrador:', error);
          setEsAdmin(false);
        }
      } else {
        setEsAdmin(false);
      }
      setCargando(false);
    };
  
    verificarAdmin();
  }, []);

  const value = { esAdmin, cargando, setEsAdmin };

  return (
    <AdminContext.Provider value={value}>
      {cargando ? <div>Loading...</div> : children}
    </AdminContext.Provider>
  );
};
