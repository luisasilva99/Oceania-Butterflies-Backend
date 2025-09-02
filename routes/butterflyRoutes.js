import express from 'express';
import { 
    getAllButterflies, 
    getButterflyById, 
    createButterfly, 
    updateButterfly, 
    deleteButterfly,
    getButterflyByRegion,
    getButterflyByFamily 
} from '../controllers/ButterflyController.js';
import { butterflyValidator } from '../validators/butterflyValidator.js';

const butterflyRoutes = express.Router();

// 📋 RUTAS PRINCIPALES (CRUD)

// GET todas las mariposas
butterflyRoutes.get('/', getAllButterflies);

// GET mariposa por ID
butterflyRoutes.get('/:id', getButterflyById);

// POST crear nueva mariposa (con validación)
butterflyRoutes.post('/', butterflyValidator, createButterfly);

// PUT actualizar mariposa por ID (con validación)
butterflyRoutes.put('/:id', butterflyValidator, updateButterfly);

// DELETE eliminar mariposa por ID
butterflyRoutes.delete('/:id', deleteButterfly);

// 🔍 RUTAS DE FILTRADO (BONUS)

// GET mariposas por región
butterflyRoutes.get('/region/:region', getButterflyByRegion);

// GET mariposas por familia
butterflyRoutes.get('/family/:family', getButterflyByFamily);

export default butterflyRoutes;