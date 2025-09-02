import express from 'express';
import cors from 'cors';
import butterflyRouter from './routes/ButterflyRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/butterflies', butterflyRouter);

// Solo levantamos el servidor si este archivo se ejecuta directamente
let server = null;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export { app, server };
