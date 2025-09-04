import request from 'supertest';
import { app } from '../app.js';
import db_connection from '../database/db_connection.js';
import ButterflyModel from '../models/butterflyModel.js';

describe('Oceania-Butterflies-Backend', () => {
    beforeAll(async () => {
        await db_connection.authenticate();
        await db_connection.sync({ force: true });
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

    // DELETE butterfly by id
    describe('DELETE /butterflies/:id', () => {
        let createdButterfly;
        let response;
        beforeEach(async () => {
            createdButterfly = await ButterflyModel.create({
                commonName: "Test butterfly DELETE",
                scientificName: `Test butterfly DELETE ${Date.now()}`,
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
