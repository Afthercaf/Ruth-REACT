import React, { useState, useEffect } from 'react';
import { getProductsRequest, createOrderRequest } from '../AuthP/products';
import '../App.css';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }
        const response = await getProductsRequest();
        console.log('Respuesta completa:', response);
        
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          throw new Error('La respuesta de la API no contiene un array de productos válido');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error al cargar los productos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      await createOrderRequest({ productIds: [productId], quantities: [quantity] });
      alert('¡Compra realizada con éxito!');
    } catch (error) {
      console.error('Error creating order:', error.response ? error.response.data : error.message);
      alert('Error al realizar la compra. Por favor, intenta de nuevo.');
    }
  };
  ;

  const handleQuantityChange = (e, productId) => {
    const quantity = parseInt(e.target.value, 10);
    setProducts(products.map(product => 
      product.id === productId ? { ...product, selectedQuantity: quantity } : product
    ));
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="product-list-container">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>
      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div>
                {product.image ? (
                  <img src={product.image} alt="Imagen del Producto" style={{ width: '100px', height: 'auto' }} />
                ) : (
                  <p>No disponible</p>
                )}
              </div>
              <h2 className="product-name">{product.name}</h2>
              <div className="product-info">
                <p className="product-price">${product.price}</p>
                <p className="product-quantity">Cantidad disponible: {product.quantity}</p>
              </div>
              <div className="product-action">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={product.selectedQuantity || 1}
                  onChange={(e) => handleQuantityChange(e, product.id)}
                  className="product-quantity-input"
                />
                <button
                  onClick={() => handleBuy(product.id, product.selectedQuantity || 1)}
                  className="product-buy-button"
                  disabled={product.quantity < 1}
                >
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
