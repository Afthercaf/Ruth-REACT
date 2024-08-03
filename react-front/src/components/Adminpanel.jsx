import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminPanelRequest, 
  getProductsRequest, 
  getLogsRequest, 
  addProductRequest, 
  deleteProductRequest, 
  deleteUserRequest 
} from '../AuthP/admin.api';
import { useAuth } from '../context/authContext';
const PanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate();

  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [paginaProductos, setPaginaProductos] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/signin'); // Redirige si el usuario no está autenticado o no es un administrador
    } else {
      obtenerDatos();
    }
  }, [isAuthenticated, role, navigate]);

  const obtenerDatos = async () => {
    try {
      const [respuestaPanelAdmin, respuestaProductos, respuestaRegistros] = await Promise.all([
        getAdminPanelRequest(),
        getProductsRequest(),
        getLogsRequest(),
      ]);
      console.log('Respuesta Panel Admin:', respuestaPanelAdmin.data);
      console.log('Respuesta Productos:', respuestaProductos.data);
      console.log('Respuesta Registros:', respuestaRegistros.data);
  
      setUsuarios(respuestaPanelAdmin.data.users || []);
      setProductos(respuestaProductos.data.products || []);
      setRegistros(respuestaRegistros.data.logs || []);
      setError(null);
    } catch (error) {
      console.error('Error al obtener datos', error);
      setError('Error al cargar los datos. Por favor, intente de nuevo más tarde.');
      setUsuarios([]);
      setProductos([]);
      setRegistros([]);
    }
  };

  const handleAgregarProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      await addProductRequest(formData);
      // Recargar productos después de agregar
      const respuestaProductos = await getProductsRequest();
      setProductos(respuestaProductos.data.products || []);
    } catch (error) {
      console.error('Error al agregar producto', error);
      setError('Error al agregar el producto. Por favor, intente de nuevo.');
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await deleteProductRequest(id);
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto', error);
      setError('Error al eliminar el producto. Por favor, intente de nuevo.');
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      await deleteUserRequest(id);
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    } catch (error) {
      console.error('Error al eliminar usuario', error);
      setError('Error al eliminar el usuario. Por favor, intente de nuevo.');
    }
  };

  const paginaAnteriorUsuarios = () => {
    setPaginaUsuarios(prev => Math.max(prev - 1, 1));
  };

  const paginaSiguienteUsuarios = () => {
    setPaginaUsuarios(prev => (prev * elementosPorPagina < usuarios.length ? prev + 1 : prev));
  };

  const paginaAnteriorProductos = () => {
    setPaginaProductos(prev => Math.max(prev - 1, 1));
  };

  const paginaSiguienteProductos = () => {
    setPaginaProductos(prev => (prev * elementosPorPagina < productos.length ? prev + 1 : prev));
  };

  const usuariosPaginados = usuarios.slice((paginaUsuarios - 1) * elementosPorPagina, paginaUsuarios * elementosPorPagina);
  const productosPaginados = productos.slice((paginaProductos - 1) * elementosPorPagina, paginaProductos * elementosPorPagina);
  return (
    <div className="container p-4">
      <h1>Panel de Administración</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Formulario para agregar producto */}
      <div className="card bg-dark text-light mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">Agregar Nuevo Producto</h4>
          <form onSubmit={handleAgregarProducto}>
            <div className="form-group mb-3">
              <input type="text" name="name" className="form-control bg-dark text-light" placeholder="Nombre del producto" required />
            </div>
            <div className="form-group mb-3">
              <textarea name="description" className="form-control bg-dark text-light" placeholder="Descripción" required></textarea>
            </div>
            <div className="form-group mb-3">
              <input type="number" name="price" step="0.01" className="form-control bg-dark text-light" placeholder="Precio" required />
            </div>
            <div className="form-group mb-3">
              <input type="number" name="quantity" className="form-control bg-dark text-light" placeholder="Cantidad" required />
            </div>
            <div className="form-group mb-3">
              <input type="text" name="imageUrl" className="form-control bg-dark text-light" placeholder="URL de la imagen" required />
            </div>
            <button type="submit" className="btn btn-success">Guardar Producto</button>
          </form>
        </div>
      </div>

      {/* Tabla de Productos */}
      <h3>Lista de Productos</h3>
      {productos.length > 0 ? (
        <div>
          <table className="table table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Descripción</th>
                <th>Imagen</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.map(producto => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.name}</td>
                  <td>{producto.price}</td>
                  <td>{producto.description}</td>
                  <td>
                    {producto.image ? (
                      <img src={producto.image} alt="Imagen del Producto" style={{ width: '100px', height: 'auto' }} />
                    ) : (
                      <p>No disponible</p>
                    )}
                  </td>
                  <td>{producto.quantity}</td>
                  <td>
                    <button onClick={() => handleEliminarProducto(producto.id)} className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <button onClick={paginaAnteriorProductos} className="btn btn-primary">Anterior</button>
            <button onClick={paginaSiguienteProductos} className="btn btn-primary">Siguiente</button>
          </div>
        </div>
      ) : (
        <p>No hay productos para mostrar.</p>
      )}

      {/* Administrar Usuarios */}
      <h3>Administrar Usuarios</h3>
      {usuarios.length > 0 ? (
        <div>
          <ul className="list-group">
            {usuariosPaginados.map(usuario => (
              <li key={usuario.id} className="list-group-item d-flex justify-content-between align-items-center">
                {usuario.fullname} - {usuario.email}
                <button onClick={() => handleEliminarUsuario(usuario.id)} className="btn btn-danger btn-sm">Eliminar</button>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between">
            <button onClick={paginaAnteriorUsuarios} className="btn btn-primary">Anterior</button>
            <button onClick={paginaSiguienteUsuarios} className="btn btn-primary">Siguiente</button>
          </div>
        </div>
      ) : (
        <p>No hay usuarios para mostrar.</p>
      )}

      {/* Registros de Auditoría */}
      <h3 className="mt-4">Registros de Auditoría</h3>
      {registros.length > 0 ? (
        <ul className="list-group">
          {registros.map(registro => (
            <li key={registro.id} className="list-group-item">
              ID de Usuario: {registro.user_id} - Acción: {registro.action} - Fecha: {new Date(registro.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay registros de auditoría para mostrar.</p>
      )}
    </div>
  );
};

export default PanelAdmin;
