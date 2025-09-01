import { DataTypes } from "sequelize";
import db_connection from "../database/db_connection.js";

const ButterflyModel = db_connection.define('butterflies', {
    
    // Información básica
    common_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre común es obligatorio'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre común debe tener entre 2 y 100 caracteres'
            }
        }
    },
    
    scientific_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'El nombre científico es obligatorio'
            },
            len: {
                args: [2, 150],
                msg: 'El nombre científico debe tener entre 2 y 150 caracteres'
            }
        }
    },
    
    // Taxonomía
    family: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La familia es obligatoria'
            }
        }
    },
    
    // Ubicación y distribución
    region: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La región es obligatoria'
            }
        }
    },
    
    specific_location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    habitat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Características físicas
    wingspan: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: true,
        validate: {
            min: {
                args: 0,
                msg: 'La envergadura debe ser un número positivo'
            }
        }
    },
    
    wingspan_unit: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'cm'
    },
    
    // Descripción
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Estado de conservación
    conservation_status: {
        type: DataTypes.ENUM('stable', 'declining', 'endangered', 'critical', 'extinct'),
        allowNull: true,
        defaultValue: 'stable'
    },
    
    threat_level: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    population: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    // Temporadas y comportamiento (JSON arrays)
    flight_season: {
        type: DataTypes.JSON, // Array de meses
        allowNull: true,
        defaultValue: []
    },
    
    host_plants: {
        type: DataTypes.JSON, // Array de plantas huésped
        allowNull: true,
        defaultValue: []
    },
    
    nectar_sources: {
        type: DataTypes.JSON, // Array de fuentes de néctar
        allowNull: true,
        defaultValue: []
    },
    
    behavior: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
    // Coordenadas geográficas (JSON object)
    coordinates: {
        type: DataTypes.JSON, // {latitude: number, longitude: number}
        allowNull: true,
        defaultValue: null
    },
    
    // Color primario (código hexadecimal)
    color_primary: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^#[0-9A-Fa-f]{6}$/,
                msg: 'Color primario debe ser un código hexadecimal válido (#RRGGBB)'
            }
        }
    },
    
    // Tags/etiquetas (JSON array)
    tags: {
        type: DataTypes.JSON, // Array de strings
        allowNull: true,
        defaultValue: []
    },
    
    // ID público (para Cloudinary u otro servicio)
    public_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, {
    timestamps: true, // Mantiene createdAt y updatedAt automáticamente
    tableName: 'butterflies' // Nombre explícito de la tabla
});

export default ButterflyModel;