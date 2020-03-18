// Controllers
import usersController from '../controllers/userManagement/usersController'

/**
 * All routes that require a token should be pasted in here
 */
export default (app, passport) => {

    // Displays information tailored according to the logged in user
    app.use('/profile', passport.authenticate('jwt', {
        session: false
    })).get('/profile', usersController.profile);
    
};