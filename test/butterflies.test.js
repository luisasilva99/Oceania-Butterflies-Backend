import request from "supertest";
import { app, server } from "../app.js"
import db_connection from "../database/db_connection.js";
import ButterflyModel from "../models/ButterflyModel.js";


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