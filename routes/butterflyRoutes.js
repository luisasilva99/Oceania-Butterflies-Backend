import express from 'express'
import { 
    getAllButterflies,   
    getOneButterfly,      
    createButterfly, 
    deleteButterfly, 
    updateButterfly       
} from "../controllers/ButterflyController.js"

import {
    validateOneButterfly, 
    validateAllButterflies,
    validateCreateButterfly,
    validarUpdateButterfly,
    validateDeleteButterfly
} from "../validations/ButterflyValidations.js"

const butterflyRoutes = express.Router()

// GET - Obtener todas las mariposas
butterflyRoutes.get('/', getAllButterflies, validateAllButterflies)

// GET - Obtener una mariposa por ID
butterflyRoutes.get('/:id', getOneButterfly, validateOneButterfly)

// POST - Crear una nueva mariposa
butterflyRoutes.post('/', createButterfly, validateCreateButterfly)

// PUT - Actualizar una mariposa por ID
butterflyRoutes.put('/:id', validarUpdateButterfly, updateButterfly)

// DELETE - Eliminar una mariposa por ID
butterflyRoutes.delete('/:id', deleteButterfly, validateDeleteButterfly)

export default butterflyRoutes