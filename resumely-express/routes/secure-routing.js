// Controllers
import usersController from '../controllers/userManagement/usersController'
import dataScrapping from '../controllers/fileUpload/dataScrapping'
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
};