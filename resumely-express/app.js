import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './routes/routing.js';
import passport from 'passport';
import cors from 'cors';
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
  },(err)=>{
    if(err)     console.log('Error during mongoose connection: ' + err);
    else    console.log('Successful mongoose connection.');
  });

/**
    * Middlewares
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
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
