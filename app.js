import express from 'express';
import cors from 'cors';
import db_connection from './database/db_connection.js';
import butterflyRoutes from './routes/butterflyRoutes.js';

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
app.use('/butterflies', butterflyRoutes); 

// Middleware de manejo de errores (opcional pero recomendado para producción segura y depuración en desarrollo)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Ruta para manejar 404 - LÍNEA CORREGIDA antes había usado *, lo cual no es correcto en Express
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Configuración de base de datos
(async () => {
  try {
      await db_connection.authenticate();
      console.log('✅ Connection established successfully.');
      
      // Determinar si estamos en modo test
      const isTest = process.env.NODE_ENV === 'test' || 
                     db_connection.config.database.includes('test');
      
      // En modo test, forzar la creación de tablas
      const syncOptions = isTest ? { force: true } : { force: false };
      
      // Sincronizar todos los modelos
      await db_connection.sync(syncOptions);
      console.log('🦋 Database synchronized successfully');
      
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


