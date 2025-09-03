import express from 'express'
import { 
    getAllButterflies,   
    getOneButterfly,      
    createButterfly, 
    deleteButterfly, 
    updateButterfly       
} from "../controllers/ButterflyController.js"

const butterflyRoutes = express.Router()

// GET - Obtener todas las mariposas
butterflyRoutes.get('/', getAllButterflies)

// GET - Obtener una mariposa por ID
butterflyRoutes.get('/:id', getOneButterfly)

// POST - Crear una nueva mariposa
butterflyRoutes.post('/', createButterfly)

// PUT - Actualizar una mariposa por ID
butterflyRoutes.put('/:id', updateButterfly)

// DELETE - Eliminar una mariposa por ID
butterflyRoutes.delete('/:id', deleteButterfly)

export default butterflyRoutes