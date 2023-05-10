const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')

describe('Users routes', () => {
    let testUserId; 
    test('Funzione che mostra tutti gli users', async () => {
        const response = await supertest(app).get('/users')
        expect(response.statusCode).toBe(200);
    })
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
        testUserId = await response.body.user;
    })
    test('Funzione che mostra un utente specifico', async () => {
        if(testUserId){
            const response = await supertest(app).get(`/users/${testUserId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
    test('Funzione che modifica un utente specifico', async () => {
        const requestBody = {
            userid: testUserId.id,
            email: "testunitemail@email.com",
            name: "John",
            surname: "Doe",
            username: "test_unit_username",
        };
        if(testUserId){
            const response = await supertest(app).patch(`/users/${testUserId.id}`).send(requestBody);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBeDefined();
        }
    })
    test("Funzione che elimina l'utente di test", async () => {
        if(testUserId){
            const response = await supertest(app).delete(`/users/${testUserId.id}`)
            expect(response.statusCode).toBe(200);
            const deleteUser = await prisma.user.delete({where:{id:testUserId.id}})
        }
    })
})