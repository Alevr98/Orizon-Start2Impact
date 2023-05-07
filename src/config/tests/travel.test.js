const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')

describe('Travel routes', () => {
    let testTravelId; 
    test('Creazione di un nuovo viaggio', async () => {
        const requestBody = {
            travel_name: 'Travel name test',
            travel_description: 'Travel description test',
            travel_destination: 'Travel destination test',
            travel_starting_date: '2024-03-15T00:00:00.000+00:00',
            travel_ending_date: '2024-03-28T00:00:00.000+00:00',
            all_places: 40,
            places_left: 20,
        }
        const response = await supertest(app).post(`/travels`).send(requestBody);
        expect(response.statusCode).toBe(201);
        expect(response.body.travel.id).toBeDefined();
        testTravelId = await response.body.travel;
    })
    test('Funzione che mostra tutti i viaggi', async () => {
        const response = await supertest(app).get('/travels')
        expect(response.statusCode).toBe(200);
    })
    test('Funzione che mostra un viaggio specifico', async () => {
        if(testTravelId){
            const response = await supertest(app).get(`/travels/${testTravelId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
    test('Funzione che modifica un viaggio specifico', async () => {
        const requestBody = {
            travelid: testTravelId.id,
            travel_name: "John Doe travel",
            travel_description: "test unit travel description",
            travel_destination: "Test unit travel destination",
            travel_starting_date: "2024-02-01T00:00:00.000+00:00",
            travel_ending_date: "2024-02-15T00:00:00.000+00:00",
            all_places: 20,
            places_left: 10,
        };
        if(testTravelId){
            const response = await supertest(app).patch(`/travels/${testTravelId.id}`).send(requestBody);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBeDefined();
        }
    })
    test("Funzione che elimina il viaggio di test", async () => {
        if(testTravelId){
            const response = await supertest(app).delete(`/travels/${testTravelId.id}`)
            expect(response.statusCode).toBe(200);
            const deleteTravel = await prisma.travel.delete({where:{id:testTravelId.id}})
        }
    })
})