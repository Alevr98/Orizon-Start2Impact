const {PrismaClient} = require('@prisma/client');
const { body, validationResult, check } = require('express-validator')
const prisma = new PrismaClient();


// Mostro tutti i viaggi disponibili
async function getTravelList(req, res) {
    const allTravels = await prisma.travel.findMany({
        where: {
            isDeleted: false,
        }
    });
    res.status(200).send({data: allTravels})
}


async function createTravel(req, res) {
    const validationRules = [
        body('travel_name').notEmpty().withMessage("Il campo 'travel_name' non può essere vuoto"),
        body('travel_name').isString().withMessage("Il campo 'travel_name' non è valida"),
        body('travel_description').optional().isString().withMessage("Il campo 'travel_description' non è valida"),
        body('travel_destination').notEmpty().withMessage("Il campo 'travel_destination' non può essere vuoto"),
        body('travel_destination').isString().withMessage("Il campo 'travel_destination' non è valida"),
        body('travel_starting_date').notEmpty().withMessage("Il campo travel_starting_date non può essere vuoto"),
        body('travel_starting_date').isISO8601().withMessage('Il campo travel_starting_date non è valido'),
        body('travel_ending_date').notEmpty().withMessage("Il campo travel_ending_date non può essere vuoto"),
        body('travel_ending_date').isISO8601().withMessage('Il campo travel_ending_date non è valido'),
        body('all_places').notEmpty().withMessage("Il campo all_places non può essere vuoto"),
        body('all_places').isNumeric().withMessage('Il campo all_places non è valido'),
        body('places_left').notEmpty().withMessage("Il campo places_left non può essere vuoto"),
        body('places_left').isNumeric().withMessage('Il campo places_left non è valido'),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }    
    let { travel_name, travel_description, travel_destination, travel_starting_date, travel_ending_date, all_places, places_left } = req.body;
    try {
        const travel = await prisma.travel.create({
            data:{
                travel_name : travel_name,
                travel_description : travel_description,
                travel_destination : travel_destination,
                travel_starting_date : travel_starting_date,
                travel_ending_date : travel_ending_date,
                all_places : all_places,
                places_left : places_left,
            }
        })
        console.log(travel);
        res.status(201).send({msg:"Viaggio creato con successo"})
    } catch (error) {
        console.log(error);
        return res.status(404).send({msg: "Qualcosa è andato storto. Riprova!"})
    }
}
// Funzione per la modifica di email o username dell'utente

async function editTravel (req, res){
    const validationRules = [
        check('travelid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('travelid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
        body('travel_name').notEmpty().withMessage("Il campo 'travel_name' non può essere vuoto"),
        body('travel_name').isString().withMessage("Il campo 'travel_name' non è valida"),
        body('travel_description').optional().isString().withMessage("Il campo 'travel_description' non è valida"),
        body('travel_destination').notEmpty().withMessage("Il campo 'travel_destination' non può essere vuoto"),
        body('travel_destination').isString().withMessage("Il campo 'travel_destination' non è valida"),
        body('travel_starting_date').notEmpty().withMessage("Il campo travel_starting_date non può essere vuoto"),
        body('travel_starting_date').isISO8601().withMessage('Il campo travel_starting_date non è valido'),
        body('travel_ending_date').notEmpty().withMessage("Il campo travel_ending_date non può essere vuoto"),
        body('travel_ending_date').isISO8601().withMessage('Il campo travel_ending_date non è valido'),
        body('all_places').notEmpty().withMessage("Il campo all_places non può essere vuoto"),
        body('all_places').isNumeric().withMessage('Il campo all_places non è valido'),
        body('places_left').notEmpty().withMessage("Il campo places_left non può essere vuoto"),
        body('places_left').isNumeric().withMessage('Il campo places_left non è valido'),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { travelid } = req.params;
    const travel = await prisma.travel.findFirst({
        where: {
          id: travelid,
          isDeleted: false,
        },
      });
    if (!travel) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        let { travel_name, travel_description, travel_destination, travel_starting_date, travel_ending_date, all_places, places_left } = req.body;
        const updateTravel = await prisma.travel.update({
            where:{
                id: travelid,
            }, data:{
                travel_name : travel_name,
                travel_description : travel_description,
                travel_destination : travel_destination,
                travel_starting_date : travel_starting_date,
                travel_ending_date : travel_ending_date,
                all_places : all_places,
                places_left : places_left,
            }
        })
        return res.status(200).json({data: updateTravel})
    }
} 

async function getTravel (req, res) {
    const validationRules = [
        check('travelid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('travelid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { travelid } = req.params;
    const travel = await prisma.travel.findFirst({
        where: {
                id: travelid,
                isDeleted: false,
        },
      });
    if (!travel) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        return res.status(200).send({data: travel})
    }
}
async function deleteTravel (req, res) {
    const validationRules = [
        check('travelid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('travelid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { travelid } = req.params;
    const travel = await prisma.travel.findFirst({
        where: {
            id: travelid,
            isDeleted: false,
        },
    });
    if (!travelid) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        const deletedTravel = await prisma.travel.updateMany({
            where:{
                id: travelid,
                isDeleted: false,            
            },data:{
                isDeleted: true,
            }
        })
        return res.status(200).send({msg: "Viaggio elimato con successo"})
    }
}

module.exports = {getTravelList, createTravel, editTravel, getTravel, deleteTravel}