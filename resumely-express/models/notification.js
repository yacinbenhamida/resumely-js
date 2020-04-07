import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const Notification = new Schema({
    targetedUserId : {type : String,required : true},
    content : {type : String},
    type : {type : String, enum : ['scrapping','files','account']},
    seen : {type : Boolean , default : false},
    createdAt : {type : Date}
}, {collection : 'notifications'})
module.exports = mongoose.model('notifications', Notification)