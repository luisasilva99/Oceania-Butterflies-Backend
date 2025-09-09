import ButterflyModel from "../models/ButterflyModel.js";
import { validationResult } from 'express-validator';

// GET - Obtener todas las mariposas
export const getAllButterflies = async (req, res) => {
    try {
        // Buscar todas las mariposas en la BD y ordenarlas alfabéticamente
        const butterflies = await ButterflyModel.findAll({
            order: [['commonName', 'ASC']] // ASC = ascendente (A-Z)
        });
        
        // Responder con formato JSON estandarizado
        res.status(200).json({
            success: true,
            count: butterflies.length, // Número total de mariposas
            data: butterflies
        });
        
    } catch (error) {
        // Manejo de errores - siempre incluir try/catch en funciones async
        console.error('Error al obtener mariposas:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al obtener las mariposas" 
        });
    }
};

// GET - Obtener una mariposa por ID específico
export const getButterflyById = async (req, res) => {
    try {
        // Extraer el ID de los parámetros de la URL (ej: /butterflies/123)
        const { id } = req.params;
        
        // Buscar por clave primaria (Primary Key)
        const butterfly = await ButterflyModel.findByPk(id);
        
        // Verificar si la mariposa existe
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        // Responder con la mariposa encontrada
        res.status(200).json({
            success: true,
            data: butterfly
        });
        
    } catch (error) {
        console.error('Error al obtener mariposa:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};

// POST - Crear nueva mariposa
export const createButterfly = async (req, res) => {
    try {
        // Verificar errores de validación (vienen del middleware validator en routes)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, devolverlos al cliente
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada no válidos',
                errors: errors.array() // Lista de todos los errores encontrados
            });
        }
        
        // Crear nueva mariposa en la base de datos
        // req.body contiene todos los datos enviados por el cliente
        const newButterfly = await ButterflyModel.create(req.body);
        
        // Respuesta exitosa con el objeto creado
        res.status(201).json({
            success: true,
            message: 'Mariposa creada exitosamente',
            data: newButterfly
        });
        
    } catch (error) {
        console.error('Error al crear mariposa:', error);
        
        // Manejo específico de errores de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Error de validación de base de datos',
                details: error.errors.map(err => ({
                    field: err.path, // Campo que falló
                    message: err.message // Mensaje del error
                }))
            });
        }
        
        // Error de duplicado (ej: nombre científico repetido)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                error: 'Ya existe una mariposa con ese nombre científico'
            });
        }
        
        // Error genérico
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al crear la mariposa" 
        });
    }
};

// PUT - Actualizar mariposa por ID
export const updateButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar errores de validación (vienen del middleware validator en routes)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada no válidos',
                errors: errors.array()
            });
        }
        
        // Verificar si la mariposa existe antes de actualizar
        const butterfly = await ButterflyModel.findByPk(id);
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        // Actualizar con los nuevos datos
        await butterfly.update(req.body);
        
        // Devolver la mariposa actualizada
        res.status(200).json({
            success: true,
            message: 'Mariposa actualizada exitosamente',
            data: butterfly
        });
        
    } catch (error) {
        console.error('Error al actualizar mariposa:', error);
        
        // Mismo manejo de errores que en create
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Error de validación de base de datos',
                details: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                error: 'Ya existe una mariposa con ese nombre científico'
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al actualizar la mariposa" 
        });
    }
};

// DELETE - Eliminar mariposa por ID
export const deleteButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar la mariposa antes de eliminar
        const butterfly = await ButterflyModel.findByPk(id);
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        // Eliminar de la base de datos
        await butterfly.destroy();
        
        // Confirmación de eliminación
        res.status(200).json({
            success: true,
            message: 'Mariposa eliminada exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar mariposa:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al eliminar la mariposa" 
        });
    }
};

// CONTROLADORES DE FILTRADO (FUNCIONES BONUS)

// GET mariposas filtradas por región
export const getButterflyByRegion = async (req, res) => {
    try {
        // Obtener región de los parámetros de URL
        const { region } = req.params;
        
        // Buscar solo mariposas de esa región
        const butterflies = await ButterflyModel.findAll({
            where: { region }, // WHERE region = 'valor'
            order: [['commonName', 'ASC']]
        });
        
        res.status(200).json({
            success: true,
            count: butterflies.length,
            region: region, // Mostrar qué región se filtró
            data: butterflies
        });
        
    } catch (error) {
        console.error('Error al obtener mariposas por región:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};

// GET mariposas filtradas por familia
export const getButterflyByFamily = async (req, res) => {
    try {
        const { family } = req.params;
        
        // Buscar solo mariposas de esa familia
        const butterflies = await ButterflyModel.findAll({
            where: { family }, // WHERE family = 'valor'
            order: [['commonName', 'ASC']]
        });
        
        res.status(200).json({
            success: true,
            count: butterflies.length,
            family: family, // Mostrar qué familia se filtró
            data: butterflies
        });
        
    } catch (error) {
        console.error('Error al obtener mariposas por familia:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};