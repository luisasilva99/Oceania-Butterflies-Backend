import request from "supertest";
import { app, server } from "../app.js"
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";

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

    //GET ONE BUTTERFLY
describe("butterfly crud", () => {
    let testButterfly; //guardamos la mariposa creada en la base de datos

    //conectamos la bd y creamos un registro de prueba
    beforeAll(async () => {
        await db_connection.authenticate()

        testButterfly = await ButterflyModel.create({
            commonName: "TestButterfly",
            scientificName: "TestButterfly",
            family: "TestButterfly",
            region: "TestButterfly",
            specificLocation: "TestButterly",
            threatLevel: "TestButterfly"
        })
    })
    afterAll(async () => {
        if (testButterfly) {
            await testButterfly.destroy(); //limpiamos la mariposa de prueba
        }
        await db_connection.close();
        server.close();
    });
    //test GET ONE
    describe("GET /butterflies/:id", () => {
        let response

        beforeEach(async () => {
            response = await request(app).get(`/butterflies/${testButterfly.id}`)
        })
        it('should return status 200', async () => {
            expect(response.status).toBe(200)
        })

        it("should return butterfly with correct id", async () => {
            expect(response.body.id).toBe(testButterfly.id);
        });

        it('should return butterfly with required fields', async () => {
            expect(response.body).toMatchObject({
                id: testButterfly.id,
                commonName: "TestButterfly",
                scientificName: expect.any(String),
                family: expect.any(String),
                region: expect.any(String),
                specificLocation: expect.any(String),
                threatLevel: expect.any(String)

            });
        });
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

    afterAll(async () => {
        await db_connection.close();
    });
});
