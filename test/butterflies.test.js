import request from 'supertest';
import { app } from '../app.js';
import db_connection from '../database/db_connection.js';
import ButterflyModel from '../models/ButterflyModel.js';

describe('Oceania-Butterflies-Backend', () => {
    let createdButterflyId;

    beforeAll(async () => {
        await db_connection.authenticate();
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
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    // POST (create)
    // describe('POST /butterflies', () => {
    //     test('Should create a new butterfly', async () => {
    //         const newButterfly = {
    //             commonName: "Test butterfly",
    //             scientificName: "Test butterfly",
    //             family: "Test butterfly",
    //             region: "Test butterfly",
    //             threatLevel: "Test butterfly"
    //         };
    //         const response = await request(app).post('/butterflies').send(newButterfly);

    //         expect(response.status).toBe(201);
    //         expect(response.body.butterfly).toHaveProperty('id');
    //         createdButterflyId = response.body.butterfly.id;
    //     });
    // });

    // GET one butterfly by id
    // describe('GET /butterflies/:id', () => {
    //     test('Should return the new butterfly by id', async () => {
    //         const response = await request(app).get(`/butterflies/${createdButterflyId}`).send();

    //         expect(response.status).toBe(200);
    //         expect(response.body.butterfly).toHaveProperty('id', createdButterflyId);
    //     });
    // });

    // PUT (update) butterfly by id
    // describe('PUT /butterflies/:id', () => {
    //     test('Should update the new butterfly', async () => {
    //         const updatedData = { commonName: 'Updated Name' };
    //         const response = await request(app).put(`/butterflies/${createdButterflyId}`).send(updatedData);

    //         expect(response.status).toBe(200);
    //         expect(response.body.butterfly).toHaveProperty('commonName', 'Updated Name');
    //     });
    // });

    // DELETE butterfly by id
    // describe('DELETE /butterflies/:id', () => {
    //     test('Should delete a butterfly', async () => {
    //         const response = await request(app).delete(`/butterflies/${createdButterflyId}`).send();

    //         expect(response.status).toBe(200);
    //         expect(response.body).toHaveProperty('message');
    //     });
    // });

    describe('DELETE /butterflies/:id', () => {
        let response;
        let createdButterfly = {};
        beforeEach(async () => {
            createdButterfly = await ButterflyModel.create({
                commonName: "Test butterfly",
                scientificName: "Test delete butterfly",
                family: "Test delete butterfly",
                region: "Test delete butterfly",
                threatLevel: "Test delete butterfly"
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
