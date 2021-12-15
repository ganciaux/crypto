const express = require('express');
const dotenv = require('dotenv');
const db = require('./db.js');
const coinRoutes = require('./routes/coinRoutes');
const appError = require('./utils/appError');
const cors = require('cors');

dotenv.config({path: './config/.env'})

const app = express();

const corsOptions = {
  //origin: process.env.CLIENT_URL,
  origin:"http://localhost:3000",
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}

app.use(cors(corsOptions));

//body/cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //data from form

//routes
app.use('/api/coins', coinRoutes);
app.get('/favicon.ico', (req, res) => res.status(204));

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

//server
app.listen(process.env.PORT, () => {
  console.log(`Listenning on port ${process.env.PORT}`)
})

//app.use(globalErrorHandler);
