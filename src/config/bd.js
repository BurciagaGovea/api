import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import User from "../models/userModel.js"; // Importa los modelos para que se creen automáticamente

// Cargar variables de entorno
dotenv.config();

console.log("HOLDB_HOST:", `"${process.env.MYSQLDB_HOST}"`);
console.log("DB_USER:", `"${process.env.MYSQL_USER}"`);
console.log("DB_PASSWORD:", `"${process.env.MYSQL_PASSWORD}"`);
console.log("DB_NAME:", `"${process.env.MYSQL_DATABASE}"`);
console.log("DB_PORT:", `"${process.env.MYSQL_DOCKER_PORT}"`);

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQLDB_HOST,
        port: process.env.MYSQL_DOCKER_PORT || 3306,
        dialect: 'mysql',
        logging: false, // No imprimir logs de Sequelize
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        retry: {
            max: 3 // Intentará reconectar si falla la conexión
        }
    }
);

const initDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión exitosa a la base de datos");

        // Sincronizar el modelo User (creará la tabla si no existe)
        await User.sync({ alter: true });
        console.log("✅ Tabla 'users' sincronizada correctamente");
    } catch (err) {
        console.error("❌ Error en la conexión a la base de datos:", err);
        process.exit(1); // Detener la aplicación si la conexión falla
    }
};

initDB();

export default sequelize;
