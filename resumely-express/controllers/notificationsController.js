import Notification from '../models/notification'
exports.getAll = (req,res) => {
    Notification.find({
        targetedUserId : req.body.id,
        state : false
    },
        (err,docs)=>{
            if(err) res.status(400)
            else res.send(docs)
        })
}