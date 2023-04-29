const express = require('express')
require('dotenv').config();
const app = express();
const userRoute = require('../api/routes/User')
const travelRoutes = require('../api/routes/Travel')
const bookingRoutes = require('../api/routes/Booking')

app.use(express.json());
app.use('/users', userRoute);
app.use('/travels', travelRoutes);
app.use('/bookings', bookingRoutes);


module.exports={app}