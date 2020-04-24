const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user');
import bcrypt from 'bcrypt'
require('dotenv').config()
// Registration
exports.signup = passport.authenticate('signup', {
    session: false
}), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
}

// Local Login
exports.login = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = 'Bad Credentials'; // new Error()
                // return next(error);
                return res.json({
                    error
                });
            }
            req.login(user, {
                session: false
            }, async (error) => {
                if (error) return next(error)

                // Check login provider
                if (user.provider != 'local') {
                    const error = 'Not a local account';
                    return res.json({
                        error
                    });
                }
                // We don't want to store the sensitive information such as the
                // user password in the token so we pick only the email and id
                const body = {
                    _id: user._id,
                    email: user.email
                };
                // Sign the JWT token and populate the payload with the user email and id
                const token = jwt.sign({
                    user: body
                }, process.env.PASSPORT_SECRET);

                user.password = null;

                // Send back the token to the user
                return res.json({
                    token,
                    user
                });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
}

// FB Login
exports.notifyFacebookLogin = async (req, res, next) => {
    const data = req.body;

    const {
        id,
        name,
        email,
        accessToken,
        userID,
        expiresIn,
        picture,
        signedRequest,
        graphDomain,
        first_name,
        last_name,
        data_access_expiration_time
    } = data.data;

    const outData = await getEnsuredThirdPartyUser({
            firstName: first_name,
            lastName: last_name,
            imageUrl: picture.data.url,
            email,
            token: accessToken
        },
        'facebook'
    );

    console.log('Sending data:', outData);

    return res.json({
        'token': outData.token,
        'user': outData.outUser
    });
}

// Google Login
exports.notifyGoogleLogin = async (req, res, next) => {
    const data = req.body;

    const {
        googleId,
        tokenObj,
        profileObj,
    } = data.data;

    console.log(data.data);

    const outData = await getEnsuredThirdPartyUser({
            firstName: profileObj.givenName,
            lastName: profileObj.familyName,
            imageUrl: profileObj.imageUrl,
            email: profileObj.email,
            token: tokenObj.access_token
        },
        'google'
    );

    console.log('Sending data:', outData);

    return res.json({
        'token': outData.token,
        'user': outData.outUser
    });
}

// Profile (Secure Route)
exports.profile = (req, res, next) => {
    // We'll just send back the user details and the token
    return res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
}

exports.editProfile=(req,res,next)=>{
    console.log(req.body.user)
}

exports.editPicture=(req,res,next)=>{
    console.log(req.body.Image)
    console.log(req.body.id)
}

exports.verifyPassowrd= (req,res)=>
{ 
    if(req.body.username){
        UserModel.findOne({
            username : req.body.username
        }).then(user => {
            if(user){
                 
               
                bcrypt.compare(req.body.password, user.password)
                .then(validatedPassword => {
                 if(validatedPassword == true)
                res.status(200).send({message : 'password validated'})
                
                 else
                 res.status(200).send({message : 'password unvalidated'})
                })
            }else {
                
                res.status(404).json('no user exists to update')
            }
        })
    } else res.status(400).json('username is mandatory')

}
/**
 * Utils
 */

const getEnsuredThirdPartyUser = async (user, provider) => {
    // Find the user associated with the email provided by the user

    let outUser = await UserModel.findOne({
        email: user.email
    });

    if (!outUser) {
        // Save the information provided by the user to the the database
        outUser = await UserModel.create({
            username: getNewUsername(user.email),
            email: user.email,
            password: provider,
            provider: provider,
            imageUrl: user.imageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }

    const body = {
        // _id: outUser._id,
        email: user.email
    };
    // Sign the JWT token and populate the payload with the user email and id
    const token = jwt.sign({
        user: body
    }, process.env.PASSPORT_SECRET);

    user.password = null;

    // Send back the token to the user
    return {
        token,
        outUser
    };
}

// TODO: Create a unique username upon third party login
const getNewUsername = (email) => {
    return email;
}