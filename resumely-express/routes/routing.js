// Controllers
import usersController from '../controllers/userManagement/usersController'
import forgotPassword from '../controllers/userManagement/forgotPasswordController'
import predict from '../controllers/predictionController';
import parser from '../controllers/parsingController';



/**
 * Every model should have a get, post, put & 
 * delete methods to reduce the route calls in this file
 */
export default (app) => {

    // User management, Auth, Sign-Up & Account management
    app.route('/user/forgotPassword')
        .post(forgotPassword.forgotPassword);
    app.route('/user/reset')
        .get(forgotPassword.resetPassword);
    app.route('/user/updatePasswordviaEmail')
        .put(forgotPassword.updatePasswordViaEmail)
        
    app.route('/signup')
        .post(usersController.signup)

    app.route('/login')
        .post(usersController.login)

    /**
     * Facebook Login
     */
    // source: https://stackoverflow.com/questions/49588692/using-passport-facebook-with-reactjs-and-node-js
    app.route('/oauth/facebook')
        .post(usersController.notifyFacebookLogin)
    app.route('/oauth/google')
        .post(usersController.notifyGoogleLogin)

    // When logout, redirect to client
    app.route('/logout')
        .get(
            (req, res) => {
                req.logout();
                res.redirect(CLIENT_HOME_PAGE_URL);
            }
        )

    // app.route('/profile') => In secure-routing.js

    // Prediction
    app.route('/predict')
        .get(predict.RootPage);
    app.route('/predict')

        .post(predict.doPredict);

        app.route('/parsing')
        .post(parser.RootPage);

    app.route('/parsing/database')
        .post(parser.insert);


};