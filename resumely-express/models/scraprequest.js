import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const ScrapRequest = new Schema({
    country :  {   type : String   },
    expectedNoOfRows : {    type : Number   },
    currentNoOfRows : {     type : Number   },
    ownerUsername : {   type : String ,  required : true    },
    ownerId : { type : String, required : true },
    currentState : {    type : String   },
    scrapAge    :   {   type : Boolean, default : true  },
    scrapEducation    :   {   type : Boolean, default : true  },
    scrapImage    :   {   type : Boolean, default : true  },
    scrapExperience    :   {   type : Boolean, default : true  },
    scrapSkills    :   {   type : Boolean , default : true },
    createdAt : {type : Date},
}, {collection : 'scraprequests'})
module.exports = mongoose.model('scraprequests', ScrapRequest)