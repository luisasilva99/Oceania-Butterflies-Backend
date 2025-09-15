# Oceania-Butterflies-Backend

API REST en **Node.js + Express** con **Sequelize** y **MySQL** para gestionar mariposas de Oceanía. Implementa las operaciones básicas de **CRUD** y persiste los datos en una tabla creada en **MySQL Workbench**.  
> Este repositorio corresponde a la **primera parte del trabajo** (fase SQL con Sequelize). Más adelante se integra con el frontend y se migrará a MongoDB en otra fase.

## Tecnologías
- Node.js, Express
- Sequelize (ORM) + mysql2 (driver)
- CORS
- Variables de entorno con **@dotenvx/dotenvx** (y soporte `dotenv`)
- Desarrollo con **nodemon**
- Tests con **Jest** + **Supertest**

## Requisitos
- Node.js ≥ 18
- MySQL ≥ 8 (o compatible)
- MySQL Workbench

## Estructura de carpetas

```
Oceania-Butterflies-Backend/
├─ app.js                   # Punto de entrada de la app Express
├─ .env                     # Variables de entorno (no subir a git)
├─ controllers/
│  └─ ButterflyController.js   # Lógica de negocio/CRUD
├─ database/
│  └─ db_connection.js         # Configuración Sequelize y conexión MySQL
├─ models/
│  └─ ButterflyModel.js        # Definición del modelo Sequelize
├─ routes/
│  └─ butterfliesRoutes.js      # Definición de rutas Express (API)
├─ validations/
│  └─ ButterflyValidations.js   # (Opcional) Validaciones de entrada
├─ test/
│  └─ butterflies.test.js      # Tests (Jest + Supertest)
├─ package.json
└─ README.md
```

**¿Para qué sirve cada carpeta?**
- **controllers/**: funciones que responden a cada endpoint (crear, leer, actualizar, borrar).
- **database/**: inicializa Sequelize, define la conexión a MySQL y sincroniza modelos.
- **models/**: definición de entidades/tablas con Sequelize (p. ej., `Butterfly`).
- **routes/**: mapea URLs a controladores (p. ej., `GET /api/butterflies` → `ButterflyController.index`).
- **validations/**: (si aplica) middlewares para validar body/params/query.
- **test/**: pruebas automatizadas de endpoints y casos de uso.

## Scripts (package.json)

```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watchAll --no-cache",
  "dev": "nodemon app.js"
}
```

- **Desarrollo**: `npm run dev` (levanta el servidor con recarga en caliente).
- **Tests**: `npm test`.

## Configuración de entorno

Crea un archivo **.env** en la raíz:

```
# Puerto de la API
PORT=3000

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=oceania_butterflies

# Opcional: entorno
NODE_ENV=development
```

> Puedes gestionar variables con **dotenvx**:
> - Ejecutar con: `npx dotenvx run -- npm run dev`
> - O simplemente usar `npm run dev` si ya cargas `.env` en `db_connection.js`.

## Instalación y ejecución

```bash
# 1) Clonar
git clone https://github.com/luisasilva99/Oceania-Butterflies-Backend.git
cd Oceania-Butterflies-Backend

# 2) Instalar dependencias
npm install

# 3) Configurar .env (ver sección anterior)

# 4) Crear la base de datos en MySQL (en consola o Workbench)
#    CREATE DATABASE oceania_butterflies CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 5) Levantar el servidor en desarrollo
npm run dev
# o con dotenvx:
# npx dotenvx run -- npm run dev
```

Por defecto la API se expone en `http://localhost:8000/butterflies` (ajustable vía `PORT`).

## Endpoints (ejemplo)

> Ajusta estos paths si en `routes/` usas otro prefijo.

**Butterflies**
- `GET /butterflies/` – Lista todas las mariposas.
- `GET ONE BUTTERFLY /butterflies/:id` – Obtiene una mariposa por ID.
- `POST /butterflies` – Crea una mariposa.
- `PUT /butterflies/:id` – Actualiza una mariposa.
- `DELETE /butterflies/:id` – Elimina una mariposa.


## Tests

- Los tests están en `test/` y usan **Jest** + **Supertest**.
- Ejecuta:  
  ```bash
  npm  run test
  ```

## CORS
Está habilitado **CORS** para permitir que el frontend consuma esta API desde otro origen durante el desarrollo.

## Notas sobre Sequelize

- La conexión y el `sync()` se gestionan en `database/db_connection.js`.  
- Asegúrate de que las credenciales y la base de datos existan antes de levantar el servidor.  
- Si usas `sequelize.sync({ alter: true })` o `force: true`, úsalo con cuidado (puede alterar/borrar tablas).

## Postman / Documentación de API
Aún **no** se ha adjuntado la colección de Postman.  
Cuando la tengas, añadiremos:
- Archivo `docs/Oceania-Butterflies.postman_collection.json`.
- Instrucciones para importarla en Postman/Insomnia.

## Roadmap
- [x] Fase 1: API con Express + Sequelize + MySQL (este repo).  
- [ ] Fase 2: Integración con frontend (React).  
- [ ] Fase 3: Migración a **MongoDB + Mongoose** y unificación.

## Autoría
- Repositorio: <https://github.com/luisasilva99/Oceania-Butterflies-Backend>  
- Este proyecto fue hecho por estudiantes de Factoria-F5.
