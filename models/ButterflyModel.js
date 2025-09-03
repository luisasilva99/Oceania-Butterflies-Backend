// Importamos lo necesario
import { DataTypes} from "sequelize";
import db_connection from "../database/db_connection.js";
const ButterflyModel = db_connection.define('Butterfly', {
    // id de la mariposa
    id:{
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true // Es el id principal
    },
    // nombre de la mariposa
    // Obligatorio
    commonName: {
        type: DataTypes.STRING, // para textos cortos
        allowNull: false
    },
    //nombre cientifico
    // Obligatorio
    scientificName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    }, 
    //Familia
    // Obligatorio
    family:{
        type: DataTypes.STRING,
        allowNull: false
    },
    //region de la mariposa
    // Region 
    region:{
        type: DataTypes.STRING
    },
    //Locacion especifica
    specificLocation:{
        type: DataTypes.STRING,
    },
    //Habitad de la mariposa
    habitat: {
        type: DataTypes.STRING,
    },
    // Tamaño de la ala de la mariposa (es un numero)
    winspan:{
        type: DataTypes.DECIMAL(3,2),
    },
    // Unidad de medida de la ala de la mariposa (cm, mm, m, etc)
    wingspanUnit:{ // Numero 
        type: DataTypes.STRING,
    }, 
    // descripcion de la mariposa
    description:{
        type: DataTypes.TEXT, // Para textos largos
    },
    // estado de conservacion de la mariposa
    conservationStatus:{
        type: DataTypes.STRING,
    },
    // Nivel de preocupacion
    // Obligatorio
    threatLevel:{
        type: DataTypes.STRING,
        allowNull: false
        
    },
    // cantidad actual de la mariposa
    population:{
        type: DataTypes.STRING,
    
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
        
    },
    // Tag (es un array de 4 datos)
    tags:{
        // Esto es como lo principal del codigo, el resto es para confirmacion o manejo de errores
        type: DataTypes.STRING
    
    },
    // Es para colocar la foto de la mariposa (se coloca como con uncodigo que le da cloudinary)
    publicId:{
        type: DataTypes.STRING,
        

    }

})

export default ButterflyModel