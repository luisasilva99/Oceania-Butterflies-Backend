import express from 'express'
import { 
    getAllButterfly, 
    createButterfly, 
    deleteButterfly, 
    updateButterfly
} from "../controllers/ButterflyController.js"

const butterflyRouter = express.Router()

// GET - Obtener todos las mariposas
butterflyRouter.get('/', getAllButterfly)

// POST - Crear una nueva mariposa
butterflyRouter.post('/', createButterfly)

// PUT - Actualizar una mariposa por ID
butterflyRouter.put('/:id', updateButterfly)

// DELETE - Eliminar una mariposa por ID
butterflyRouter.delete('/:id', deleteButterfly)

export default butterflyRouter