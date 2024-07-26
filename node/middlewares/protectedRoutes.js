export const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/signin");
    return next();
  };
  
  export const isNotLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect("/");
    return next();
  }
  
  export const isAdmin = (req, res, next) => {
    console.log('user:', req.user); // Agrega esta línea para verificar el contenido de req.user
    if (req.isAuthenticated() && req.user?.role === 'admin') {
      return next();
    }
    return res.redirect('/signin');
  };
  
  
  import jwt from 'jsonwebtoken';

  export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Asume que el token está en el formato "Bearer <token>"
  
    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }
  
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido' });
      }
  
      req.user = user; // Guarda el usuario decodificado en la solicitud
      next(); // Continúa al siguiente middleware o ruta
    });
  };
