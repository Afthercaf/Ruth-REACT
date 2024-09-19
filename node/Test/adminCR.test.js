import request from 'supertest';
import express from 'express';
import { pool } from '../databasec/database.js';
import routes from '../routes/admin.ruotes.js';

const app = express();
app.use(express.json());
app.use('/admin', routes);

describe('Admin Controller Integration Tests', () => {
  beforeAll(async () => {
    // Set up test database or mock as needed
    // For example, you might want to create test tables and insert some test data
  });

  afterAll(async () => {
    // Clean up test database or mocks
    await pool.end();
  });

  test('GET /admin/panel should return users', async () => {
    const response = await request(app).get('/admin/panel');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(Array.isArray(response.body.users)).toBe(true);
  }, 10000); // Increase timeout to 10000 ms
  

  test('POST /admin/add-product should add a new product', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      quantity: 10,
      imageUrl: 'http://example.com/image.jpg'
    };

    const response = await request(app)
      .post('/admin/add-product')
      .send(newProduct);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Producto agregado exitosamente');
  });

  test('GET /admin/products should return all products', async () => {
    const response = await request(app).get('/admin/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  test('DELETE /admin/delete-product/:id should delete a product', async () => {
    // First, add a product to delete
    const newProduct = {
      name: 'Product to Delete',
      description: 'This product will be deleted',
      price: 9.99,
      quantity: 5,
      imageUrl: 'http://example.com/delete.jpg'
    };
  
    const addResponse = await request(app)
      .post('/admin/add-product')
      .send(newProduct);
  
    const productId = addResponse.body.productId;
    console.log('Product ID:', productId);
  
    // Now, delete the product
    const deleteResponse = await request(app).delete(`/admin/delete-product/${productId}`);
    console.log('Delete Response Status:', deleteResponse.status);
    console.log('Delete Response Body:', deleteResponse.body);
  
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('message', 'Producto eliminado exitosamente');
  });
  
  

  test('GET /admin/logs should return audit logs', async () => {
    const response = await request(app).get('/admin/logs');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('logs');
    expect(Array.isArray(response.body.logs)).toBe(true);
  });
});