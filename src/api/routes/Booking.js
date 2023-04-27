// import paguro from '../controllers/User';
const express = require('express')
const router = express.Router();
const BookingController = require('../controllers/Booking');

// GET USERS LIST
router.get('/', BookingController.getBookingList)
// CREATE USER
router.post('/', BookingController.createBooking)
// EDIT USER
router.patch('/:bookingid', BookingController.editBooking)
// GET SINGLE USER
router.get('/:bookingid', BookingController.getBooking)
// DELETE USER
router.delete('/:bookingid', BookingController.deleteBooking)

module.exports = router;