import request from 'supertest';
import { app } from '../app.js';
import db_connection from '../database/db_connection.js';
import ButterflyModel from '../models/butterflyModel.js';

describe('Oceania-Butterflies-Backend', () => {
    let createdButterflyId;

    beforeAll(async () => {
        await db_connection.authenticate();
        await db_connection.sync({ force: true });
    });

    // Crear una mariposa inicial para GET
    beforeAll(async () => {
        await ButterflyModel.create({
            commonName: "Test butterfly GET",
            scientificName: `Test butterfly GET ${Date.now()}`,
            family: "Test family",
            region: "Test region",
            threatLevel: "Low"
        });
    });

    // GET all butterflies
    describe('GET /butterflies', () => {
        let response;
        beforeEach(async () => {
            response = await request(app).get('/butterflies').send();
        });

        test('Should return a response with status 200 and type json', () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Should return array of butterflies', () => {
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    // POST (create)
    describe('POST /butterflies', () => {
        test('Should create a new butterfly', async () => {
            const newButterfly = {
                commonName: "Test butterfly POST",
                scientificName: `Test butterfly POST ${Date.now()}`, // evita duplicados
                family: "Test family",
                region: "Test region",
                threatLevel: "Low"
            };
            const response = await request(app).post('/butterflies').send(newButterfly);

            expect(response.status).toBe(201);
            expect(response.body.butterfly).toHaveProperty('id');
            createdButterflyId = response.body.butterfly.id;
        });
    });

    // GET one butterfly by id
    describe('GET /butterflies/:id', () => {
        test('Should return the new butterfly by id', async () => {
            const response = await request(app).get(`/butterflies/${createdButterflyId}`).send();

            expect(response.status).toBe(200);
            expect(response.body.butterfly).toHaveProperty('id', createdButterflyId);
        });
    });

    // PUT (update) butterfly by id
    describe('PUT /butterflies/:id', () => {
        test('Should update the new butterfly', async () => {
            const updatedData = { commonName: 'Updated Name' };
            const response = await request(app).put(`/butterflies/${createdButterflyId}`).send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body.butterfly).toHaveProperty('commonName', 'Updated Name');
        });
    });

    // DELETE butterfly by id
    describe('DELETE /butterflies/:id', () => {
        let createdButterfly;
        let response;

        beforeEach(async () => {
            createdButterfly = await ButterflyModel.create({
                commonName: "Test butterfly DELETE",
                scientificName: `Test butterfly DELETE ${Date.now()}`, // evita duplicados
                family: "Test family",
                region: "Test region",
                threatLevel: "Low"
            });

            response = await request(app).delete(`/butterflies/${createdButterfly.id}`).send();
        });

        test('Should return a response with status 200 and type json', async () => {
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Should return message: The butterfly has been deleted successfully', async () => {
            expect(response.body.message).toContain("The butterfly has been deleted successfully!");
            const foundButterfly = await ButterflyModel.findOne({ where: { id: createdButterfly.id } });
            expect(foundButterfly).toBeNull();
        });
    });

    afterAll(async () => {
        await db_connection.close();
    });
});
