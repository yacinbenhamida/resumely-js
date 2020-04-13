import User from '../../models/user'
require('dotenv').config;
import nodemailer from 'nodemailer';
import crypto from "crypto";
import bcrypt from 'bcrypt';
import Notification from '../../models/notification'
const BCRYPT_SALT_ROUNDS = 12;



// POST /user/forgotPassword
exports.forgotPassword = (req,res) => {
    if(req.body.email){
        User.findOne({
            email : req.body.email    
        }).then((user)=>{
            console.log(user)
            console.log(req.body.email)

            if(user){
                const token = crypto.randomBytes(20).toString('hex')
                User.updateOne({
                    email : req.body.email
                },{
                    resetPasswordToken : token,
                    resetPasswordExpires : Date.now() + 3600000
                },(error,res)=>{
                    if(error) console.log(error)
                    console.log('res is '+res)
                })
                //sending email information
                const tranporter = nodemailer.createTransport({
                    service : 'gmail',
                    auth : {
                        user : `${process.env.EMAIL_ADRESS}`,
                        pass : `${process.env.EMAIL_PASSWORD}`
                    }
                })
                const mailOptions = {
                    from : `${process.env.EMAIL_ADRESS}`,
                    to : `${user.email}`,
                    subject : 'Resumely - Reset your password',
                    html : '<h1>Resumely account password Reset</h1><p> You requested a password change (or someone else), to do so please click on the following link </p> \n'
                    +`<a href="http://localhost:3000/reset/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: "Source Sans Pro", Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>` 
                    +'<p> or paste it to your web browser to complete the password reset process within one hour of recieving it </p>\n'
                    + ` link http://localhost:3000/reset/${token}`
                    + '\n <h3> Resumely team </h3>'
                };
                console.log('sending email')
                tranporter.sendMail(mailOptions , (err,response)=>{
                    if(err){
                        console.error('there was an error sending the email \n '+err)
                    }else {
                        console.log('email sent, response is : '+res)
                        res.status(200).send('recovery email sent')
                    }
                })
            }
            else{
                console.error('email not registerd')
                res.status(403).send('email not registered')
            }
        })
    }
    else res.status(400).send('email required');
};
// resetting the password GET /user/reset
exports.resetPassword = (req, res) => {
    User.findOne({
        resetPasswordToken : req.query.resetPasswordToken,
        resetPasswordExpires : { $gt : Date.now() }
    }).then(user => {
        console.log(user)
        if(user){
            res.status(200).send({
                username : user.username,
                message : ('password reset link ok')
            }) 
        }else {
            console.log('password reset link is invalid or expired')
            res.json('password reset link expired or invalid')
        }
    })
}
//PUT
exports.updatePasswordViaEmail = (req, res) => {
    if(req.body.username){
        User.findOne({
            username : req.body.username
        }).then(user => {
            if(user){
                console.log('user found ')   
                bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
                .then(hashedPassword => {
                    User.updateOne({username : req.body.username},{
                        password : hashedPassword,
                        resetPasswordToken : null,
                        resetPasswordExpires : null
                    },(error,res)=>{
                        if(error) console.log(error)
                        console.log('res is '+res)
                    })
                }).then(()=>{
                    console.log('password updated')
                    let notif = new Notification({
                        targetedUserId : user._id,
                        content : "you have recently updated your password",
                        type : "account",
                        createdAt : Date.now()
                    }).save((e,d)=>{
                        if(e) console.log(e)
                        console.log('notification sent')
                    })
                    res.status(200).send({message : 'password updated'})
                })
            }else {
                console.error('user not found to update')
                res.status(404).json('no user exists to update')
            }
        })
    } else res.status(400).json('username is mandatory')
}