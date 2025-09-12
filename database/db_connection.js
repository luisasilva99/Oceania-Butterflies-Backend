import { Sequelize } from "sequelize";
import '@dotenvx/dotenvx/config'; 

const db_connection = new Sequelize(
  process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME,  //Utiliza DB_NAME_TEST en entorno de prueba   
  process.env.DB_USER,     
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,     
    dialect: process.env.DB_DIALECT, 
    port:process.env.DB_PORT,
    define: {
      timestamps: false 
    }
  }
);

db_connection.authenticate()
  .then(() => console.log("✅ Connection established successfully."))
  .catch(err => console.error("❌ Error connecting to the database:", err));

export default db_connection;