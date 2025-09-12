import request from "supertest";
import { app, server } from "../app.js"
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

describe('Oceania-Butterflies-Backend', () => {
    beforeAll(async () => {
        try {
            await db_connection.authenticate();
            console.log('Database connection established successfully.');
            
            // Forzar la sincronización y recreación de tablas
            await db_connection.sync({ force: true });
            console.log('Database synchronized successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    });

    // GET all butterflies
    describe('GET /butterflies', () => {
        let response;
        beforeEach(async () => {
            response = await request(app).get('/butterflies').send()
        });
        test('Should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
        test('Should return array of butterflies', async () => {
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    // Para GET /butterflies/:id
describe("GET /butterflies/:id", () => {
    let testButterfly, response;

    beforeAll(async () => {
      testButterfly = await ButterflyModel.create({
        commonName: "TestButterfly",
        scientificName: "TestButterfly",
        family: "TestButterfly",
        region: "TestButterfly",
        specificLocation: "TestButterfly",
        threatLevel: "TestButterfly",
      });
    });

    beforeEach(async () => {
      response = await request(app).get(`/butterflies/${testButterfly.id}`);
    });

    it("should return status 200", () => {
      expect(response.status).toBe(200);
    });

    it("should return butterfly with correct id", () => {
      // Cambiar de response.body.butterfly.id a response.body.id
      expect(response.body.id).toBe(testButterfly.id);
    });

    it("should return butterfly with required fields", () => {
      // Cambiar de response.body.butterfly a response.body directamente
      expect(response.body).toMatchObject({
        id: testButterfly.id,
        commonName: expect.any(String),
        scientificName: expect.any(String),
        family: expect.any(String),
        region: expect.any(String),
        specificLocation: expect.any(String),
        threatLevel: expect.any(String),
      });
    });

    afterAll(async () => {
      await testButterfly.destroy();
    });
});

    // DELETE butterfly by id
    describe('DELETE /butterflies/:id', () => {
        let createdButterfly;
        let response;
        beforeEach(async () => { // Crea una mariposa con datos de prueba
            createdButterfly = await ButterflyModel.create({
                commonName: "Test butterfly DELETE",
                scientificName: `Test butterfly DELETE ${Date.now()}`,
                family: "Test butterfly DELETE",
                region: "Test butterfly DELETE",
                threatLevel: "Test butterfly DELETE"
            });
            response = await request(app).delete(`/butterflies/${createdButterfly.id}`).send(); // Elimina la mariposa creada
        });
        test('Should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });
        test('Should return message: The butterfly has been deleted successfully', async () => {
            expect(response.body.message).toContain("The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findOne({ where: { id: createdButterfly.id } }); // Busca la mariposa por su ID
            expect(foundButterfly).toBeNull(); // Verifica que ya no exista en la base de datos
        });
    });

    // CREATE butterfly
    describe('POST /butterflies', () => {
        let newButterflyData;
        let response;
        beforeEach(async () => { // Crea una mariposa con datos de prueba
            newButterflyData = {
                commonName: "Test butterfly CREATE",
                scientificName: `Test butterfly CREATE ${Date.now()}`, // Debe ser un dato único por eso dejamos Date.now()
                family: "Test butterfly CREATE",
                region: "Test butterfly CREATE",
                threatLevel: "Test butterfly CREATE"
            };
            response = await request(app).post('/butterflies').send(newButterflyData); // Llamada POST al endpoint de la API
        });
        test('Should return a response with status 201 and type json', () => {
            expect(response.status).toBe(201);
            expect(response.headers['content-type']).toContain('json');
        });
        test('Should return the created butterfly with correct data', () => {
            expect(response.body).toHaveProperty('butterfly');
            expect(response.body.butterfly).toHaveProperty('id');
            expect(response.body.butterfly.commonName).toBe(newButterflyData.commonName);
            expect(response.body.butterfly.scientificName).toBe(newButterflyData.scientificName);
        });
        afterEach(async () => { // Limpia de la base de datos la mariposa creada
            if (response.body && response.body.butterfly && response.body.butterfly.id) {
                await ButterflyModel.destroy({ where: { id: response.body.butterfly.id } });
            }
        });
    });

// Para PUT /butterflies/:id
describe('PUT /butterflies/:id', () => {
    let testButterfly;
    let updatedData;
    let response;

    beforeEach(async () => {
        testButterfly = await ButterflyModel.create({
            commonName: "Test Butterfly UPDATE",
            scientificName: `Test Butterfly UPDATE ${Date.now()}`,
            family: "Pieridae",
            region: "Nueva Zelanda",
            threatLevel: "Medium"
        });

        updatedData = {
            commonName: "Updated Butterfly Name",
            family: "Nymphalidae",
            region: "Australia",
            threatLevel: "High"
        };

        response = await request(app)
            .put(`/butterflies/${testButterfly.id}`)
            .send(updatedData);
    });

    test('Should return a response with status 200 and type json', () => {
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('json');
    });

    test('Should return the updated butterfly object', () => {
        // Cambiar las expectativas según la respuesta actual
        expect(response.body).toHaveProperty('id', testButterfly.id);
        expect(response.body.commonName).toBe(updatedData.commonName);
        expect(response.body.family).toBe(updatedData.family);
        expect(response.body.region).toBe(updatedData.region);
        expect(response.body.threatLevel).toBe(updatedData.threatLevel);
    });

    test('Should actually update the butterfly in database', async () => {
        const updatedButterfly = await ButterflyModel.findByPk(testButterfly.id);
        expect(updatedButterfly.commonName).toBe(updatedData.commonName);
        expect(updatedButterfly.family).toBe(updatedData.family);
        expect(updatedButterfly.region).toBe(updatedData.region);
        expect(updatedButterfly.threatLevel).toBe(updatedData.threatLevel);
        expect(updatedButterfly.scientificName).toBe(testButterfly.scientificName);
    });

    afterEach(async () => {
        if (testButterfly && testButterfly.id) {
            await ButterflyModel.destroy({ where: { id: testButterfly.id } });
        }
    });
});

// UPDATE butterfly - casos de error
describe('PUT /butterflies (error cases)', () => {
    test('PUT /butterflies/:id (non-existent ID) - should return 404 error', async () => {
        const nonExistentId = 99999;
        const updatedData = {
            commonName: "This should not work",
            family: "Nymphalidae", // Usar familia válida
            region: "Australia" // Usar región válida
        };

        const response = await request(app)
            .put(`/butterflies/${nonExistentId}`)
            .send(updatedData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Butterfly not found');
    });

    test('PUT /butterflies (without ID) - should return 404 error', async () => {
        const updatedData = {
            commonName: "This should not work",
            family: "Pieridae", // Usar familia válida
            region: "Islas del Pacífico" // Usar región válida
        };

        const response = await request(app)
            .put('/butterflies/')  // Sin ID
            .send(updatedData);

        // Dependiendo de cómo esté configurado nuestro router, podría ser 404 o 400
        expect([404, 400]).toContain(response.status);
    });
});
afterAll(async () => {
    try {
        // Limpiar la base de datos antes de cerrar
        await db_connection.drop();
        await db_connection.close();
        console.log('Database connection closed successfully.');
    } catch (error) {
        console.error('Error closing database:', error);
    }
});
});
