const express = require('express')
require('dotenv').config();
const app = express();
const PORT = process.env.API_PORT || 3000;
const userRoute = require('../api/routes/User')
const travelRoutes = require('../api/routes/Travel')

app.use(express.json());
app.use('/users', userRoute);
app.use('/travels', travelRoutes);

app.listen(PORT, () => {
    console.log('Server running');
})