import request from 'request';
import User from '../../models/user'
require('dotenv').config()
const flask_rest = process.env.PY_URI;

exports.loginToflaskApp = (req,res) => {
    let LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
    User.findOne({
        $or : [{ username : req.user.email},{email : req.user.email}]
      },{_id : 1, email : 1, password : 1 },(e,user)=>{
        request.post(`${flask_rest}/login`,{
            json : {
                email : user.email,
                password: user.password
            }
        }, (error, res, body) => {
            if (error) {
              console.error(error)
              return
            }
            console.log(`statusCode: ${res.statusCode}`)
            console.log(body)
            localStorage.setItem(req.user.email, body.access_token);
            console.log(localStorage.getItem(req.user.email))
          })
          res.send({token : localStorage.getItem(req.user.email)})
      })
}
exports.disconnectFromFlaskApp = (req,res) => {
    let LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');
    localStorage.removeItem(req.user.email)
    console.log('disconnected from flask app')
    res.send({ status : "disconnected" })
}
