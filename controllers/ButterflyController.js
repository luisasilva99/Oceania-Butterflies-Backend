import ButterflyModel from "../models/ButterflyModel.js";
import { validationResult } from 'express-validator';

// 🔄 Función para convertir de camelCase (frontend) a snake_case (DB)
const convertToDbFormat = (data) => {
    return {
        common_name: data.commonName,
        scientific_name: data.scientificName,
        family: data.family,
        region: data.region,
        specific_location: data.specificLocation,
        habitat: data.habitat,
        wingspan: data.wingspan,
        wingspan_unit: data.wingspanUnit,
        description: data.description,
        conservation_status: data.conservationStatus,
        threat_level: data.threatLevel,
        population: data.population,
        flight_season: data.flightSeason,
        host_plants: data.hostPlants,
        nectar_sources: data.nectarSources,
        behavior: data.behavior,
        coordinates: data.coordinates,
        color_primary: data.colorPrimary,
        tags: data.tags,
        public_id: data.publicId
    };
};

// 🔄 Función para convertir de snake_case (DB) a camelCase (frontend)
const convertToApiFormat = (data) => {
    const butterfly = data.toJSON ? data.toJSON() : data;
    return {
        id: butterfly.id,
        commonName: butterfly.common_name,
        scientificName: butterfly.scientific_name,
        family: butterfly.family,
        region: butterfly.region,
        specificLocation: butterfly.specific_location,
        habitat: butterfly.habitat,
        wingspan: butterfly.wingspan,
        wingspanUnit: butterfly.wingspan_unit,
        description: butterfly.description,
        conservationStatus: butterfly.conservation_status,
        threatLevel: butterfly.threat_level,
        population: butterfly.population,
        flightSeason: butterfly.flight_season || [],
        hostPlants: butterfly.host_plants || [],
        nectarSources: butterfly.nectar_sources || [],
        behavior: butterfly.behavior,
        coordinates: butterfly.coordinates,
        colorPrimary: butterfly.color_primary,
        tags: butterfly.tags || [],
        publicId: butterfly.public_id,
        createdAt: butterfly.createdAt,
        updatedAt: butterfly.updatedAt
    };
};

// 📋 GET - Obtener todas las mariposas
export const getAllButterflies = async (req, res) => {
    try {
        const butterflies = await ButterflyModel.findAll({
            order: [['common_name', 'ASC']] // Ordenar alfabéticamente
        });
        
        // Convertir a formato API (camelCase)
        const formattedButterflies = butterflies.map(convertToApiFormat);
        
        res.status(200).json({
            success: true,
            count: formattedButterflies.length,
            data: formattedButterflies
        });
        
    } catch (error) {
        console.error('Error al obtener mariposas:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al obtener las mariposas" 
        });
    }
};

// 📋 GET - Obtener una mariposa por ID
export const getButterflyById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const butterfly = await ButterflyModel.findByPk(id);
        
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        // Convertir a formato API (camelCase)
        const formattedButterfly = convertToApiFormat(butterfly);
        
        res.status(200).json({
            success: true,
            data: formattedButterfly
        });
        
    } catch (error) {
        console.error('Error al obtener mariposa:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};

// ✨ POST - Crear nueva mariposa
export const createButterfly = async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        // Convertir datos de camelCase a snake_case para la DB
        const dbData = convertToDbFormat(req.body);
        
        const newButterfly = await ButterflyModel.create(dbData);
        
        // Convertir respuesta a formato API
        const formattedButterfly = convertToApiFormat(newButterfly);
        
        res.status(201).json({
            success: true,
            message: 'Mariposa creada exitosamente',
            data: formattedButterfly
        });
        
    } catch (error) {
        console.error('Error al crear mariposa:', error);
        
        // Error de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al crear la mariposa" 
        });
    }
};

// 🔄 PUT - Actualizar mariposa por ID
export const updateButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        // Verificar si la mariposa existe
        const butterfly = await ButterflyModel.findByPk(id);
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        // Convertir datos de camelCase a snake_case para la DB
        const dbData = convertToDbFormat(req.body);
        
        // Actualizar
        await butterfly.update(dbData);
        
        // Convertir respuesta a formato API
        const formattedButterfly = convertToApiFormat(butterfly);
        
        res.status(200).json({
            success: true,
            message: 'Mariposa actualizada exitosamente',
            data: formattedButterfly
        });
        
    } catch (error) {
        console.error('Error al actualizar mariposa:', error);
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor al actualizar la mariposa" 
        });
    }
};

// 🗑️ DELETE - Eliminar mariposa por ID
export const deleteButterfly = async (req, res) => {
    try {
        const { id } = req.params;
        
        const butterfly = await ButterflyModel.findByPk(id);
        if (!butterfly) {
            return res.status(404).json({
                success: false,
                error: 'Mariposa no encontrada'
            });
        }
        
        await butterfly.destroy();
        
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

// 🌍 CONTROLADORES DE FILTRADO (BONUS)

// GET mariposas por región
export const getButterflyByRegion = async (req, res) => {
    try {
        const { region } = req.params;
        
        const butterflies = await ButterflyModel.findAll({
            where: { region },
            order: [['common_name', 'ASC']]
        });
        
        // Convertir a formato API
        const formattedButterflies = butterflies.map(convertToApiFormat);
        
        res.status(200).json({
            success: true,
            count: formattedButterflies.length,
            region: region,
            data: formattedButterflies
        });
        
    } catch (error) {
        console.error('Error al obtener mariposas por región:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
};

// GET mariposas por familia
export const getButterflyByFamily = async (req, res) => {
    try {
        const { family } = req.params;
        
        const butterflies = await ButterflyModel.findAll({
            where: { family },
            order: [['common_name', 'ASC']]
        });
        
        // Convertir a formato API
        const formattedButterflies = butterflies.map(convertToApiFormat);
        
        res.status(200).json({
            success: true,
            count: formattedButterflies.length,
            family: family,
            data: formattedButterflies
        });
        
    } catch (error) {
        console.error('Error al obtener mariposas por familia:', error);
        res.status(500).json({ 
            success: false,
            error: "Error interno del servidor" 
        });
    }
}; 