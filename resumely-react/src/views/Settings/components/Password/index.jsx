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
     
    
    touched: {
      password: false,
      confirmPassword: false,
      currentPassword:false
     
    },
    errors: {
      password:null,
      confirmPassword:null,
      currentPassword:null
    },
  
    isVerify:false,
    isValid:false,
    isLoading: false,
    submitError :null,
   };
   this.timeout =  0;
   this.verifyPassword=this.verifyPassword.bind(this)
   //this. checkPassword=this. checkPassword.bind(this)
   this.handleChange=this.handleChange.bind(this)
   //this.updatePassword=this.handleChange.bind(this)
  }
 

  updatePassword= async () => {
    console.log("***")
   if(!this.state.isValid)
   {
    await this.setState({
      isLoading: false,
      submitError: 'Current password is invalid '
    });
    console.log("***")
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
  console.log(this.state.currentPassword+"**")
 
 if(this.state.currentPassword =='')
 {
  
    this.state.errors.currentPassword= "Empty password" ;
    this.state.touched.currentPassword =true ;
    
 
  }

  else if(this.state.currentPassword)
  {
    this.state.errors.currentPassword= "" ;
    this.state.touched.currentPassword =false ;
    if(this.timeout) 
    {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
   verifyCurrentPassword(this.state.user.username,this.state.currentPassword).then(res=>{
    console.log(res.data.message)
    if(res.data.message === 'password validated'){
     this.setState({
      isValid : true
      });
    
      console.log("validated"+this.state.isValid)
    }
    else {
      this.setState({
        isValid : false
      });
    }
  });

      
    },700);
  }

  }
 

  
handleChange=(event) =>{
   this.setState({[event.target.name] : event.target.value });
    //  const re = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$");
      if (event.target.name == 'password')
      { 
        const passwordRegex = /(?=.*[0-9])/;
      
        if (!event.target.value  )
       {
          this.state.touched.password =true ;
          this.state.errors.password = "Empty password" ;
  
        }
       else if (event.target.value.length < 8 && this.state.confirmPassword =='' && this.state.currentPassword =='')
        {
          this.state.touched.password =true ;
          this.state.errors.password = "Password must be 8 characters long." ;
          this.state.errors.confirmPassword ="The passwords do not match" ;
          this.state.errors.currentPassword= "Empty password" ;
          this.state.touched.confirmPassword =true;
          this.state.touched.currentPassword =true ;
        }
        else if (event.target.value.length < 8)  
        {  this.state.touched.password =true ;
          this.state.errors.password = "Password must be 8 characters long.";
        } 
        else if (!passwordRegex.test(event.target.value))
       {  this.state.touched.password =true ;
          this.state.errors.password= "Password is not sufficiently complex";
       
        }
        else
        {
       //   this.state.password =event.target.value;
          this.state.touched.password =false ;
          this.state.errors. password ="" ;
      
        }
       
      }

      else if ( event.target.name == 'confirmPassword')
      {
       // this.state.confirmPassword= event.target.value;
        this.state.touched.confirmPassword =true ;
        this.checkPassword(event);
      }
     
   
    
  }

  checkPassword (event)  
  {
   if( !this.state.password ||this.state.password != event.target.value) {
         
          this.state.errors.confirmPassword ="The passwords do not match" ;
          this.state.isVerify=false ;
         
    }
    else {
         
          this.state.errors.confirmPassword ="";
          this.state.touched.confirmPassword =false ;
          this.state.isVerify=true ;
    } 
  }



  render() {
    const { classes, className, ...rest } = this.props;
    const {   currentPassword ,  touched,errors, password,confirmPassword,isVerify,submitError,isLoading} 
    = this.state;

    const rootClassName = classNames(classes.root, className);
    const showPasswordError = touched.password && errors.password;
    const showPasswordConfError = touched.confirmPassword && errors.confirmPassword;
    const showCurrentPasswordError = touched.currentPassword && errors.currentPassword;
    const enabled =isVerify && currentPassword;
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
                        {errors.currentPassword}
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
                        {errors.password}
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
                        {errors.confirmPassword}
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
}

Password.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Password);
