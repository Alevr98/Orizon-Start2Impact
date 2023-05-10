const supertest = require('supertest');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {app} = require('../express')

describe('Booking routes', () => {
    let testBookingId; 
    let randomUser; 
    let randomTravel; 
    test('Creazione di una nuova prenotazione', async () => {
        // GET RANDOM USER
        const user = await prisma.user.findMany();
        const randomIndexUser = Math.floor(Math.random() * user.length);
        randomUser = user[randomIndexUser];
        
        // GET RANDOM TRAVEL
        const travel = await prisma.travel.findMany();
        const randomIndexTravel = Math.floor(Math.random() * travel.length);
        randomTravel = travel[randomIndexTravel];
        const requestBody = {
            user_id:randomUser.id,
            travel_id:randomTravel.id,
            quantity:1
        }
        const response = await supertest(app).post(`/bookings`).send(requestBody);
        expect(response.statusCode).toBe(201);
        expect(response.body.booking.id).toBeDefined();
        testBookingId = await response.body.booking;
    })
    test('Funzione che mostra tutte le prenotazioni', async () => {
        const response = await supertest(app).get('/bookings')
        expect(response.statusCode).toBe(200);
    })
    test('Funzione che mostra una prenotazione specifica', async () => {
        if(testBookingId){
            const response = await supertest(app).get(`/bookings/${testBookingId.id}`)
            expect(response.statusCode).toBe(200);
        }
    })
    test('Funzione che modifica una prenotazione specifica', async () => {
        const requestBody = {
            bookingid: testBookingId.id,
            travel_id: randomTravel.id,
            user_id: randomUser.id,
            quantity: 10,
        };
        if(testBookingId){
            const response = await supertest(app).patch(`/bookings/${testBookingId.id}`).send(requestBody);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.id).toBeDefined();
        }
    })
    test("Funzione che elimina", async () => {
        if(testBookingId){
            const response = await supertest(app).delete(`/bookings/${testBookingId.id}`)
            expect(response.statusCode).toBe(200);
            const deleteBooking = await prisma.booking.delete({where:{id:testBookingId.id}})
        }
    })
})