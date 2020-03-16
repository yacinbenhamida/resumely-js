import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography
} from '@material-ui/core';

// Material icons


// Component styles
import styles from './styles';

// Form validation schema
import schema from './redirect-schema';

import axios from 'axios';

// Service methods
const resetPassword = (TargetUsername,TargetPassword) => {
  return axios.put(process.env.REACT_APP_BACKEND+'/user/updatePasswordviaEmail',{
    username : TargetUsername,
    password : TargetPassword
  })
};

class RedirectResetPassword extends Component {
  state = {
    values: {
      password: '',
      confirmPassword : ''
    },
    touched: {
      password: false,
      confirmPassword : false
    },
    errors: {
      password: null,
      confirmPassword : null
    },
    username : '',
    canChangePW : false,
    isValid: false,
    isLoading: true,
    updated : false,
    submitError: null
  };

  async componentDidMount(){
    await axios.get(process.env.REACT_APP_BACKEND+'/user/reset',{
      params : {
        resetPasswordToken : this.props.match.params.token
      }
    }).then(response => {
      console.log(response)
      if(response.data.message === 'password reset link ok'){
        this.setState({
          username : response.data.username,
          isLoading : false,
          canChangePW : true
        })
      }else{
        this.setState({
          submitError: response.data,
          isLoading : false ,
          canChangePW : false
        })
      }
    }).catch(err=>{
      console.log(err.data)
    })
  }


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

  handleResetPassword = async () => {
    try {
      //const { history } = this.props;
      const { values } = this.state;
      if(values.password === '' || values.confirmPassword === '' 
      || values.confirmPassword !== values.password || this.state.username === ''){
        this.setState({
          isLoading: false,
          submitError: 'passwords are invalid or too short'
        });
      }else{
        this.setState({ isLoading: true });    
        await resetPassword(this.state.username,values.password).then(res=>{
          console.log(res.data.message)
          if(res.data.message === 'password updated'){
            this.setState({
              isLoading: false,
              submitError: 'password updated',
              canChangePW : false,
              updated : true, 
            });
          }
          else {
            this.setState({
              isLoading: false,
              submitError: 'password invalid'
            });
          }
        }).catch(err=>{
          this.setState({
            isLoading: false,
            submitError: 'error encountered.'
          });
        });
        //history.push('/dashboard');
      }
      
    } catch (error) {
      this.setState({
        isLoading: false,
        submitError: error
      });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading,
      canChangePW,
      updated
    } = this.state;

    const showPasswordErrors = touched.password && errors.password;
    const showConfirmErrors = touched.confirmPassword && errors.confirmPassword;
    if(canChangePW){
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
                 reset your password
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    Brackets.js
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
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Enter your new password
                  </Typography>
                  <Typography
                    className={classes.subtitle}
                    variant="body1"
                  >
                    Having trouble logging in ?
                  </Typography>
                  
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="Your new password"
                      name="password"
                      onChange={event =>
                        this.handleFieldChange('password', event.target.value)
                      }
                      value={values.password}
                      variant="outlined"
                      type="password"
                    />
                    {showPasswordErrors && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.password[0]}
                      </Typography>
                    )}
                    
                  </div>
                  
                  <div className={classes.fields}>
                    <TextField
                      className={classes.textField}
                      label="confirm your new password"
                      name="confirm"
                      onChange={event =>
                        this.handleFieldChange('confirmPassword', event.target.value)
                      }
                      value={values.confirmPassword}
                      variant="outlined"
                      type="password"
                    />
                    {showConfirmErrors && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.confirmPassword[0]}
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
                      onClick={this.handleResetPassword}
                      size="large"
                      variant="contained"
                    >
                      reset password
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
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
  else if (updated){
    return(
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
                 We're done!
                </Typography>
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
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    Password updated successfuly
                    <Link
                    className={classes.signUpUrl}
                    to="/sign-in"
                  >
                    &nbsp; try logging in now.
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
  else {
    return(
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
                 Oops!
                </Typography>
                <div className={classes.person}>
                  <Typography
                    className={classes.name}
                    variant="body1"
                  >
                    We think you forgot something
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
              <div className={classes.contentBody}>
                <form className={classes.form}>
                  <Typography
                    className={classes.title}
                    variant="h2"
                  >
                    To change your password start by submitting a request at <Link
                    className={classes.signUpUrl}
                    to="/reset-password"
                  >
                    reset your password
                  </Link>
                  </Typography>
                  {isLoading ? (
                    <CircularProgress className={classes.progress} />
                  ) : (
                    <Typography
                    className={classes.title}
                    variant="h3"
                  >
                    go back and fix that !
                  </Typography>
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
                </form>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
  }
}

RedirectResetPassword.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  withStyles(styles)
)(RedirectResetPassword);
