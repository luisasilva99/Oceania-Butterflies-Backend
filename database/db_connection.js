import { Sequelize } from "sequelize";
import '@dotenvx/dotenvx/config';

const db_connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    define: {
      timestamps: false,
    },
    logging: console.log, 
  }
);

const initDB = async () => {
  try {
    await db_connection.authenticate();
    console.log("✅ Connection established successfully.");
    await db_connection.sync({ alter: true }); // crea las tablas si no existen o las actualiza
    console.log("✅ Tables synchronized successfully..");
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
  }
};

initDB();

export default db_connection;
