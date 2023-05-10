// import paguro from '../controllers/User';
const express = require('express')
const router = express.Router();
const BookingController = require('../controllers/Booking');

// GET BOOKING LIST
router.get('/', BookingController.getBookingList)
// CREATE BOOKING
router.post('/', BookingController.createBooking)
// EDIT BOOKING
router.patch('/:bookingid', BookingController.editBooking)
// GET SINGLE BOOKING
router.get('/:bookingid', BookingController.getBooking)
// DELETE BOOKING
router.delete('/:bookingid', BookingController.deleteBooking)
// GET BOOKING SEARCHING FOR DATE
router.get('/sort-by-date/:bookingdate', BookingController.sortByBookingDate)
// GET BOOKING SEARCHING FOR DATE
router.get('/sort-by-travel/:travelid', BookingController.bookingByTravel)

module.exports = router;