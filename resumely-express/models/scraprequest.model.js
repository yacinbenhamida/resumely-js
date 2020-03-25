import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const ScrapRequest = new Schema({
    country :  {   type : String   },
    expectedNoOfRows : {    type : Number   },
    currentNoOfRows : {     type : Number   },
    ownerUsername : {   type : String ,  required : true    },
    ownerId : { type : String, required : true },
    currentState : {    type : String   },
    createdAt : {type : Date},
}, {collection : 'scraprequests'})
module.exports = mongoose.model('scraprequests', ScrapRequest)