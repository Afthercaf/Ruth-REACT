import { config } from "dotenv";
config();


export const database = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    connectTimeout: 20000, // Aumenta el tiempo de espera a 20 segundos
};



export const PORT =  4000;

export const TOKEN_SECRET = 'some secret key';