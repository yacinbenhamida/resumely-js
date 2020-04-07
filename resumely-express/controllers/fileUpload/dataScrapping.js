import request from 'request';
import ScrapRequest from '../../models/scraprequest'
require('dotenv').config();
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
    //res.send('can access with token ' + req.query.secret_token)
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
    ScrapRequest.findOneAndUpdate({_id : req.body.id},{currentState : "stopped"},(err,docs)=>{
        if(err) res.status(404)
        else res.status(200).send(docs)
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