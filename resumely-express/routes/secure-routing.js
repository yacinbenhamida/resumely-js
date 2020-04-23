// Controllers
import usersController from '../controllers/userManagement/usersController'
import dataScrapping from '../controllers/fileUpload/dataScrapping'
import dashboardController from '../controllers/dashboardController'
import notificationsController from '../controllers/notificationsController'
import fileUpload from '../controllers/fileUpload/fileUploadController'
/**
 * All routes that require a token should be pasted in here
 */
export default (app, passport) => {

    // Displays information tailored according to the logged in user
    app.use('/profile', passport.authenticate('jwt', {
        session: false
    })).get('/profile', usersController.profile);
    app.use('/scrapping', passport.authenticate('jwt', {
        session: false
    })).post('/scrapping', dataScrapping.scrapData);
    app.use('/check-scrapping', passport.authenticate('jwt', {
        session: false
    })).post('/check-scrapping', dataScrapping.checkScrapper);
    app.use('/stop-scrapping', passport.authenticate('jwt', {
        session: false
    })).post('/stop-scrapping', dataScrapping.cancelScrapping);
    app.use('/single-scrapping', passport.authenticate('jwt', {
        session: false
    })).post('/single-scrapping', dataScrapping.scrapSingleProfile);
    app.use('/dashboard/numbers', passport.authenticate('jwt', {
        session: false
    })).get('/dashboard/numbers', dashboardController.numbers);
    app.use('/notifications/all', passport.authenticate('jwt', {
        session: false
    })).post('/notifications/all', notificationsController.getAll);

    app.use('/upload-files', passport.authenticate('jwt', {
        session: false
    })).post('/upload-files', fileUpload.uploadFiles);
    app.use('/all-files', passport.authenticate('jwt', {
        session: false
    })).get('/all-files', fileUpload.getAllUserFiles);
    app.use('/delete-files', passport.authenticate('jwt', {
        session: false
    })).post('/delete-files', fileUpload.deleteFiles);
    app.use('/parse-file', passport.authenticate('jwt', {
        session: false
    })).post('/parse-file', fileUpload.parseFile);
    app.use('/parse-file-data', passport.authenticate('jwt', {
        session: false
    })).post('/parse-file-data', fileUpload.getParsedData);
    
};