import express from 'express'
import { 
    getAllButterflies, 
    getOneButterfly,
    createButterfly, 
    deleteButterfly, 
    updateButterfly
} from "../controllers/ButterflyController.js"

const butterflyRouter = express.Router()

// GET - Obtener todos las mariposas
butterflyRouter.get('/', getAllButterflies)

// GET - Obtener una mariposa por ID
butterflyRouter.get('/:id', getOneButterfly)

// POST - Crear una nueva mariposa
butterflyRouter.post('/', createButterfly)

// PUT - Actualizar una mariposa por ID
butterflyRouter.put('/:id', updateButterfly)

// DELETE - Eliminar una mariposa por ID
butterflyRouter.delete('/:id', deleteButterfly)

export default butterflyRouter