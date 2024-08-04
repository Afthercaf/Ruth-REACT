import axios from "./axios";

// Admin routes

// Get the admin panel data
export const getAdminPanelRequest = async () => axios.get("/admin/panel");

// Add a product
export const addProductRequest = async (formData) => axios.post("/admin/add-product", formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Delete a product by ID
export const deleteProductRequest = async (id) => axios.delete(`/admin/delete-product/${id}`);


export const updateProductRequest = async (id, productData) => 
  axios.post(`/admin/update-product/${id}`, productData);

// Delete a user by ID
export const deleteUserRequest = async (id) => axios.delete(`/admin/delete-user/${id}`);

// Get all products
export const getProductsRequest = async () => axios.get("/admin/products");

// Get logs
export const getLogsRequest = async () => axios.get("/admin/logs");
