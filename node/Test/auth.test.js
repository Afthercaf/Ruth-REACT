// src/tests/auth.test.js

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes/auth.ruotes'; // Asegúrate de ajustar la ruta según tu estructura

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

describe('Auth Integration Tests', () => {
  let userToken = '';

  test('POST /api/signup should create a new user', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({
        fullname: 'Test1User',
        email: 'testuser1@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('fullname', 'Test1User');
    expect(response.body).toHaveProperty('email', 'testuser1@example.com');
    expect(response.body).toHaveProperty('role', 'user');
    expect(response.headers['set-cookie'][0]).toMatch(/token=.+/); // Check if token is set
  });

  test('POST /api/signin should authenticate user and return token', async () => {
    const response = await request(app)
      .post('/api/signin')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('fullname', 'Test User');
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
    expect(response.body).toHaveProperty('role', 'user');
    expect(response.body).toHaveProperty('token');
    
    userToken = response.body.token; // Save the token for further tests
  });

});
