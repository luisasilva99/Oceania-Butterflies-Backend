import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

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
  }
);

db_connection.authenticate()
  .then(() => console.log("✅ Conexión establecida con éxito."))
  .catch((err) => console.error("❌ Error al conectar con la base de datos:", err));

export default db_connection;
