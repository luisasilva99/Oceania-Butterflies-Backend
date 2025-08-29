// Importamos lo necesario
import { Sequelize } from "sequelize";
import db_connection from "../database/db_connection.js";
const ButterflyModel = db_connection.define("Butterfly", {
    id:{
      
    },
    nombre:{

    },
    commonName: {

    },
    scientificName: {

    }, 
    family:{

    },
    region:{

    },
    specificLocation:{

    },
    habitat: {

    },
    winspan:{

    },
    wingspanUnit:{

    }, 
    description:{

    },
    conservationStatus:{

    },
    threatLevel:{

    },
    population:{

    },
    flightSeason:{

    },
    hostPlants:{

    },
    coordinates:{

    },
    colorPrimary:{

    },
    publicId:{

    }

})

export default ButterflyModel