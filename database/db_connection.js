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
      timestamps: false 
    }
  }
);

db_connection.authenticate()
  .then(() => console.log("✅ Connection established successfully."))
  .catch(err => console.error("❌ Error connecting to the database:", err));

export default db_connection;
