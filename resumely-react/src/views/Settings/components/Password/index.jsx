import React, { Component } from 'react';
import axios from 'axios';
// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField , Typography ,  CircularProgress} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

const updatePassword = (TargetUsername,TargetPassword) => {
  return axios.put(process.env.REACT_APP_BACKEND+'/user/updatePasswordviaProfile',{
    username : TargetUsername,
    password : TargetPassword
  })
};
const verifyCurrentPassword = (TargetUsername,TargetPassword) => {
  return axios.post(process.env.REACT_APP_BACKEND+'/verifypwd',{
    username : TargetUsername,
    password : TargetPassword
  })

};

class Password extends Component {
 
  constructor(props)
  {
    const user = JSON.parse(localStorage.getItem('user'));
   super(props);
   this.state = {
    open:false,
    user : user,
    currentPassword:'',
    password: '',
    confirmPassword: '',
    touchedPassword:false,
    touchedConfirmPassword :false,
    touchedCurrentPassword:false,
    errorsPassword:null,
    errorsConfirmPassword:null,
    errorsCurrentPassword:null,
    isVerify:false,
    isValid:false,
    isLoading: false,
    submitError :null,
   };
   this.timeout =  0;
   this.verifyPassword=this.verifyPassword.bind(this)
   this.handleChange=this.handleChange.bind(this)

  }
 

  updatePassword= async () => {
    
   if(!this.state.isValid)
   {
    await this.setState({
      isLoading: false,
      submitError: 'Current password is invalid '
    });
 
   }
   else
   {
   await this.setState({ isLoading: true });    
    await updatePassword(this.state.user.username,this.state.password).then(res=>{
      console.log(res.data.message)
      if(res.data.message === 'password updated'){
       this.setState({
          isLoading: false,
          submitError: 'password updated',
          currentPassword:'',
          password: '',
          confirmPassword: '',
      
         
        });
        console.log(this.state.password)
        console.log("updated")
      }
      else {
        this.setState({
          isLoading: false,
          submitError: 'password invalid',
          currentPassword:'',
          password: '',
          confirmPassword: '',
        });
      }
    }).catch(err=>{
      this.setState({
        isLoading: false,
        submitError: 'error encountered.'
      });
    });
  
  }
  }
  onKeyPressed(e) 
  {
    clearTimeout(this.timeout);
    console.log("hey")
    
  }

  verifyPassword=async(e)=>
  {
    
  await this.setState({  currentPassword:e.target.value  })
 
 
 if(this.state.currentPassword ==='')

{
this.setState({errorsCurrentPassword:"Empty password",touchedCurrentPassword:true})

}
else if(this.state.currentPassword)
{
   
    this.setState({errorsCurrentPassword:"",touchedCurrentPassword:false})

    if(this.timeout) 
    {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {

   verifyCurrentPassword(this.state.user.username,this.state.currentPassword).then(res=>{
   
    if(res.data.message === 'password validated'){
     this.setState({
      isValid : true,
      });
    
      console.log("validated"+this.state.isValid)
    }
    else {
      this.setState({
        isValid : false,
      });
    }
  });

      
    },700);
  }

  }
 

  
handleChange=async(event) =>{
  const name = event.target.name;
  const value = event.target.value;
  await this.setState({[event.target.name] : event.target.value });
    //  const re = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$");
      if (name === 'password')
      { 
        const passwordRegex = /(?=.*[0-9])/;
      
        if (!value)
        {
          this.setState({touchedPassword:true ,errorsPassword:"Empty password"})
        }
       else if (value.length < 8 && this.state.confirmPassword ==='' && this.state.currentPassword ==='')
        {
          this.setState({touchedPassword:true ,errorsPassword:"Password must be 8 characters long",
          errorsConfirmPassword:"The passwords do not match",touchedConfirmPassword:true,
          errorsCurrentPassword:"Empty password",touchedCurrentPassword:true})

        }
        else if (value.length < 8)  
        {
          this.setState({touchedPassword:true,errorsPassword:"Password must be 8 characters long."})
        } 
        else if (!passwordRegex.test(value))
        {  
          this.setState({touchedPassword:true,errorsPassword:"Password is not sufficiently complex"})
        }
        else
        {
          this.setState({touchedPassword:false,errorsPassword:""});
        }
       
      }

      else if ( name === 'confirmPassword')
      {
        this.setState({touchedConfirmPassword:true})
        this.checkPassword(value);
      }

    
  }

  checkPassword=async(value) =>
  {

   if( !this.state.password ||this.state.password !== value)
    {
        this.setState({errorsConfirmPassword:"The passwords does not match",isVerify:false})
    }
    else {
        this.setState({errorsConfirmPassword:"",isVerify:true,touchedConfirmPassword:false})
    } 
  }



  render() {
    const { classes, className, ...rest } = this.props;
    const {currentPassword, password, confirmPassword, isVerify, submitError, isLoading, user,
      touchedPassword,touchedConfirmPassword,touchedCurrentPassword,errorsPassword, errorsConfirmPassword,
      errorsCurrentPassword} = this.state;

    const rootClassName = classNames(classes.root, className);
    const showPasswordError =errorsPassword&& touchedPassword;
    const showPasswordConfError = errorsConfirmPassword &&touchedConfirmPassword;
    const showCurrentPasswordError =errorsCurrentPassword && touchedCurrentPassword;
    const enabled =isVerify && currentPassword;
if (user.provider === 'local')
{
    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="Update password"
            title="Password"
          />
        </PortletHeader>
        
        <PortletContent>
       
          <TextField
              className={classes.textField}
              label="Current Password"
              name="currentpassword"
              onChange={this.verifyPassword}
              onKeyDown={this.onKeyPressed.bind(this)}
              type="password"
              value={currentPassword}
              variant="outlined"
            />
            {showCurrentPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errorsCurrentPassword }
                      </Typography>
                    )}
            <TextField
              className={classes.textField}
              label="Password"
              name="password"
             // onChange={event =>
             //  this.handleFieldChange('password', event.target.value)
             // }
             onChange={this.handleChange}
        
              type="password"
            //  defaultValue={password}
            value={password || ''}
              variant="outlined"
            />
            {showPasswordError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errorsPassword}
                      </Typography>
                    )}
            <TextField
              className={classes.textField}
              label="Confirm password"
             onChange={this.handleChange}
              name="confirmPassword"
              type="password"
             // defaultValue={confirmPassword}
             value={confirmPassword || ''}
              variant="outlined"
          
            />
          { showPasswordConfError && (
                      <Typography
                        className={classes.fieldError}
                        variant="body2"
                      >
                        {errorsConfirmPassword}
                      </Typography>
                    )}
                    
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
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
            color="primary"
            variant="outlined"
            disabled={! enabled}
            onClick={this.updatePassword}
          >
            Update
          </Button>
               )}
        </PortletFooter>
       
      </Portlet>
    );
  }
  else
  {
    return (null)
  }
  }
}

Password.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Password);
