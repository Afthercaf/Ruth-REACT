// test/setup.js
const mysql = require('mysql2/promise');
const { pool } = require('../databasec/database.js');

before(async () => {
    // Limpiar las tablas antes de las pruebas
    const connection = await pool.getConnection();
    await connection.query('TRUNCATE TABLE users');
    await connection.query('TRUNCATE TABLE products');
    await connection.query('TRUNCATE TABLE audit_logs');
    connection.release();
});
