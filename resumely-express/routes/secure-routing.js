// Controllers
import usersController from '../controllers/userManagement/usersController'
import dataScrapping from '../controllers/fileUpload/dataScrapping'
import dashboardController from '../controllers/dashboardController'
import notificationsController from '../controllers/notificationsController'
import fileUpload from '../controllers/fileUpload/fileUploadController'
import flaskCon from '../controllers/userManagement/flaskConnector'
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
    app.use('/dashboard/countriesCount', passport.authenticate('jwt', {
        session: false
    })).get('/dashboard/countriesCount', dashboardController.countryRatio);
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
    app.use('/update-file-status/:id', passport.authenticate('jwt', {
        session: false
    })).post('/update-file-status/:id', fileUpload.updateFileStatus);
    app.use('/flask-disconnect', passport.authenticate('jwt', {
        session: false
    })).get('/flask-disconnect',flaskCon.disconnectFromFlaskApp); 
    app.use('/dashboard/latest-candidates', passport.authenticate('jwt', {
        session: false
    })).get('/dashboard/latest-candidates',dashboardController.getNewestCandidates);
};