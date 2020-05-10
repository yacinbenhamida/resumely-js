require('dotenv').config();
import Candidate from '../models/candidate'
import ScrapRequest from '../models/scraprequest'
import User from '../models/user'
import UploadeFile from '../models/uploadedfile'
import index from '../data/index';
exports.numbers = (req, res) => {
    User.findOne({
        $or: [{ username: req.user.email }, { email: req.user.email }]
    }, { _id: 1 }, (error, user) => {
        UploadeFile.countDocuments({ ownerId: String(user._id) }, (err, fileCount) => {
            ScrapRequest.countDocuments({ ownerId: String(user._id) }, (err, scrapCounts) => {
                Candidate.countDocuments({}, (err, count) => {   
                    ScrapRequest.aggregate(
                        [{
                            $match: {
                                ownerId: String(user._id)
                            }
                        },
                        {
                            $group: {
                                _id: String(user._id),
                                total: { $sum: "$currentNoOfRows" }
                            }
                        }]
                        , (err, countscrappedProfiles) => {
                            if(err){
                                res.send({
                                    nbCandidates: count, scrapCount: scrapCounts,
                                    fileCount: (fileCount ? fileCount : 0), countscrappedProfiles : 0
                                })
                            }  
                            if(countscrappedProfiles && countscrappedProfiles[0] && countscrappedProfiles[0].total){
                                res.send({
                                    nbCandidates: count, scrapCount: scrapCounts,
                                    fileCount: (fileCount ? fileCount : 0)
                                    , countscrappedProfiles: (countscrappedProfiles ?countscrappedProfiles[0].total : 0) 
                                })
                            }  
                            else {
                                res.send({
                                    nbCandidates: count, scrapCount: scrapCounts,
                                    fileCount: (fileCount ? fileCount : 0), countscrappedProfiles : 0
                                })
                            }             
                            })
                        })
                    })
                });
            })
}

exports.countryRatio = (req, res) => {
    Candidate.aggregate([
        {
            $match: {
                country: { "$exists": true }
            }
        },
        {
            $redact: {
                $cond: [
                    { $lte: [{ $strLenCP: "$country" }, 10] },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            }
        },
        {
            $group: {
                _id: '$country',
                count: { $sum: 1 }
            }
        }
    ], (err, countries) => {
        res.send({ countriesByCount: countries })
    })
}
exports.getNewestCandidates = (req,res)=> {
    User.findOne({
        $or: [{ username: req.user.email }, { email: req.user.email }]
    }, { _id: 1 }, (error1, user) => {
        if(error1) res.send(401)
        if(user){
            Candidate.find({}).sort({_id : -1}).limit(7).exec((err2,result)=>{
                if(err2) res.status(404)
                res.send(result)
            })
        }
    })
}