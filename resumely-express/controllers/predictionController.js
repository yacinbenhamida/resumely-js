import mongoose from 'mongoose'; 
import request from 'request';

const headers = {
    "Content-Type": "application/json"
  };

const py_url = "http://localhost:5555";

exports.RootPage = (req, res) => {
    res.send('NYI: Would be used to list user\'s old predictions.')
};

exports.doPredict = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
    request({
        uri: `${py_url}/${firstName}/${lastName}`,
    }).pipe(res);
};