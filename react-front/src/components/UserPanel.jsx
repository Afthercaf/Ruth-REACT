// src/components/UserPanel.jsx
import React, { useState, useEffect } from 'react';
import { getUserOrdersRequest } from '../AuthP/products';

const UserPanel = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrdersRequest();
        setOrders(response.data);
      } catch (error) {
        console.error('Error al obtener las órdenes', error);
        setError('No se pudieron cargar las órdenes. Por favor, intenta de nuevo más tarde.');
      }
    };
    fetchOrders();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Panel de Usuario</h2>
      <h3>Tus Órdenes</h3>
      {orders.length === 0 ? (
        <p>No tienes órdenes aún.</p>
      ) : (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order.id} className="list-group-item d-flex align-items-center">
              <img src={order.imageUrl} alt={order.productName} className="img-thumbnail mr-3" style={{ width: '80px', height: '80px' }} />
              <div>
                <strong>{order.productName}</strong> - Cantidad: {order.quantity}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPanel;