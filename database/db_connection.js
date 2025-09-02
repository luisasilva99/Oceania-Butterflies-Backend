import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno
// Si usas dotenvx, las variables ya estarán desencriptadas automáticamente
dotenv.config();

// Obtener variables de entorno con valores por defecto
const {
    DB_NAME = 'butterflies_app',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_HOST = 'localhost',
    DB_DIALECT = 'mysql',
    DB_PORT = 3306,
    NODE_ENV = 'development'
} = process.env;

// Validar que las variables críticas estén presentes
if (!DB_NAME) {
    console.error('❌ DB_NAME no está definida en las variables de entorno');
    process.exit(1);
}

if (!DB_USER) {
    console.error('❌ DB_USER no está definida en las variables de entorno');
    process.exit(1);
}

// Configuración de Sequelize
const db_connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: parseInt(DB_PORT) || 3306,
    dialect: DB_DIALECT,
    define: {
        timestamps: true // Mantiene createdAt y updatedAt
    },
    logging: NODE_ENV === 'development' ? console.log : false, // Solo logs en desarrollo
    pool: {
        max: 10, // Máximo número de conexiones
        min: 0,  // Mínimo número de conexiones
        acquire: 30000, // Tiempo máximo para obtener conexión
        idle: 10000 // Tiempo máximo que una conexión puede estar inactiva
    },
    dialectOptions: {
        connectTimeout: 60000, // Timeout de conexión
        acquireTimeout: 60000,
        timeout: 60000,
        // Configuraciones adicionales para MySQL
        dateStrings: true,
        typeCast: true
    }
});

// Verificar conexión
const testConnection = async () => {
    try {
        await db_connection.authenticate();
        console.log('🦋 Conexión a la base de datos establecida correctamente');
        console.log(`📊 Base de datos: ${DB_NAME} en ${DB_HOST}:${DB_PORT}`);
        console.log(`🔧 Dialecto: ${DB_DIALECT}`);
        
        if (NODE_ENV === 'development') {
            console.log(`👤 Usuario: ${DB_USER}`);
        }
        
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
        console.error('🔧 Verifica tus credenciales en el archivo .env');
        process.exit(1);
    }
};

// Ejecutar test de conexión solo si no estamos en modo test
if (NODE_ENV !== 'test') {
    testConnection();
}

export default db_connection;