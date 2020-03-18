import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic'

const esClient = require('./../elasticsearch/connection');

const CandidateSchema = new mongoose.Schema({

    firstName:
     {
            type: String
    },
    lastName: 
    {
            type: String
    },
    country: 
    {
            type: String
    }
    ,
    currentPosition:
    {
        type: String
    },
      
    profile:
    {
        type: String
    } ,

    livesIn:{
      type:String
    }

}, {collection : 'profiles'}) 



CandidateSchema.plugin(mongoosastic, {
    "host": "localhost",
    "port": 9200,
   
});
const Candidate=mongoose.model('profile', CandidateSchema)

module.exports =  Candidate;