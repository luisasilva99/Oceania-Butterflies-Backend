import request from 'supertest';
import { app, server } from '../app.js';
import ButterflyModel from '../models/ButterflyModel.js';

// Datos de prueba usando tu formato JSON
const testButterfly = {
    commonName: "Mariposa Monarca Test",
    scientificName: "Danaus plexippus test",
    family: "Nymphalidae",
    region: "América del Norte",
    specificLocation: "México, Michoacán",
    habitat: "Bosques de oyamel",
    wingspan: 10.5,
    wingspanUnit: "cm",
    description: "Mariposa migratoria famosa por sus viajes épicos",
    conservationStatus: "stable",
    threatLevel: "preocupación menor",
    population: "abundante",
    flightSeason: ["septiembre", "octubre", "noviembre", "diciembre"],
    hostPlants: ["Asclepias speciosa", "Asclepias curassavica"],
    nectarSources: ["Solidago", "Aster", "Buddleia"],
    behavior: "Migración masiva hacia el sur en invierno",
    coordinates: {
        latitude: 19.5665,
        longitude: -100.3896
    },
    colorPrimary: "#FF6B35",
    tags: ["migratoria", "icónica", "monarca", "méxico"],
    publicId: "test_butterfly_id"
};

describe('🦋 Butterfly API Tests', () => {
    let butterflyId;

    // Limpiar base de datos antes de las pruebas
    beforeAll(async () => {
        await ButterflyModel.sync({ force: true });
    });

    // Cerrar servidor después de las pruebas
    afterAll(async () => {
        await server.close();
    });

    // 📋 TESTS DE LECTURA (GET)
    describe('GET /butterflies', () => {
        test('Debería obtener todas las mariposas', async () => {
            const response = await request(app)
                .get('/butterflies')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('count');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    // ✨ TESTS DE CREACIÓN (POST)
    describe('POST /butterflies', () => {
        test('Debería crear una nueva mariposa', async () => {
            const response = await request(app)
                .post('/butterflies')
                .send(testButterfly)
                .expect(201);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message');
            expect(response.body.data).toHaveProperty('commonName', testButterfly.commonName);
            expect(response.body.data).toHaveProperty('scientificName', testButterfly.scientificName);
            expect(response.body.data).toHaveProperty('flightSeason');
            expect(Array.isArray(response.body.data.flightSeason)).toBe(true);
            
            // Guardar ID para otros tests
            butterflyId = response.body.data.id;
        });

        test('Debería fallar al crear mariposa sin datos obligatorios', async () => {
            const invalidButterfly = {
                commonName: '', // Campo obligatorio vacío
                scientificName: 'Test'
            };

            const response = await request(app)
                .post('/butterflies')
                .send(invalidButterfly)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('errors');
        });

        test('Debería validar formato de coordenadas', async () => {
            const butterflyWithInvalidCoords = {
                ...testButterfly,
                coordinates: {
                    latitude: 200, // Inválido (debe estar entre -90 y 90)
                    longitude: -50
                }
            };

            const response = await request(app)
                .post('/butterflies')
                .send(butterflyWithInvalidCoords)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    // 📋 TESTS DE LECTURA POR ID
    describe('GET /butterflies/:id', () => {
        test('Debería obtener una mariposa por ID', async () => {
            const response = await request(app)
                .get(`/butterflies/${butterflyId}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('id', butterflyId);
            expect(response.body.data).toHaveProperty('commonName', testButterfly.commonName);
            expect(response.body.data).toHaveProperty('coordinates');
            expect(response.body.data.coordinates).toHaveProperty('latitude');
            expect(response.body.data.coordinates).toHaveProperty('longitude');
        });

        test('Debería retornar 404 para ID inexistente', async () => {
            const response = await request(app)
                .get('/butterflies/99999')
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });
    });

    // 🔄 TESTS DE ACTUALIZACIÓN (PUT)
    describe('PUT /butterflies/:id', () => {
        test('Debería actualizar una mariposa', async () => {
            const updatedData = {
                ...testButterfly,
                commonName: 'Mariposa Monarca Actualizada',
                wingspan: 12.0,
                tags: ['actualizada', 'test', 'monarca']
            };

            const response = await request(app)
                .put(`/butterflies/${butterflyId}`)
                .send(updatedData)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body.data).toHaveProperty('commonName', 'Mariposa Monarca Actualizada');
            expect(response.body.data).toHaveProperty('wingspan', 12.0);
            expect(response.body.data.tags).toContain('actualizada');
        });
    });

    // 🌍 TESTS DE FILTRADO
    describe('GET /butterflies/region/:region', () => {
        test('Debería obtener mariposas por región', async () => {
            const response = await request(app)
                .get('/butterflies/region/América del Norte')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('region', 'América del Norte');
            expect(response.body.data.every(b => b.region === 'América del Norte')).toBe(true);
        });
    });

    describe('GET /butterflies/family/:family', () => {
        test('Debería obtener mariposas por familia', async () => {
            const response = await request(app)
                .get('/butterflies/family/Nymphalidae')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('family', 'Nymphalidae');
            expect(response.body.data.every(b => b.family === 'Nymphalidae')).toBe(true);
        });
    });

    // 🗑️ TESTS DE ELIMINACIÓN (DELETE)
    describe('DELETE /butterflies/:id', () => {
        test('Debería eliminar una mariposa', async () => {
            const response = await request(app)
                .delete(`/butterflies/${butterflyId}`)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('message');
        });

        test('Debería retornar 404 al intentar eliminar mariposa inexistente', async () => {
            const response = await request(app)
                .delete(`/butterflies/${butterflyId}`)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
        });
    });
});