// Controllers
import usersController from '../controllers/userManagement/usersController'
import forgotPassword from '../controllers/userManagement/forgotPasswordController'

import predict from '../controllers/predictionController';
import parser from '../controllers/parsingController';
import fileUpload from '../controllers/fileUpload/fileUploadController'


import predictionController from '../controllers/predictionController';
import parsingController from '../controllers/parsingController'
import dataController from '../controllers/dataController'


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
    //edit profile information
    app.route('/editprofile')
        .put(usersController.editProfile)
    app.route('/editpicture')
        .put(usersController.editPicture)
    app.route('/verifypwd')
    .post(usersController.verifyPassowrd)
    app.route('/user/updatePasswordviaProfile')
    .put(forgotPassword.updatePasswordViaProfile)
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
    //Parsing
    app.route('/parsing')
    .post(parser.RootPage);
    app.route('/parsing/database')
    .post(parser.insert);
    app.route('/parsing/parsed')
    .get(parser.parsedresume);
    app.route('/getall')
    .get(parser.getall);
    app.route('/delete/:id')
    .delete(parser.deleteitem)
    app.route('/delete/parsed')
    .get(parser.deleteparsed);
    app.route('/edit-resume/:id')
    .get(parser.editresume)
    app.route('/parsing/predict')
    .post(parsingController.insert);
   
        



    

    // files management
    app.route('/upload-files')
    .post(fileUpload.uploadFiles)
    app.route('/all-files/:id')
    .get(fileUpload.getAllUserFiles)
    app.route('/delete-files')
    .post(fileUpload.deleteFiles)
    
 
  


    //search
    app
    .route('/autocomplete/')
    .get(dataController.autoComplete )
    //match all data
    app
    .route('/allData/:from')
    .get(dataController.getAllData)
    app
    .route('/countries')
    .get(dataController.getCountries);

    app
    .route('/bulk')
    .post(dataController.bulkApi)

};
