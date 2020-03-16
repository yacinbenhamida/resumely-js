const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/user.model');
 
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
                // We don't want to store the sensitive information such as the
                // user password in the token so we pick only the email and id
                const body = {
                    _id: user._id,
                    email: user.email
                };
                // Sign the JWT token and populate the payload with the user email and id
                const token = jwt.sign({
                    user: body
                }, 'top_secret');
                // Send back the token to the user
                return res.json({
                    token
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

    res.json({
        message: 'Facebook login authorized',
        user: req.user
    });

    const {
        id,
        name,
        email,
        accessToken,
        userID,
        expiresIn,
        signedRequest,
        graphDomain,
        first_name,
        last_name,
        data_access_expiration_time
    } = data.data;

    const user = getEnsuredThirdPartyUser(
        {
            firstName: first_name, lastName: last_name, email, token: accessToken 
        },
        'facebook'
    );
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

/**
 * Utils
 */

const getEnsuredThirdPartyUser = async (user, provider) => {
    // Find the user associated with the email provided by the user

    // TODO: Validate the token
    // source: https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#checktoken

    const existUser = await UserModel.findOne({
        email: user.email
    });

    if(existUser)
        return existUser
    
    // Save the information provided by the user to the the database
    const createdUser = await UserModel.create({
        username: user.email, // getNewUsername(user.firstName),
        email: user.email,
        password: user.token,
        provider: provider,
        firstName: user.firstName,
        lastName: user.lastName,
    });

    return createdUser;
}

// TODO: Create a unique username upon third party login
const getNewUsername = (name) => {
    return name;
}