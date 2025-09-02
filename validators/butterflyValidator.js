import { body } from 'express-validator';

export const butterflyValidator = [
    // Validación del nombre común
    body('commonName')
        .notEmpty()
        .withMessage('El nombre común es obligatorio')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre común debe tener entre 2 y 100 caracteres')
        .trim(),
    
    // Validación del nombre científico
    body('scientificName')
        .notEmpty()
        .withMessage('El nombre científico es obligatorio')
        .isLength({ min: 2, max: 150 })
        .withMessage('El nombre científico debe tener entre 2 y 150 caracteres')
        .trim(),
    
    // Validación de la familia
    body('family')
        .notEmpty()
        .withMessage('La familia es obligatoria')
        .trim(),
    
    // Validación de la región
    body('region')
        .notEmpty()
        .withMessage('La región es obligatoria')
        .trim(),
    
    // Validaciones opcionales
    body('specificLocation')
        .optional()
        .trim(),
    
    body('habitat')
        .optional()
        .trim(),
    
    body('wingspan')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('La envergadura debe ser un número positivo'),
    
    body('wingspanUnit')
        .optional()
        .isIn(['cm', 'mm', 'in'])
        .withMessage('Unidad de envergadura debe ser: cm, mm o in'),
    
    body('conservationStatus')
        .optional()
        .isIn(['stable', 'declining', 'endangered', 'critical', 'extinct'])
        .withMessage('Estado de conservación no válido'),
    
    body('flightSeason')
        .optional()
        .isArray()
        .withMessage('La temporada de vuelo debe ser un array'),
    
    body('hostPlants')
        .optional()
        .isArray()
        .withMessage('Las plantas huésped deben ser un array'),
    
    body('nectarSources')
        .optional()
        .isArray()
        .withMessage('Las fuentes de néctar deben ser un array'),
    
    body('coordinates.latitude')
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitud debe estar entre -90 y 90'),
    
    body('coordinates.longitude')
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitud debe estar entre -180 y 180'),
    
    body('colorPrimary')
        .optional()
        .matches(/^#[0-9A-Fa-f]{6}$/)
        .withMessage('Color primario debe ser un código hexadecimal válido (#RRGGBB)'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags debe ser un array')
];