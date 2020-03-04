const router = require('express').Router();
const request = require('request');

const headers = {
    "Content-Type": "application/json"
  };

const py_url = "http://localhost:5555";


router.route('/').get((req, res) => {
    res.send('Listing your old predictions...')
});

router.route('/predict').post((req, res) => {
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

});

module.exports = router;
