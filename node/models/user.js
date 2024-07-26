import { DataTypes, Sequelize } from 'sequelize';
import { database } from '../Database/config.js'; // Asegúrate de que la ruta sea correcta

// Crea una instancia de Sequelize
const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password,
  {
    host: database.host,
    dialect: 'mysql',
    logging: false, // Puedes habilitar el logging si lo necesitas
    pool: {
      max: database.connectionLimit,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: database.connectTimeout,
    },
  }
);

// Define el modelo User
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false, // Desactiva las marcas de tiempo
});

export default User;

