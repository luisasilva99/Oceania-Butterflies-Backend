import express from 'express';
import cors from 'cors';
import butterflyRouter from './routes/ButterflyRoutes.js';
import db_connection from './database/db_connection.js';
import ButterflyModel from './models/butterflyModel.js';

const app = express();

// Middleware
app.use(cors()); //permite peticiones desde cualquier dominio
app.use(express.json()); // Para leer JSON en peticiones
app.use(express.urlencoded({ extended: true })); // Para formularios

// Ruta raíz
app.get("/", (req, res) => {
  res.send("🦋 Butterfly API - ¡Bienvenido!");
});

// Rutas de la API
app.use('/butterflies', butterflyRouter); 

// Middleware de manejo de errores (opcional pero recomendado)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Ruta para manejar 404 - LÍNEA CORREGIDA
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuración de base de datos
(async () => {
    try {
        await db_connection.authenticate(); // Autentica la conexión a la base de datos
        console.log('🦋 Connected to database successfully!');
        
        // Sincroniza el modelo con la base de datos
        await ButterflyModel.sync({ force: false }); 
        console.log('🦋 Butterfly model synchronized');
        
        // Sincroniza todos los modelos con la base de datos
        await db_connection.sync({ force: false });
        console.log('🦋 All models synchronized');
        
    } catch (error) {
        console.error(`❌ Database error: ${error}`);
        // No cerramos la app automáticamente para evitar que Jest falle
        // process.exit(1);
    }
})();

// Configuración del puerto
const PORT = process.env.PORT || 8000;

export const server = app.listen(PORT, () => {
  console.log(`🚀 Butterfly API server running on http://localhost:${PORT}/`);
  console.log(`📖 Access butterflies at http://localhost:${PORT}/butterflies`);
});

export { app };