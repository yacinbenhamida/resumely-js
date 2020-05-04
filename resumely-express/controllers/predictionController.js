import request from 'request';
require('dotenv').config()
const headers = {
    "Content-Type": "application/json"
};

const py_url = process.env.PY_URI;

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

exports.doCorrect = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const label = req.body.label;
    
    request({
        uri: `${py_url}/${firstName}/${lastName}/${label}`,
    }).pipe(res);
}