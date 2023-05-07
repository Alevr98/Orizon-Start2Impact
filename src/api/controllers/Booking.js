const {PrismaClient} = require('@prisma/client');
const { body, validationResult, check } = require('express-validator')
const prisma = new PrismaClient();


// Mostro tutti i viaggi disponibili
async function getBookingList(req, res) {
    const allBookings = await prisma.booking.findMany({
        where: {
            isDeleted: false,
        }
    });
    res.status(200).send({data: allBookings})
}


async function createBooking(req, res) {
    const validationRules = [
        body('userid').isMongoId().withMessage("Lo userid inserito non è valido"),
        body('userid').notEmpty().withMessage("Il campo 'userid' non può essere vuoto"),
        body('travelid').isMongoId().withMessage("Il travelid inserito non è valido"),
        body('travelid').notEmpty().withMessage("Il campo 'travelid' non può essere vuoto"),
        body('quantity').isNumeric().withMessage("Il campo 'quantity' non è valido"),
        body('quantity').notEmpty().withMessage("Il campo 'quantity' non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }    
    let { userid, travelid, quantity } = req.body;
    // Controllo se esiste lo user id inserito
    const user = await prisma.user.findUnique({ where: { id: userid } })
    if(!user){
        return res.status(404).json({ error: 'Lo user inserito non esiste' })
    }
    // Controllo se esiste il travel id 
    const travel = await prisma.travel.findUnique({ where: { id: travelid } })
    if(!travel){
        return res.status(404).json({ error: 'Il viaggio inserito non esiste' })
    }
    // Controllo se ci sono abbastanza posti disponibili
    let updatedPlaces = Number(travel.places_left) - Number(quantity);
    if(updatedPlaces > travel.all_places){
        return res.status(404).json({ error: 'Non vi sono abbastanza posti disponibili per questo viaggio' })
    }
    // Eseguo una transaction per essere sicuro dell'effettivo update di ogni tabella
    try {
        const transaction = await prisma.$transaction([
            prisma.booking.create({
                data:{
                    user_id : userid,
                    travel_id : travelid,
                    quantity : quantity,
                }
            }),
            prisma.travel.update({
                where:{
                    id: travelid,
                }, data:{
                    places_left : updatedPlaces,
                }
            })
            

        ])
        let new_booking = transaction[0];
        res.status(201).send({msg:"Prenotazione inserita con successo", booking:new_booking})
    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"Errore durante la prenotazione"})
    }
}

async function editBooking (req, res){
    const validationRules = [
        check('bookingid').isMongoId().withMessage("il booking id inserito non è valido"),
        check('bookingid').notEmpty().withMessage("Il booking ID non può essere vuoto"),
        body('travel_id').optional().notEmpty().withMessage("Il campo 'travel_id' non può essere vuoto"),
        body('travel_id').optional().isMongoId().withMessage("Il campo 'travel_id' non è valido"),
        body('user_id').optional().isMongoId().withMessage("Il campo 'user_id' non è valido"),
        body('user_id').optional().notEmpty().withMessage("Il campo 'user_id' non può essere vuoto"),
        body('quantity').isNumeric().withMessage("Il campo 'quantity' non è valido"),
        body('quantity').notEmpty().withMessage("Il campo 'quantity' non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    // EDIT
    let { travel_id, user_id, quantity} = req.body;
    let { bookingid } = req.params;
    const booking = await prisma.booking.findUnique({ where: { id: bookingid } })
    let updateBooking = {};
    if(travel_id){
        updateBooking.travel_id = travel_id
    }
    if(user_id){
        updateBooking.user_id = user_id
    }
    if(quantity){
        updateBooking.quantity = quantity
    }
    try {
        if(travel_id){
            const transaction = await prisma.$transaction([
                prisma.booking.updateMany({
                    where:{
                        id: bookingid,
                        isDeleted: false,            
                    },data:updateBooking,
                }),
                // Rimuovo il valore dal precedente viaggio
                prisma.travel.updateMany({
                    where:{
                        id: booking.travel_id,
                        isDeleted: false,            
                    }, 
                    data:{
                        places_left:{
                            increment:booking.quantity
                        }
                    }
                })
                ,
                // Aggiorno i posti nel nuovo viaggio
                prisma.travel.updateMany({
                    where:{
                        id:travel_id,
                        isDeleted: false,            
                    }, data:{
                        places_left: {
                            decrement: quantity,
                        }
                    }
                })
            ])
        }else {
            const transaction = await prisma.$transaction([
                prisma.booking.updateMany({
                    where:{
                        id: bookingid,
                        isDeleted: false,            
                    },data:updateBooking,
                }),
                prisma.travel.updateMany({
                    where:{
                        id:travel_id,
                        isDeleted: false,            
                    }, data:{
                        places_left: {
                            increment: (booking.quantity - quantity),
                        }
                    }
                })
            ])
        }
        // GET UPDATED FUNCTION
        const updatedBooking = await prisma.booking.findFirst({
            where:{
                id: bookingid,
            }
        })
        return res.status(200).send({msg: "Prenotazione modificata con successo", data:updatedBooking })
    } catch (error) {
        console.log(error);
        return res.status(404).send({msg: error})
        
    }
} 

async function getBooking (req, res) {
    const validationRules = [
        check('bookingid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('bookingid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { bookingid } = req.params;
    const booking = await prisma.booking.findFirst({
        where: {
                id: bookingid,
                isDeleted: false,
        },
      });
    if (!booking) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        return res.status(200).send({data: booking})
    }
}
async function deleteBooking (req, res) {
    const validationRules = [
        check('bookingid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('bookingid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { bookingid } = req.params;
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingid,
            isDeleted: false,
        },
    });
    if (!booking) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        try {
            const transaction = await prisma.$transaction([
                prisma.booking.updateMany({
                    where:{
                        id: bookingid,
                        isDeleted: false,            
                    },data:{
                        isDeleted: true,
                    }
                }),
                prisma.travel.updateMany({
                    where:{
                        id:booking.travel_id,
                        isDeleted: false,            
                    }, data:{
                        places_left: {
                            increment: booking.quantity,
                        }
                    }
                })
            ])
            return res.status(200).send({msg: "Prenotazione elimata con successo"})
        } catch (error) {
            console.log(error);
        return res.status(404).send({msg: "Qualcosa è andato storto. Riprova!"})
            
        }
    }
}

module.exports = {getBookingList, createBooking, editBooking, getBooking, deleteBooking}