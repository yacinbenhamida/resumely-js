import mongoose from 'mongoose'; 
import request from 'request';
import User from '../../models/user.model'
require('dotenv').config;
import nodemailer from 'nodemailer';
import crypto from "crypto";
import { response } from 'express';
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 12;

// get
exports.initPassword = (req, res) => {
    res.send('forgot password page ')
};
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
                    text : 'You requested a password change (or someone else), to do so please click on the following link \n'
                    +' or paste it to your web browser to complete the password reset process within one hour of recieving it \n'
                    + ` link http://localhost:3000/reset/${token}`
                    + '\n Resumely team '
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
                    res.status(200).send({message : 'password updated'})
                })
            }else {
                console.error('user not found to update')
                res.status(404).json('no user exists to update')
            }
        })
    } else res.status(400).json('username is mandatory')
}