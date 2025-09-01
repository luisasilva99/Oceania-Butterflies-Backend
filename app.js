import express from "express";
import butterflyRoutes from "./routes/butterflyRoutes.js";
import db_connection from "./database/db_connection.js";
import ButterflyModel from "./models/ButterflyModel.js";
import cors from "cors"; // para permitir peticiones desde cualquier origen (el frontend)

export const app = express();

// Middleware
app.use(cors()); //permite peticiones desde cualquier dominio
app.use(express.json()); // Para leer JSON en peticiones
app.use(express.urlencoded({ extended: true })); // Para formularios

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🦋 Butterfly API - ¡Bienvenido!");
});

// Rutas de la API
app.use('/butterflies', butterflyRoutes); 

// Middleware de manejo de errores (opcional pero recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Ruta para manejar 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuración de base de datos
try {
    await db_connection.authenticate(); // Autentica la conexión a la base de datos
    console.log('🦋 Connected to database successfully!');
    
    await ButterflyModel.sync(); // Sincroniza el modelo con la base de datos
    console.log('🦋 Butterfly model synchronized');
    
    await db_connection.sync(); // Sincroniza todos los modelos con la base de datos
    console.log('🦋 All models synchronized');
    
} catch (error) {
    console.error(`❌ Database error: ${error}`);
    process.exit(1); // Termina la aplicación si no puede conectar a la DB
}

// Configuración del puerto
const PORT = process.env.PORT || 8000;

export const server = app.listen(PORT, () => {
  console.log(`🚀 Butterfly API server running on http://localhost:${PORT}/`);
  console.log(`📖 Access butterflies at http://localhost:${PORT}/butterflies`);
});