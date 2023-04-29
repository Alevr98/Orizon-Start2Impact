const supertest = require('supertest');
const app = require('../config/express.js');
const PORT = 3001;

describe('POSTS /users', () => {
    beforeAll(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}` );
        })
    })
    
    afterAll(() => {
        app.close();
    })

    test('Funzione che mostra tutti gli users', async () => {
        const response = await supertest(app).get('/users')
        expect(response.statusCode).toBe(200);
    })
})