
var path = require('path')
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
const client = require('./elasticsearch/connection');
import mongoosastic from 'mongoosastic' 
import candidate from './models/candidate'
import fs from 'fs'
import passport from 'passport';
import routes from './routes/routing';
import secureRoutes from './routes/secure-routing';
import Candidate from './models/candidate'
import esClient from './elasticsearch/connection'
const app = express();


import cors from 'cors';
require('dotenv').config();
require('./auth/auth'); // Middleware for request authentication.

/**
 * Connect to the database
 * Supress deprecation warnings for babel usage
 */

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
}, (err) => {
    if (err) console.log('Error during mongoose connection: ' + err);
    else 
    {
        console.log('Successful mongoose connection.');

        // Quick DB Test
        // UserModel.find({}, (err, users) => {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log(users)
        // });
    }
});

 //indexing data
let stream = Candidate.synchronize()
let count = 0;

stream.on('data', function(err, doc){
  
      

    /*  if(doc.livesIn.includes('Tunisie'))
      {
        console.log(doc.livesIn)
     
     
      
      }*/
    
      count = count +1 ;
 //  Candidate.findOneAndUpdate() 

         
});
stream.on('close', function(){
console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
console.log(err);
});
 

/* ping to elastic search */

esClient.ping({
    // ping usually has a 3000ms timeout
        requestTimeout: 1000
    }, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    });

/**
 * Middlewares
 */



app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// Catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});
// create an uploads folder incase it got deleted
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}
/**
 * Register the routes
 */

// We plugin our jwt strategy as a middleware so only verified users can access specified routes
secureRoutes(app, passport);
routes(app);

export default app;