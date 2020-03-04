import mongoose from 'mongoose'; 
import request from 'request';

const headers = {
    "Content-Type": "application/json"
  };

const py_url = "http://localhost:5555";

// placeholder page
exports.RootPage = (req, res) => {
    res.send('Listing your old predictions...')
};
// method name used in routing.js
exports.doPredict = (req, res) => {
    console.log('????');
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
    request({
        uri: `${py_url}/${firstName}/${lastName}`,
        /*
        qs: {
            firstName,
            lastName
        }
        */
    }).pipe(res);

    // res.json(out);
    // res.json({'Prediction': 'Tunisia'});

    // Save last predictions?
    // Call python API
};