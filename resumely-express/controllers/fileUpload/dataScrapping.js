import request from 'request';
import ScrapRequest from '../../models/scraprequest'
require('dotenv').config();
import Notification from '../../models/notification'
import User from '../../models/user'
const flask_rest = process.env.PY_URI;

exports.scrapData = (req,res)=>{
  User.findOne({
    $or: [{ username: req.user.email }, { email: req.user.email }]},
     { _id: 1,username :1 }, (e, user) => {
      let initScrappingRequest = new ScrapRequest({
        country : req.body.country,
        ownerUsername : user.username,
        ownerId : String(user._id),
        createdAt : Date.now(),
        currentState : "started",
        expectedNoOfRows : 0,
        currentNoOfRows : 0,
        scrapAge : req.body.scrapAge,
        scrapEducation : req.body.scrapEducation,
        scrapExperience : req.body.scrapExperience,
        scrapSkills : req.body.scrapSkills,
        type : 'multiple',

    }).save((err,docs)=>{
        if(err) console.log(err)
        else{
            console.log("scrapping triggered...")
            let LocalStorage = require('node-localstorage').LocalStorage,
            localStorage = new LocalStorage('./scratch');
            let options = {
                method: 'GET',
                json: true,
                url: `${flask_rest}/scrap/${docs.country}/${docs._id}`,
                headers: {
                  'Authorization':'Bearer '+localStorage.getItem(req.user.email)
                }
              };
            request(options,(error, result, body) => {
                if (error) {
                  console.error(error)
                  return res.status(result.statusCode)             
                }
                console.log(`statusCode: ${result.statusCode}`)
                console.log(body)
                res.status(200)
              })
        } 
    })
     })
}
exports.checkScrapper = (req, res) => {
  User.findOne({
    $or: [{ username: req.user.email }, { email: req.user.email }]},
     { _id: 1 }, (e, user) => {
    ScrapRequest.find({
      ownerId: String(user._id),
      currentState: req.body.currentstate
    },
      (err, docs) => {
        if (err) res.status(400)
        else res.send(docs)
      })
  })
}
exports.cancelScrapping = (req,res) => {
    User.findOne({
        $or : [{ username : req.user.email},{email : req.user.email}]
      },{_id : 1 },(e,user)=>{
        ScrapRequest.updateMany({ownerId : String(user._id), currentState : "started"},{$set : {currentState : "done" }},(err,docs)=>{
                if(err) res.status(404)
                else{
                    res.status(200)
                } 
            })
      }) 
}

exports.scrapSingleProfile = (req,res) => {
  User.findOne({
    $or: [{ username: req.user.email }, { email: req.user.email }]},
     { _id: 1,username : 1 }, (e, user) => {
      let initScrappingRequest = new ScrapRequest({
        country : req.body.country,
        ownerUsername : user.username,
        ownerId : String(user._id),
        createdAt : Date.now(),
        currentState : "started",
        type : 'single',
        scrapAge : req.body.scrapAge,
        scrapEducation : req.body.scrapEducation,
        scrapExperience : req.body.scrapExperience,
        scrapSkills : req.body.scrapSkills,
    }).save((err,docs)=>{
        if(err) console.log(err)
        else{
            console.log("single profile scrapping triggered...")
            let LocalStorage = require('node-localstorage').LocalStorage,
            localStorage = new LocalStorage('./scratch');
            let options = {
                method: 'POST',
                body: {
                    url : req.body.url,
                    idop: docs._id
                  },
                json: true,
                url: `${flask_rest}/scrap-single`,
                headers: {
                  'Authorization':'Bearer '+localStorage.getItem(req.user.email)
                }
              };
              request(options, (error, result, body) => {
                if (error) {
                  console.error(error)
                  return res.status(result.statusCode)
                }
                console.log(`statusCode: ${result.statusCode}`)
                console.log(body)
                res.status(result.statusCode)
              })      
        } 
    })
     })  
}