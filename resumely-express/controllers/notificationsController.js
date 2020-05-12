import Notification from '../models/notification'
import User from '../models/user'
exports.getAll = (req,res) => {
    User.findOne({
        $or: [{ username: req.user.email }, { email: req.user.email }]
    },{_id : 1},(error,user)=>{
        if(error) res.send([])
        if(user && user._id){
            Notification.find({
            targetedUserId : String(user._id),
            seen : false
        },
            (err,docs)=>{
                if(err) res.send([])
                else res.send(docs)
            })
        }
        else res.send([])
    })
}