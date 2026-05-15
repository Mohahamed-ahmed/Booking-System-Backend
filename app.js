const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user')
const destinationRoutes = require('./routes/destinations')
const packageRoutes = require('./routes/package')
const bookingRoutes = require('./routes/booking')
const connectDb = require('./utils/database')

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'https://booking-system-frontend-phi.vercel.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});


// const mongoUrl = process.env.MONGO_URL;

connectDb()// we did this because we want to connect to the database before handling any requests, ensuring that the application is ready to interact with the database when it starts receiving requests.
// and this happens because we using vercel as server and it cnat handle the normal sitiuation

app.use('/auth', authRoutes)
app.use(userRoutes)
app.use(destinationRoutes)
app.use(packageRoutes)
app.use(bookingRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// mongoose.connect(mongoUrl)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch(err => {
//     console.log("Error connecting to MongoDB:", err);
//   });

module.exports = app;
