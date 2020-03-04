const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // To parse JSON

// DB

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection eslablished successfully.");
});

// Routes

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const predictionRouter = require('./routes/prediction');
app.use('/prediction', predictionRouter);

// Start

app.listen(port, () => {
    console.log(`Server is running on port: ${port}.`);
});
