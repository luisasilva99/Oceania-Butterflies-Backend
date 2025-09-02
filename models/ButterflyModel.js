import { DataTypes } from "sequelize";
import db_connection from "../database/db_connection.js";

const ButterflyModel = db_connection.define('butterflies', {
    commonName: {
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
    scientificName: {
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
    family: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La familia es obligatoria'
            }
        }
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'La región es obligatoria'
            }
        }
    },
    specificLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    habitat: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    wingspan: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: {
                args: 0,
                msg: 'La envergadura debe ser un número positivo'
            }
        }
    },
    wingspanUnit: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'cm'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    conservationStatus: {
        type: DataTypes.ENUM('stable', 'declining', 'endangered', 'critical', 'extinct'),
        allowNull: true,
        defaultValue: 'stable'
    },
    threatLevel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    population: {
        type: DataTypes.STRING,
        allowNull: true
    },
    flightSeason: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    hostPlants: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    nectarSources: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    behavior: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    coordinates: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: null
    },
    colorPrimary: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: {
                args: /^#[0-9A-Fa-f]{6}$/,
                msg: 'Color primario debe ser un código hexadecimal válido (#RRGGBB)'
            }
        }
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'butterflies'
});

export default ButterflyModel;