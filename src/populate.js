const {PrismaClient} = require('@prisma/client');
const Chance = require('chance');
const chance = new Chance;
const travelList = require('./travel.json')


const prisma = new PrismaClient();
truncateTableUser()
truncateTableBooking()
for (let i = 0; i < 30; i++) {
    let username = chance.word({length: 10});
    let nome = chance.word({length: 10});
    let cognome = chance.word({length: 10});
    let email = chance.email();
    addUser(email, username, nome, cognome)
}
async function addUser (email, username, nome, cognome){
    try {
        const user = await prisma.user.create({
            data:{
                email: email,
                name: nome,
                surname: cognome,
                username: username,
            }
        })
        console.log(user);
    } catch (error) {
        console.log(error);
    }
}
truncateTableTravel();
travelList.forEach(travel_el => {
    addTravel(travel_el);
})
async function addTravel (travel_el) {
    const travel = await prisma.travel.create({
        data:{
            travel_name: travel_el.travel_name,
            travel_description: travel_el.travel_description,
            travel_destination: travel_el.travel_destination,
            travel_starting_date: travel_el.travel_starting_date,
            travel_ending_date: travel_el.travel_ending_date,
            all_places: travel_el.all_places,
            places_left: travel_el.places_left,
        }
    })
}


async function truncateTableBooking () {
await prisma.booking.deleteMany({where: {}})
}
async function truncateTableUser () {
await prisma.user.deleteMany({where: {}})
}
async function truncateTableTravel () {
await prisma.travel.deleteMany({where: {}})
}