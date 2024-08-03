import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { verifyTokenRequest } from '../AuthP/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signin, setUser} = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userResponse = await verifyTokenRequest(token);
          if (userResponse.data) {
            setUser(userResponse.data);
            if (userResponse.data.role === 'admin') {
              navigate('/admin/panel', { replace: true });
            } else {
              navigate('/user', { replace: true });
            }
          }
        } catch (err) {
          console.error('Error verifying token:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
      }
    };

    checkAuthStatus();
  }, [navigate, setUser]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!email || !password) {
        setError('Email y contraseña son requeridos');
        return;
      }
      const response = await signin({ email, password });
      console.log('Login response:', response);

      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);

        const userResponse = await verifyTokenRequest(response.data.token);
        console.log('User response:', userResponse.data);

        if (setUser) {
          setUser(userResponse.data);
          localStorage.setItem('userData', JSON.stringify(userResponse.data));
        } else {
          console.warn('setUser is not available');
        }

        setError('');

        if (userResponse.data.role === 'admin') {
          console.log('Navigating to admin panel');
          navigate('/admin/panel', { replace: true });
        } else {
          console.log('Navigating to user page');
          navigate('/user', { replace: true });
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ha ocurrido un error inesperado.');
      }
    }
  };
  
  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <form onSubmit={handleLogin} className= "card card-body bg-dark text-white p-5">
            <h3 className="text-center fw-bold mb-4">Iniciar Sesión</h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="tuemail@correo.com"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              placeholder="Contraseña"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="btn btn-success btn-block">
              Iniciar Sesión
            </button>
          </form>

          <p className="fs-5 text-center text-white mt-3">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-info">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
