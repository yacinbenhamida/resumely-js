import mongoose from 'mongoose';
import mongoosastic from 'mongoosastic'

const CandidateSchema = new mongoose.Schema({
    firstName:  {   type: String },
    lastName:   {     type: String    },
    country:    {   type: String    },
   // age:    {   type: Number   },
    currentPosition:    {   type: String  , es_indexed: false  },
    profile:    {   type: String  , es_indexed: false  } ,
    livesIn:    {   type:String     },
    image_url:  {   type : String  , es_indexed: false },
    /*experiences : [{
        job_details : String,
        job : String,
        job_date : String
    }],*/
    presentation : {    type : String  , es_indexed: false },
   /* education : [{
            university : String,
            date : String,
            diploma : String
        }],*/
    skills : {type: [String] ,es_indexed: false}
}, {collection : 'profiles'}) 


CandidateSchema.plugin(mongoosastic, {
    hosts: [
      'http://51.178.142.162:9200'
  ],
  type: 'profile',
});
var Candidate=mongoose.model('profile', CandidateSchema,'profiles')

module.exports =  Candidate;