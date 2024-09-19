import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminPanelRequest, 
  getProductsRequest, 
  getLogsRequest, 
  addProductRequest, 
  deleteProductRequest, 
  updateProductRequest, 
  deleteUserRequest 
} from '../AuthP/admin.api';
import { useAuth } from '../context/authContext';

const PanelAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [paginaProductos, setPaginaProductos] = useState(1);
  const [paginaRegistros, setPaginaRegistros] = useState(1); // Añadido para paginación de registros
  const elementosPorPagina = 5; // Ajusta aquí a 7 elementos por página

  const [productoActual, setProductoActual] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/signin');
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

  const handleEditarProducto = (producto) => {
    setProductoActual(producto);
    setMostrarModal(true);
  };

  const handleActualizarProducto = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);
    
    try {
      await updateProductRequest(productoActual.id, productData);
      const respuestaProductos = await getProductsRequest();
      setProductos(respuestaProductos.data.products || []);
      setMostrarModal(false);
    } catch (error) {
      console.error('Error al actualizar producto', error);
      setError('Error al actualizar el producto. Por favor, intente de nuevo.');
    }
  };

  // Funciones para la paginación de usuarios
  const paginaAnteriorUsuarios = () => {
    setPaginaUsuarios(prev => Math.max(prev - 1, 1));
  };

  const paginaSiguienteUsuarios = () => {
    setPaginaUsuarios(prev => (prev * elementosPorPagina < usuarios.length ? prev + 1 : prev));
  };

  // Funciones para la paginación de productos
  const paginaAnteriorProductos = () => {
    setPaginaProductos(prev => Math.max(prev - 1, 1));
  };

  const paginaSiguienteProductos = () => {
    setPaginaProductos(prev => (prev * elementosPorPagina < productos.length ? prev + 1 : prev));
  };

  // Funciones para la paginación de registros
  const paginaAnteriorRegistros = () => {
    setPaginaRegistros(prev => Math.max(prev - 1, 1));
  };

  const paginaSiguienteRegistros = () => {
    setPaginaRegistros(prev => (prev * elementosPorPagina < registros.length ? prev + 1 : prev));
  };

  // Datos paginados
  const usuariosPaginados = usuarios.slice((paginaUsuarios - 1) * elementosPorPagina, paginaUsuarios * elementosPorPagina);
  const productosPaginados = productos.slice((paginaProductos - 1) * elementosPorPagina, paginaProductos * elementosPorPagina);
  const registrosPaginados = registros.slice((paginaRegistros - 1) * elementosPorPagina, paginaRegistros * elementosPorPagina);

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
                    <button onClick={() => handleEditarProducto(producto)} className="btn btn-warning btn-sm">Editar</button>
                    <button onClick={() => handleEliminarProducto(producto.id)} className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <button onClick={paginaAnteriorProductos} className="btn btn-secondary" disabled={paginaProductos === 1}>Anterior</button>
            <button onClick={paginaSiguienteProductos} className="btn btn-secondary" disabled={paginaProductos * elementosPorPagina >= productos.length}>Siguiente</button>
          </div>
        </div>
      ) : (
        <p>No hay productos para mostrar.</p>
      )}

      {/* Tabla de Usuarios */}
      <h3>Lista de Usuarios</h3>
      {usuarios.length > 0 ? (
        <div>
          <table className="table table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.fullname}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <button onClick={() => handleEliminarUsuario(usuario.id)} className="btn btn-danger btn-sm">Eliminar Usuario</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <button onClick={paginaAnteriorUsuarios} className="btn btn-secondary" disabled={paginaUsuarios === 1}>Anterior</button>
            <button onClick={paginaSiguienteUsuarios} className="btn btn-secondary" disabled={paginaUsuarios * elementosPorPagina >= usuarios.length}>Siguiente</button>
          </div>
        </div>
      ) : (
        <p>No hay usuarios para mostrar.</p>
      )}

{/* Tabla de Registros */}
<h3>Registros</h3>
{registros.length > 0 ? (
  <div>
    <table className="table table-dark">
      <thead>
        <tr>
          <th>ID</th>
          <th>ID de Usuario</th>
          <th>Acción</th>
          <th>Fecha y Hora</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody>
        {registrosPaginados.map(registro => (
          <tr key={registro.id}>
            <td>{registro.id}</td>
            <td>{registro.user_id}</td>
            <td>{registro.action}</td>
            <td>{new Date(registro.timestamp).toLocaleString()}</td>
            <td>{registro.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="d-flex justify-content-between">
      <button onClick={paginaAnteriorRegistros} className="btn btn-secondary" disabled={paginaRegistros === 1}>Anterior</button>
      <button onClick={paginaSiguienteRegistros} className="btn btn-secondary" disabled={paginaRegistros * elementosPorPagina >= registros.length}>Siguiente</button>
    </div>
  </div>
) : (
  <p>No hay registros para mostrar.</p>
)}


      {/* Modal para editar producto */}
      {mostrarModal && productoActual && (
        <div className="modal show" style={{ display: 'block' }} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button type="button" className="close" onClick={() => setMostrarModal(false)}>&times;</button>
              </div>
              <form onSubmit={handleActualizarProducto}>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <input type="text" name="name" className="form-control" defaultValue={productoActual.name} placeholder="Nombre del producto" required />
                  </div>
                  <div className="form-group mb-3">
                    <textarea name="description" className="form-control" defaultValue={productoActual.description} placeholder="Descripción" required></textarea>
                  </div>
                  <div className="form-group mb-3">
                    <input type="number" name="price" step="0.01" className="form-control" defaultValue={productoActual.price} placeholder="Precio" required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="number" name="quantity" className="form-control" defaultValue={productoActual.quantity} placeholder="Cantidad" required />
                  </div>
                  <div className="form-group mb-3">
                    <input type="text" name="image" className="form-control" defaultValue={productoActual.image} placeholder="URL de la imagen" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModal(false)}>Cerrar</button>
                  <button type="submit" className="btn btn-primary">Actualizar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdmin;


