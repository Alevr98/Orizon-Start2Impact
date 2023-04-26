// import paguro from '../controllers/User';
const express = require('express')
const router = express.Router();
const UserController = require('../controllers/User');

// GET USERS LIST
router.get('/', UserController.getUserList)
// CREATE USER
router.post('/', UserController.createUser)
// EDIT USER
router.patch('/:userid', UserController.editUser)
// GET SINGLE USER
router.get('/:userid', UserController.getUser)
// DELETE USER
router.delete('/:userid', UserController.deleteUser)

module.exports = router;