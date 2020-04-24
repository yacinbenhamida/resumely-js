import React, { Component } from 'react';
import axios from 'axios';
// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import _ from 'underscore';
import schema from './schema';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField ,  Typography , CircularProgress,} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter,
} from 'components';

// Component styles
import styles from './styles';




class Account extends Component {

  constructor(props)
  {
   super(props);
   this.state = {
    open:false,
    firstName: this.props.user.firstName ,
    lastName: this.props.user.lastName,
   // email:this.props.user.email,
    values: {
      email: this.props.user.email,
     
    },
    touched: {
      email: false
     
    },
    errors: {
      email: null,
      password: null
    },
    isValid: true,
  
   };
   this.editprofile = this.editprofile.bind(this)
  }

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);
    
    newState.errors = errors || {};
    newState.isValid = errors ? false : true ;
    console.log(   errors ? false : true)
    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  
  };




  editprofile ()
  {
this.state.open = true ;
    let user = {
      firstName :this.state.firstName,
      lastName :this.state.lastName,
      email :this.state.values.email
    }
  
    return axios.put(process.env.REACT_APP_BACKEND+'/editprofile',{
     user:user
    })
   /* axios.post(process.env.REACT_APP_BACKEND+'/editprofile',{
      user : user   })*/
  }
  render() {
    
    const { classes, className, ...rest } = this.props;
    const { firstName, lastName, email ,
      values,
      touched,
      errors,
      isValid,
      } = this.state;
      const showEmailError = touched.email && errors.email;
      

    const rootClassName = classNames(classes.root, className);

    return (
      
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="The information can be edited"
            title="Profile"
          />
        </PortletHeader>
        <PortletContent noPadding>
          <form
            autoComplete="off"
            noValidate
          >
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                helperText="Please specify the first name"
                label="First name"
                margin="dense"
                required
                value={firstName}
                variant="outlined"
                onChange={e => {
                  this.setState({ firstName: e.target.value });
                }}
              />
              <TextField
                className={classes.textField}
                label="Last name"
                margin="dense"
                required
                value={lastName}
                variant="outlined"
                onChange={e => {
                  this.setState({ lastName: e.target.value });
                }}
              />
            </div>
            <div className={classes.field}>
              <TextField
                className={classes.textField}
                label="Email Address"
                margin="dense"
                required
                value={values.email}
                variant="outlined"
                onChange={event =>
                  this.handleFieldChange('email', event.target.value)
                }
              />
               {showEmailError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errors.email[0]}
                      </Typography>
                    )}
             
                  
            </div>
         
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
     
          <Button
            color="primary"
            variant="contained"
            onClick={this.editprofile}
            disabled={!isValid}
          >
            Edit 
          </Button>
           
        </PortletFooter>
  
      </Portlet>
      
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Account);
