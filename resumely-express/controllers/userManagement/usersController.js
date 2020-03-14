const passport = require('passport');
const jwt = require('jsonwebtoken');

// Registration
exports.signup = passport.authenticate('signup', {
    session: false
}), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
}

// Login
exports.login = async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An Error occurred')
                return next(error);
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

// Profile (Secure Route)
exports.profile = (req, res, next) => {
    // We'll just send back the user details and the token
    return res.json({
        message: 'You made it to the secure route',
        user: req.user,
        token: req.query.secret_token
    })
}