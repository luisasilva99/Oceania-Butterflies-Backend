import express from 'express'
import { 
<<<<<<< HEAD
    getAllButterflies, 
    getOneButterfly,
=======
    getAllButterfly, 
>>>>>>> d3dae850be73d715ee215db1ab7a7131a2b55548
    createButterfly, 
    deleteButterfly, 
    updateButterfly
} from "../controllers/ButterflyController.js"

const butterflyRouter = express.Router()

// GET - Obtener todos las mariposas
<<<<<<< HEAD
butterflyRouter.get('/', getAllButterflies)

// GET - Obtener una mariposa por ID
butterflyRouter.get('/:id', getOneButterfly)
=======
butterflyRouter.get('/', getAllButterfly)
>>>>>>> d3dae850be73d715ee215db1ab7a7131a2b55548

// POST - Crear una nueva mariposa
butterflyRouter.post('/', createButterfly)

// PUT - Actualizar una mariposa por ID
butterflyRouter.put('/:id', updateButterfly)

// DELETE - Eliminar una mariposa por ID
butterflyRouter.delete('/:id', deleteButterfly)

export default butterflyRouter