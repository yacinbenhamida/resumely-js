import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes/routing.js';
require('dotenv').config();

const app = express();

/**
    * Connect to the database
    * Supress deprecation warnings for babel usage
    */

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser : true,
    useFindAndModify : true,
    useCreateIndex : true
  },(c)=>{
      console.log(c)
  });

/**
    * Middlewares
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

/**
    * Register the routes
*/

routes(app);
export default app;
