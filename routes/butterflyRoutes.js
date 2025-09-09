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

// Importar las validaciones
import { butterflyValidator } from '../validators/butterflyValidator.js';

const butterflyRoutes = express.Router();

// ✅ ORDEN CORRECTO: Rutas específicas ANTES que rutas con parámetros

// RUTAS DE FILTRADO (DEBEN IR PRIMERO)
// GET mariposas por región
// Ruta: GET /butterflies/region/:region (ej: /butterflies/region/Oceania)
butterflyRoutes.get('/region/:region', getButterflyByRegion);

// GET mariposas por familia
// Ruta: GET /butterflies/family/:family (ej: /butterflies/family/Nymphalidae)
butterflyRoutes.get('/family/:family', getButterflyByFamily);

// RUTAS PRINCIPALES (CRUD)

// GET todas las mariposas
// Ruta: GET /butterflies
butterflyRoutes.get('/', getAllButterflies);

// GET mariposa por ID (DEBE IR AL FINAL)
// Ruta: GET /butterflies/:id (ej: /butterflies/1)
butterflyRoutes.get('/:id', getButterflyById);

// POST crear nueva mariposa (CON VALIDACIÓN)
// Ruta: POST /butterflies
butterflyRoutes.post('/', butterflyValidator, createButterfly);

// PUT actualizar mariposa por ID (CON VALIDACIÓN)
// Ruta: PUT /butterflies/:id
butterflyRoutes.put('/:id', butterflyValidator, updateButterfly);

// DELETE eliminar mariposa por ID
// Ruta: DELETE /butterflies/:id
butterflyRoutes.delete('/:id', deleteButterfly);

export default butterflyRoutes;