const express = require('express')
const router = express.Router();

const TravelController = require('../controllers/Travel');

// GET TRAVEL LIST
router.get('/', TravelController.getTravelList)
// CREATE TRAVEL
router.post('/', TravelController.createTravel)
// EDIT TRAVEL
router.patch('/:travelid', TravelController.editTravel)
// GET SINGLE TRAVEL
router.get('/:travelid', TravelController.getTravel)
// DELETE TRAVEL
router.delete('/:travelid', TravelController.deleteTravel)

module.exports = router;