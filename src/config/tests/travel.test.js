const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')
const PORT = process.env.API_PORT_UNIT_TEST || 3001;

describe('Travel routes', () => {
    let testTravelId; 
    test('Funzione che mostra tutti i viaggi', async () => {
        const response = await supertest(app).get('/travels')
        expect(response.statusCode).toBe(200);
    })
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
        const testTravelId = await response.body.travel.id;
    })
    test('Funzione che mostra un viaggio specifico', async () => {
        if(testTravelId){
            const response = await supertest(app).get(`/travels/${testTravelId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
    test("Funzione che elimina l'utente di test", async () => {
        if(testTravelId){
            const response = await supertest(app).delete(`/users/${testUserId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
})