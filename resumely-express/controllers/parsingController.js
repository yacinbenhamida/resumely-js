const parseIt = require('../utils/parseIt')
const multer  = require('multer')
const crypto  = require('crypto')
const mime    = require('mime')
const path = require('path')
const fs = require('fs')
let modelcv = require('../models/modelcv')

exports.RootPage = (req, res, next) => {
    console.log("Parsing RootPage Success");

    fs.readdir('./uploads', function (err, files) {
        // Handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // Listing all files using forEach
        files.forEach(function (file) {
            console.log(file);
            parseIt.parseResume('./uploads/' + file, './compiled');
            res.status(204).end();
        });
    });
}

exports.insert = (req, res, next) => {
    fs.readdir('./compiled', function (err, files) {
        // Handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // Listing all files using forEach
        files.forEach(function (file) {
            fs.readFile('./compiled/' + file, 'utf8', function (err, data) {
                if (err) throw err;
                var json = JSON.parse(data);
                let CvObj = new modelcv(json)
                CvObj.save(function (err, result) {
                    console.log('saved into dataset')
                    if (err) {
                        console.log('ERROR'),
                            res.status(500).send()
                    }
                    res.status(200).send()
                });

            });
        });
    });
};