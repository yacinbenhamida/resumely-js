require('dotenv').config();
import Candidate from '../models/candidate'
exports.numbers = (req,res)=>{
    const nbCandidates = Candidate.countDocuments({},(err,count)=>{
        res.send({nbCandidates : count})
    });
}