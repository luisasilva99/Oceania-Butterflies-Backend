import request from 'supertest';
import { app } from '../app.js';
import ButterflyModel from '../models/ButterflyModel.js';
import db_connection from '../database/db_connection.js';

describe('Butterfly API Tests', () => {
    // Setup antes de todas las pruebas
    beforeAll(async () => {
        try {
            // Conectar a la base de datos de testing
            await db_connection.authenticate();
            
            // Sincronizar modelo (crear tabla si no existe)
            await ButterflyModel.sync({ force: true });
            
            console.log('Test database setup complete');
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    // Cleanup después de todas las pruebas
    afterAll(async () => {
        try {
            // Cerrar conexión a la base de datos
            await db_connection.close();
            console.log('Test database connection closed');
        } catch (error) {
            console.error('Test cleanup failed:', error);
        }
    });

    // Limpiar datos entre cada test
    beforeEach(async () => {
        try {
            await ButterflyModel.destroy({ where: {}, truncate: true });
        } catch (error) {
            console.error('Test data cleanup failed:', error);
        }
    });

    // TESTS DE CONEXIÓN Y ESTRUCTURA DE RESPUESTA
    describe('GET /butterflies', () => {
        test('Debería retornar estructura correcta de respuesta', async () => {
            const response = await request(app)
                .get('/butterflies')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('count');
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('POST /butterflies', () => {
        test('Debería retornar error 400 para datos inválidos', async () => {
            const response = await request(app)
                .post('/butterflies')
                .send({}) // Datos vacíos
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        test('Debería validar formato de coordenadas inválidas', async () => {
            const invalidData = {
                commonName: "Test Butterfly",
                scientificName: "Test species",
                family: "Test Family",
                region: "Test Region",
                threatLevel: "bajo",
                coordinates: {
                    latitude: 200, // Inválido
                    longitude: -50
                }
            };

            const response = await request(app)
                .post('/butterflies')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });

        test('Debería validar color hexadecimal inválido', async () => {
            const invalidData = {
                commonName: "Test Butterfly",
                scientificName: "Test species",
                family: "Test Family",
                region: "Test Region",
                threatLevel: "bajo",
                colorPrimary: "invalid-color"
            };

            const response = await request(app)
                .post('/butterflies')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    // TESTS DE ENDPOINTS ESPECÍFICOS
    describe('GET /butterflies/:id', () => {
        test('Debería retornar 404 para ID inexistente', async () => {
            const response = await request(app)
                .get('/butterflies/99999')
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PUT /butterflies/:id', () => {
        test('Debería retornar 404 para actualizar ID inexistente', async () => {
            const updateData = {
                commonName: 'Updated Butterfly'
            };

            const response = await request(app)
                .put('/butterflies/99999')
                .send(updateData)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe('DELETE /butterflies/:id', () => {
        test('Debería retornar 404 para eliminar ID inexistente', async () => {
            const response = await request(app)
                .delete('/butterflies/99999')
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
        });
    });

    // TESTS DE FILTROS
    describe('GET /butterflies/region/:region', () => {
        test('Debería retornar estructura correcta para filtro por región', async () => {
            const response = await request(app)
                .get('/butterflies/region/TestRegion')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /butterflies/family/:family', () => {
        test('Debería retornar estructura correcta para filtro por familia', async () => {
            const response = await request(app)
                .get('/butterflies/family/TestFamily')
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    // TEST DE SALUD DE LA API
    describe('API Health Check', () => {
        test('La aplicación debería estar corriendo', async () => {
            const response = await request(app)
                .get('/butterflies')
                .expect('Content-Type', /json/);

            expect(response.status).toBeLessThan(500);
        });
    });
});