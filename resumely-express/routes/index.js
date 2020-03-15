const express = require('express'),

      router  = express.Router(),
      parseIt = require('../utils/parseIt'),
      multer  = require('multer'),
      crypto  = require('crypto'),
      mime    = require('mime')
      const path = require('path');
const fs = require('fs');
let modelcv = require('../models/modelcv')
//joining path of directory 

      /*upload  = multer({
        storage: multer.diskStorage({
          destination: function (req, file, cb) {
            cb(null, './uploads/')
          },
          filename: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
              cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
          }
        })
      });*/

/* GET home page. */
/*router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});*/


router.post('/', function (req, res, next) {
  console.log("success");
 // console.log(req.file.path);
 fs.readdir('./uploads', function (err, files) {
  //handling error
  if (err) {
      return console.log('Unable to scan directory: ' + err);
  } 
  //listing all files using forEach
  files.forEach(function (file) {
    console.log(file); 
    parseIt.parseResume('./uploads/'+file, './compiled');
    res.status(204).end();
  });
});
});

router.post('/insert', function (req, res, next) {
  fs.readdir('./compiled', function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
  files.forEach(function (file) {
  fs.readFile('./compiled/'+file, 'utf8', function (err, data) {
    if (err) throw err;
      var json = JSON.parse(data);
      let CvObj = new modelcv(json)
      CvObj.save(function (err, result) {
        console.log('saved into dataset')
        if(err){
            console.log('ERROR'),
            res.status(500).send()
        }
        res.status(200).send()
      });

});
});
});
});


module.exports = router;
