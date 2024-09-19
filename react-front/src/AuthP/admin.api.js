import { API_URL } from '../api';
// Admin routes

// Get the admin panel data
export const getAdminPanelRequest = async () => API_URL.get("/admin/panel");

// Add a product
export const addProductRequest = async (formData) => API_URL.post("/admin/add-product", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Delete a product by ID
export const deleteProductRequest = async (id) => API_URL.delete(`/admin/delete-product/${id}`);


export const updateProductRequest = async (id, productData) => 
  API_URL.post(`/admin/update-product/${id}`, productData);

// Delete a user by ID
export const deleteUserRequest = async (id) => API_URL.delete(`/admin/delete-user/${id}`);

// Get all products
export const getProductsRequest = async () => API_URL.get("/admin/products");

// Get logs
export const getLogsRequest = async () => API_URL.get("/admin/logs");
