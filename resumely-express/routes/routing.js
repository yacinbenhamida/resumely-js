// Controllers
import usersController from '../controllers/userManagement/usersController'
import forgotPassword from '../controllers/userManagement/forgotPasswordController'
import predictionController from '../controllers/predictionController';
import parsingController from '../controllers/parsingController'


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
        .post(forgotPassword.updatePasswordViaEmail)
        
    app.route('/signup')
        .post(usersController.signup)

    app.route('/login')
        .post(usersController.login)

    // app.route('/profile') => In secure-routing.js

    // Prediction
    app.route('/predict')
        .get(predictionController.RootPage); 
    app.route('/predict')
        .post(predictionController.doPredict);

    // Parsing of Resumes
    app.route('/parsing')
        .get(parsingController.RootPage);

    app.route('/parsing/predict')
        .post(parsingController.insert);
};