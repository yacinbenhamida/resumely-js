import request from 'request';
import ScrapRequest from '../../models/scraprequest'
require('dotenv').config();
import Notification from '../../models/notification'
const flask_rest = process.env.PY_URI;

exports.scrapData = (req,res)=>{
    var initScrappingRequest = new ScrapRequest({
        country : req.body.country,
        ownerUsername : req.body.username,
        ownerId : req.body.ownerid,
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
            request({
                uri: `${flask_rest}/scrap/${docs.country}/${docs._id}`,
            }).pipe(res);
        } 
    })
}
exports.checkScrapper = (req,res) => {
    ScrapRequest.find({
        ownerId : req.body.id,
        currentState : req.body.currentstate
    },
        (err,docs)=>{
            if(err) res.status(400)
            else res.send(docs)
        })
}
exports.cancelScrapping = (req,res) => {
    ScrapRequest.findOneAndUpdate({_id : req.body.id},{currentState : "done"},(err,docs)=>{
        if(err) res.status(404)
        else{
            const notif = new Notification({
                targetedUserId : docs.ownerId,
                content : "scrapping request created at "+docs.createdAt.toISOString().replace(/T/, ' ').replace(/\..+/, '')+" cancelled.",
                type : "scrapping"
            }).save((e,d)=>{
                if(e) console.log(e)
                res.status(200).send(docs)
            })
        } 
    })
}

exports.scrapSingleProfile = (req,res) => {
    var initScrappingRequest = new ScrapRequest({
        country : req.body.country,
        ownerUsername : req.body.username,
        ownerId : req.body.ownerid,
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
            request.post(`${flask_rest}/scrap-single`, {
                json: {
                  url : req.body.url,
                  idop: docs._id
                }
              }, (error, res, body) => {
                if (error) {
                  console.error(error)
                  return
                }
                console.log(`statusCode: ${res.statusCode}`)
                console.log(body)
              })           
        } 
    })
}