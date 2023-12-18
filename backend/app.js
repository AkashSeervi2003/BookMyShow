const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user-routes');
const adminRouter = require('./routes/admin-routes');
const movieRouter = require('./routes/movie-routes');
const bookingRouter = require('./routes/booking-routes');
dotenv.config();

const PORT = process.env.PORT || 3000

const cors = require('cors');
app.use(cors());
app.use(
    function (req, res, next)
    {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    }
);

// Middleware
app.use(express.json());
app.use('/users', userRouter);
app.use('/admin', adminRouter);
app.use('/movies', movieRouter);
app.use('/users', bookingRouter);

mongoose.connect(`${process.env.DATABASE}`);

app.listen(PORT,
    function()
    {
        console.log(`Chuha Connected to port ${3000}`);
    }
);