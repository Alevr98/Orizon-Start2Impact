const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')
const PORT = process.env.API_PORT_UNIT_TEST || 3001;

describe('Users routes', () => {
    let testUserId; 
    test('Creazione di un nuovo utente', async () => {
        const requestBody = {
            email: "user_test@email.it",
            name: "John",
            surname: "Doe",
            username: "Jhonny",
        };
        const response = await supertest(app).post(`/users`).send(requestBody);
        expect(response.statusCode).toBe(201);
        expect(response.body.user.id).toBeDefined();
        const testUserId = await response.body.user.id;
    })
    test('Funzione che mostra tutti gli users', async () => {
        const response = await supertest(app).get('/users')
        expect(response.statusCode).toBe(200);
    })
    test('Funzione che mostra un utente specifico', async () => {
        if(testUserId){
            const response = await supertest(app).get(`/users/${testUserId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
    test("Funzione che modifica l' specifico", async () => {
        if(testUserId){
            const response = await supertest(app).delete(`/users/${testUserId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
})