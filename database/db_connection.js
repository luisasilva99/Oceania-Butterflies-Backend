import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Obtener variables de entorno (todas vienen del .env)
const {
    DB_NAME,
    DB_NAME_TEST,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    DB_PORT,
    NODE_ENV
} = process.env;

// Decidir qué base de datos usar según el entorno
const currentDatabase = NODE_ENV === 'test' ? DB_NAME_TEST : DB_NAME;

// Validar que las variables críticas estén presentes
if (!currentDatabase) {
    console.error('❌ DB_NAME no está definida en las variables de entorno');
    process.exit(1);
}

if (!DB_USER) {
    console.error('❌ DB_USER no está definida en las variables de entorno');
    process.exit(1);
}

// Configuración de Sequelize
const db_connection = new Sequelize(currentDatabase, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: parseInt(DB_PORT) || 3306,
    dialect: DB_DIALECT,
    define: {
        timestamps: true // Mantiene createdAt y updatedAt
    },
    // Desactivar logs en testing, activar en desarrollo
    logging: NODE_ENV === 'test' ? false : (NODE_ENV === 'development' ? console.log : false),
    pool: {
        max: 10, // Máximo número de conexiones
        min: 0,  // Mínimo número de conexiones
        acquire: 30000, // Tiempo máximo para obtener conexión
        idle: 10000 // Tiempo máximo que una conexión puede estar inactiva
    },
    dialectOptions: {
        connectTimeout: 60000, // Timeout de conexión
        dateStrings: true,
        typeCast: true
    }
});

// Verificar conexión
const testConnection = async () => {
    try {
        await db_connection.authenticate();
        
        // Solo mostrar mensajes si NO estamos en testing
        if (NODE_ENV !== 'test') {
            console.log('✅ Conexión a la base de datos establecida correctamente');
            console.log(`📊 Base de datos: ${currentDatabase} en ${DB_HOST}:${DB_PORT || 3306}`);
            console.log(`🔧 Dialecto: ${DB_DIALECT}`);
            console.log(`🌍 Entorno: ${NODE_ENV || 'development'}`);
        }
        
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
        console.error('Verifica tus credenciales en el archivo .env');
        process.exit(1);
    }
};

// Ejecutar test de conexión solo si no estamos en modo test
if (NODE_ENV !== 'test') {
    testConnection();
}

export default db_connection;