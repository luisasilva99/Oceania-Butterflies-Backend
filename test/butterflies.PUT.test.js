import request from "supertest";
import { app, server } from "../app.js";
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

describe("test butterfly crud", () => {
    let testButterflyId; // Para almacenar ID del butterfly creado para testing

    beforeAll(async () => {
        await db_connection.authenticate();
        
        // Crear un butterfly de prueba para poder actualizarlo
        const testButterfly = await ButterflyModel.create({
            name: "Test Butterfly",
            species: "Testicus butterflius",
            // agrega otros campos requeridos según tu modelo
        });
        testButterflyId = testButterfly.id;
    });

    afterAll(async () => {
        // Limpiar datos de prueba
        if (testButterflyId) {
            await ButterflyModel.destroy({ where: { id: testButterflyId } });
        }
        await db_connection.close();
        server.close();
    });

    describe("PUT /butterflies/:id", () => { // Cambié de /books a /butterflies y agregué :id
        let response;
        const updatedData = {
            name: "Updated Butterfly Name",
            species: "Updated Species",
            // otros campos que quieras actualizar
        };

        beforeEach(async () => {
            response = await request(app)
                .put(`/butterflies/${testButterflyId}`) // Usar ID específico
                .send(updatedData); // Enviar datos para actualizar
        });

        test('should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('should return the updated butterfly object', async () => {
            expect(response.body).toHaveProperty('id', testButterflyId);
            expect(response.body).toHaveProperty('name', updatedData.name);
            expect(response.body).toHaveProperty('species', updatedData.species);
        });

        test('should actually update the butterfly in database', async () => {
            const butterflyFromDB = await ButterflyModel.findByPk(testButterflyId);
            expect(butterflyFromDB.name).toBe(updatedData.name);
            expect(butterflyFromDB.species).toBe(updatedData.species);
        });
    });

    // Test para PUT sin ID (debería fallar)
    describe("PUT /butterflies (without ID)", () => {
        test('should return 404 or 400 error', async () => {
            const response = await request(app)
                .put('/butterflies')
                .send({ name: "Test" });
            
            expect([400, 404, 405]).toContain(response.status); // Códigos de error esperados
        });
    });

    // Test para PUT con ID inexistente
    describe("PUT /butterflies/:id (non-existent ID)", () => {
        test('should return 404 error', async () => {
            const response = await request(app)
                .put('/butterflies/99999')
                .send({ name: "Non-existent" });
            
            expect(response.status).toBe(404);
        });
    });
});