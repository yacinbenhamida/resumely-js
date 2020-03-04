import usersc from '../controllers/usersController';
import predict from '../controllers/predictionController';

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
    app.route('/predict/add')
        .get(predict.doPredict)

    /* every model should have a get, post put & 
        delete methods to reduce the route calls in this file */
    
};