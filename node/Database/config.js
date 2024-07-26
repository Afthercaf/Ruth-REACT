import { config } from "dotenv";
config();

export const database = {
  
  host: "byvpcdvsjnucwwvbsx2j-mysql.services.clever-cloud.com",
  user: "uftqeqin9n8keva6",
  password: "6WKCHe7CyW7G9K9DcyYE",
  database: "byvpcdvsjnucwwvbsx2j",
  createDatabaseTable: true,
  connectionLimit: 10,
  waitForConnections: true,
  connectTimeout: 20000, // Aumenta el tiempo de espera a 20 segundos

};


export const PORT =  4000;

export const TOKEN_SECRET = 'some secret key';