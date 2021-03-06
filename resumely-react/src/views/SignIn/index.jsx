import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
// Services
import usersService from 'services/users.service';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';
import { OS, currentBrowser } from './platerform';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons
import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

// Shared components
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';

// Component styles
import styles from './styles';

// Form validation schema
import schema from './schema';
const addCnx = (TargetUser,TargetOs,TargetBrowser,TargetLocal) => {
  return axios.post(process.env.REACT_APP_BACKEND+'/user/addCnx',{
    username : TargetUser,
    Os:TargetOs,
    Browser:TargetBrowser,
    Localisation:TargetLocal
  })
};
const GOOGLE_API = "https://maps.google.com/maps/api/geocode/json";
const  key="AIzaSyCb7JUS-ZKpLY7FYFuKW4eAMoStiGsaroY";
class SignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      values: {
        email: '',
        password: ''
      },
      touched: {
        email: false,
        password: false
      },
      errors: {
        email: null,
        password: null
      },
      isValid: false,
      isLoading: false,
      submitError: null,
      OS: '',
      browser: '',
      localisation:''
   
     
    };
  }


  componentDidMount=async() => {
    

  await this.setState({OS:OS(window),browser:currentBrowser(window)})

    console.log( this.state.OS);
    console.log( this.state.browser);
    
  await navigator.geolocation.getCurrentPosition(
        position => 
        {
          axios.get(GOOGLE_API+"?latlng="+ position.coords.latitude+","+position.coords.longitude+"&key="+key) 
          .then(response =>
           { const address = response.data.results[2].formatted_address;
          
            this.setState({localisation:address })

             console.log(this.state.localisation )
             
            ;}
            )
          .catch(error => console.log(error)) 
        }
 
      , 
        err => console.log(err)
      );
       
     
  }
  // Local Functions

  handleBack = () => {
    const { history } = this.props;

    history.goBack();
  };

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);

    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };
  

  handleSignIn = async () => {
    try {
      const { history } = this.props;
      // const { values } = this.state;

      this.setState({ isLoading: true });

      const { data } = await usersService.Login(this.state.values.email, this.state.values.password);
      const token = data.token;
      const error = data.error;

      if (error || !token) {
        console.log(error)
        this.setState({ isLoading: false });
        return;
      }

      const user = data.user;
    
      await addCnx(user.username,this.state.OS,this.state.browser,this.state.localisation).then(res=>{
        console.log(res.data.message)
      });
      localStorage.setItem('isAuthenticated', true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      history.push('/dashboard');
    } catch (error) {
      this.setState({
        isLoading: false,
        serviceError: error
      });
    }
  };

  responseFacebook = async (response) => {
    const { history } = this.props;

    console.log(response.accessToken)
    if (!response.accessToken) return;

    // Notify backend to create if this is a new account.
    const { data } = await usersService.notifyFacebookLogin(response);
    console.log(data);
    if (data.error) return;

    const user = data.user;
    await addCnx(user.username,this.state.OS,this.state.browser,this.state.localisation).then(res=>{
      console.log(res.data.message)
    });
    console.log(user.firstName)
    console.log(user)

    localStorage.setItem('isAuthenticated', true);
    // localStorage.setItem('token', response.accessToken);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));

    history.push('/dashboard');
  }

  responseGoogle = async (response) => {
    const { history } = this.props;

    if (!response?.tokenObj) return;


    const { data } = await usersService.notifyGoogleLogin(response);
    console.log(data);
    if (data.error) return;

    // const token = response.tokenObj.access_token;
    const token = data.token
    const user = data.user;
    await addCnx(user.username,this.state.OS,this.state.browser,this.state.localisation).then(res=>{
      console.log(res.data.message)
    });
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    history.push('/dashboard');
  }

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading
    } = this.state;

    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          <Grid
            className={classes.quoteWrapper}
            item
            lg={5}
          >
            <div className={classes.quote}>
              <div className={classes.quoteInner}>
                <Typography
                  className={classes.quoteText}
                  variant="h1"
                >
                  all your resumes, one platform
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    Resumely
                  </Typography>

                </div>
              </div>
            </div>
          </Grid>
          <Grid
            className={classes.content}
            item
            lg={7}
            xs={12}
          >
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton
                  className={classes.backButton}
                  onClick={this.handleBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    Sign in with social media
                  </Typography>
                  <FacebookLogin
                    appId="631341827412897"
                    autoLoad={false}
                    fields="name,email,picture,first_name, last_name, short_name"
                    callback={this.responseFacebook}
                    render={renderProps => (
                      <Button
                        className={classes.facebookButton}
                        color="primary"
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        size="large"
                        variant="contained"
                      >
                        <FacebookIcon className={classes.facebookIcon} />
                      Login with Facebook
                      </Button>
                    )}
                  />

                  <GoogleLogin
                    clientId="168031260511-m505kjr540a20l9hvqcnbeo6u7fekul5.apps.googleusercontent.com"
                    render={renderProps => (
                      <Button
                        className={classes.googleButton}
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        size="large"
                        variant="contained"
                      >
                        <GoogleIcon className={classes.googleIcon} />
                        Login with Google
                      </Button>
                    )}
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy={'single_host_origin'}
                  />

                  <Typography
                    className={classes.sugestion}
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Email address"
                      name="email"
                      onChange={event =>
                        this.handleFieldChange('email', event.target.value)
                      }
                      type="text"
                      value={values.email}
                      variant="outlined"
                    />
                    {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.email[0]}
                      </Typography>
                    )}
                    <TextField
                      className={classes.textField}
                      label="Password"
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                    {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.password[0]}
                      </Typography>
                    )}
                  </div>
                  {submitError && (
                    <Typography
                      className={classes.submitError}
                      variant="body2"
                    >
                      {submitError}
                    </Typography>
                  )}
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                      <Button
                        className={classes.signInButton}
                        color="primary"
                        disabled={!isValid}
                        onClick={this.handleSignIn}
                        size="large"
                        variant="contained"
                      >
                        Sign in now
                      </Button>
                    )}
                  <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    Don't have an account?{' '}
                    <Link
                      className={classes.signUpUrl}
                      to="/sign-up"
                    >
                      Sign up
                    </Link>
                  </Typography>
                  <Typography
                    className={classes.signUp}
                    variant="body1"
                  >
                    Forgot your password ?{' '}
                    <Link
                      className={classes.signUpUrl}
                      to="/reset-password"
                    >
                      Change it
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SignIn.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(SignIn);
