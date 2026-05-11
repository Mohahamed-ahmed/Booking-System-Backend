const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user')
const destinationRoutes = require('./routes/destinations')
const packageRoutes = require('./routes/package')
const bookingRoutes = require('./routes/booking')

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


const mongoUrl = process.env.MONGO_URL;

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

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:", err);
  });

module.exports = app;
