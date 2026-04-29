const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth')
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});


const mongoUrl = process.env.MONGO_URL;

app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(mongoUrl)
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
