import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const UploadedFiles = new Schema({
    filename :  {   type : String,  unique : true   },
    ownerUsername : {   type : String ,  required : true},
    ownerId : { type : String, required : true },
    createdAt : {type : Date},
    scanned : {type : Boolean, default : false}
}, {collection : 'files'})
module.exports = mongoose.model('files', UploadedFiles)