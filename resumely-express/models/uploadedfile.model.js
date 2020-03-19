const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UploadedFiles = new Schema({
    filename :  {   type : String,  unique : true   },
    ownerUsername : {   type : String ,  required : true},
    ownerId : { type : String, required : true }
}, {collection : 'files'})
module.exports = mongoose.model('files', UploadedFiles)