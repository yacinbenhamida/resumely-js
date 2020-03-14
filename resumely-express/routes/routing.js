// Controllers
import usersController from '../controllers/userManagement/usersController'
import forgotPassword from '../controllers/userManagement/forgotPasswordController'
import predict from '../controllers/predictionController';

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
        .get(predict.RootPage); 
    app.route('/predict')
        .post(predict.doPredict);
};