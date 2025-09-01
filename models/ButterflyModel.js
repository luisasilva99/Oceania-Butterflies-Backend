// Importamos lo necesario
import { DataTypes} from "sequelize";
import db_connection from "../database/db_connection.js";
const ButterflyModel = db_connection.define("Butterfly", {
    // id de la mariposa
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true // Es el id principal, 
    },
    // nombre de la mariposa
    commonName: {
        type: DataTypes.STRING, // para textos cortos
        allowNull: false
    },
    //nombre cientifico
    scientificName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    }, 
    //Familia
    family:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    //region de la mariposa
    region:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    //Locacion especifica
    specificLocation:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    //Habitad de la mariposa
    habitat: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Tamaño de la ala de la mariposa (es un numero)
    winspan:{
        type: DataTypes.DECIMAL(3,2),
        allowNull: false
    },
    // Unidad de medida de la ala de la mariposa (cm, mm, m, etc)
    wingspanUnit:{ // Numero 
        type: DataTypes.STRING,
        allowNull: false // que el campo es obligatorio
    }, 
    // descripcion de la mariposa
    description:{
        type: DataTypes.TEXT, // Para textos largos
        allowNull: false
    },
    // estado de conservacion de la mariposa
    conservationStatus:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // Nivel de preocupacion
    threatLevel:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // cantidad actual de la mariposa
    population:{
type: DataTypes.STRING,
        allowNull: false,
    },
    // Temporsada de vuelo (es un array de 6 datos)
    flightSeason:{
        type: DataTypes.STRING,
        defaultValue: false
    },
    // Es una array de dos datos
    hostPlants:{
        type: DataTypes.STRING,
        allowNull:false
    },
    // Es un array de 3 datos
    nectarSources:{
        type: DataTypes.STRING,
        defaultValue:false
// me faltan las validaciones
    },
    // Comportamiento de la mariposa (solo texto)
    behavior:{
        type: DataTypes.STRING,
        allowNull: false
    },
    // Coordenadas (es un objeto con )
    coordinates:{
        type:DataTypes.DECIMAL(2,4),
        defaultValue:{
            latitude: 0, 
            longitude: 0
        }

    },
    // Color primario
    colorPrimary:{
        type: DataTypes.STRING, 
        allowNull: false
    },
    // Tag (es un array de 4 datos)
    tags:{
        // Esto es como lo principal del codigo, el resto es para confirmacion o manejo de errores
        type: DataTypes.JSON,
        defaultValue: []
    
    },
    // Es para colocar la foto de la mariposa (se coloca como con uncodigo que le da cloudinary)
    publicId:{
        type: DataTypes.STRING,
        allowNull: false

    }

})

export default ButterflyModel