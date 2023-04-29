const {PrismaClient} = require('@prisma/client');
const { body, validationResult, check } = require('express-validator')
const prisma = new PrismaClient();


// Mostro la lista di tutti gli utenti disponibili 
async function getUserList(req, res) {
    const allUsers = await prisma.user.findMany({
        where: {
            isDeleted: false,
        }
    });
    res.status(200).send({data: allUsers})
}
// Funzione per la creazione di un nuovo utente
async function createUser(req, res) {
    const validationRules = [
        body('email').notEmpty().withMessage("L'indirizzo e-mail non può essere vuoto"),
        body('email').isEmail().withMessage("L'email inserita non è valida"),
        body('username').notEmpty().withMessage("Il campo username non può essere vuoto"),
        body('username').isString().withMessage('Il campo username non è valido'),
        body('name').notEmpty().withMessage("Il campo name non può essere vuoto"),
        body('name').isString().withMessage('Il campo name non è valido'),
        body('surname').notEmpty().withMessage("Il campo surname non può essere vuoto"),
        body('surname').isString().withMessage('Il campo surname non è valido'),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }    
    let { email, username, name, surname } = req.body;
    try {
        const user = await prisma.user.create({
            data:{
                email: email,
                name: name,
                surname: surname,
                username: username,
            }
        })
        console.log(user);
        res.status(201).json({msg:"Utente creato con successo", user:user})
    } catch (error) {
        console.log(error);
        return res.status(404).send({msg: "Qualcosa è andato storto. Riprova!"})
    }
}
// Funzione per la modifica di email o username dell'utente

async function editUser (req, res){
    const validationRules = [
        check('userid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('userid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
        body('email').isEmail().withMessage("L'email inserita non è valida"),
        body('email').notEmpty().withMessage("Il campo e-mail non può essere vuoto"),
        body('username').notEmpty().withMessage("Il campo username non può essere vuoto"),
        body('username').isString().withMessage('Il campo username non è valido'),
        body('name').notEmpty().withMessage("Il campo name non può essere vuoto"),
        body('name').isString().withMessage('Il campo name non è valido'),
        body('surname').notEmpty().withMessage("Il campo surname non può essere vuoto"),
        body('surname').isString().withMessage('Il campo surname non è valido'),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { userid } = req.params;
    const user = await prisma.user.findFirst({
        where: {
          id: userid,
          isDeleted: false,
        },
      });
    if (!user) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        let { email, username, name, surname } = req.body;
        const updateUser = await prisma.user.update({
            where:{
                id: userid,
            }, data:{
                username: username,
                email: email,
                name: name,
                surname: surname,
            }
        })
        return res.status(200).json({data: updateUser})
    }
} 

async function getUser (req, res) {
    const validationRules = [
        check('userid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('userid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { userid } = req.params;
    const user = await prisma.user.findFirst({
        where: {
                id: userid,
                isDeleted: false,
        },
      });
    if (!user) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        return res.status(200).send({data: user})
    }
}
async function deleteUser (req, res) {
    const validationRules = [
        check('userid').isMongoId().withMessage("L'ID inserito non è valido"),
        check('userid').notEmpty().withMessage("Il campo ID non può essere vuoto"),
    ];
    // Check if there are any validation errors
    await Promise.all(validationRules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } 
    const { userid } = req.params;
    const user = await prisma.user.findFirst({
        where: {
            id: userid,
            isDeleted: false,
        },
    });
    if (!user) {
        return res.status(400).send({ error: "L'id inserito non è valido" });
    }else {
        const deletedUser = await prisma.user.updateMany({
            where:{
                id: userid,
                isDeleted: false,            
            },data:{
                isDeleted: true,
            }
        })
        return res.status(200).send({msg: "Utente elimato con successo"})
    }
}

module.exports = {getUserList, createUser, editUser, getUser, deleteUser}