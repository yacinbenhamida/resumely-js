import usersc from '../controllers/usersController';
import predict from '../controllers/predictionController';
import forgotPassword from '../controllers/userManagement/forgotPasswordController'
/**
 * every model should have a get, post put & 
 * delete methods to reduce the route calls in this file
*/
export default (app) => {
    // users
    app.route('/users')
        .get(usersc.getAllUsers)
        .post(usersc.createUser);

    app.route('/users/:userId')
        .get(usersc.getUser)
        .put(usersc.updateUser)
        .delete(usersc.deleteUser);
    // prediction
    app.route('/predict')
        .get(predict.RootPage); 
    app.route('/predict')
        .post(predict.doPredict);

  
    // user management, auth sign up & account management
    app.route('/user/forgotPassword')
        .post(forgotPassword.forgotPassword);
    app.route('/user/reset')
        .get(forgotPassword.resetPassword);
    app.route('/user/updatePasswordviaEmail')
        .post(forgotPassword.updatePasswordViaEmail)
};