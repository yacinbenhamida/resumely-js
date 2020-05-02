require('dotenv').config();
import Candidate from '../models/candidate'
import ScrapRequest from '../models/scraprequest'
import User from '../models/user'
import UploadeFile from '../models/uploadedfile'
import index from '../data/index';
exports.numbers = (req, res) => {
    User.findOne({
        email: req.user.email
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
                                res.send({
                                    nbCandidates: count, scrapCount: scrapCounts,
                                    fileCount: fileCount, countscrappedProfiles: countscrappedProfiles[0].total
                                })
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
