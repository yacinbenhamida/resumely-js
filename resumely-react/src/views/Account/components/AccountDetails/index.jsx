import React, { Component } from 'react';
import axios from 'axios';
// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
// Material helpers
import { withStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
// Material components
import { Button, TextField ,  Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  
} from 'components';

// Component styles
import styles from './styles';


const verifyEmailExist = (TargetEmail) => {
  return axios.post(process.env.REACT_APP_BACKEND+'/verifyEmail',{
   
    email : TargetEmail
  })

};

class Account extends Component {

  constructor(props)
  {
   super(props);
   const user = JSON.parse(localStorage.getItem('user'));
   this.state = {
    
    user:user,
    email: user.email,
    firstName:user.firstName ,
    lastName: user.lastName,
    errorEmail:null,
    touchedEmail:false,
    isValid: true,
    isValidName: true,
    editEmail:false,
    editName:false
   };
   this.timeout=0;
   this.editEmail = this.editEmail.bind(this)
   this.handleChange=this.handleChange.bind(this)
   this.editEmailIcon=this.editEmailIcon.bind(this)
   this.editNameIcon=this.editNameIcon.bind(this)
   
  }

  onKeyPressed(e) 
  {
    clearTimeout(this.timeout);
    console.log("hey")
    
  }
  handleChange=async(event) =>{
    const name = event.target.name;
    const value = event.target.value;
   await  this.setState({[event.target.name] : event.target.value });
  
   
  if (name === 'email')
  {
     
    
    const emailRegex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
     if(!value)
     {
   
      this.setState({errorEmail :"",touchedEmail:false,isValid:false})
   
     }
    else if (!emailRegex.test(value))
     {
   
      this.setState({errorEmail : "this is not a valid email",touchedEmail:true,isValid:false})
      
     }
    else if(emailRegex.test(value))
     {
      if(this.timeout) 
      {
        clearTimeout(this.timeout);
      
      }
      if (value !== this.state.user.email)
      {
      this.timeout = setTimeout(() => {
  
      
        verifyEmailExist(value).then(res=>{
       
          if(res.data.message === false){
            this.setState({
             isValid : true,errorEmail : "",touchedEmail:false
             });
           
      
           }
           else  if(res.data.message === true) {
             this.setState({
               isValid : false,errorEmail : "this email is already used, try another one",touchedEmail:true
             });
            
           }
         }) 
       
      },700)
      }
   
     this.setState({
       isValid : true,errorEmail : "",touchedEmail:false
       });
  
     }
   
  }
  else if (name ==="firstName" || name ==="lastName")
  {
    if (!this.state.firstName || !this.state.lastName || (!this.state.firstName && !this.state.lastName))
    {
      this.setState({
        isValidName : false
        });
    }
    else
    {
      this.setState({
        isValidName : true
        }); 
    }
    }
    
  }

  editEmailIcon=async() =>
  {
   await this.setState({editEmail:!this.state.editEmail,email:this.state.user.email, isValid : true,errorEmail : "",touchedEmail:false})
  }

  editNameIcon=async() =>
  {
   await this.setState({editName:!this.state.editName,firstName:this.state.user.firstName, lastName :this.state.user.lastName})
  }

  editEmail=async()=>
  {

    await axios.put(process.env.REACT_APP_BACKEND+'/editprofile',{
     user:this.state.user,  email :this.state.email
    }).then(res=>{
         if (res.data.message ==="email updated")
          {
            
            this.state.user.email=this.state.email ;
            localStorage.setItem("user", JSON.stringify(this.state.user))
            this.setState({editEmail:false,email:this.state.user.email, isValid : true,errorEmail : "",touchedEmail:false})
          }
    })
  
  }
  editName=async()=>
  {

    await axios.put(process.env.REACT_APP_BACKEND+'/editname',{
     user:this.state.user,  firstName:this.state.firstName ,lastName:this.state.lastName
    }).then(res=>{
         if (res.data.message ==="name updated")
          {
            
            this.state.user.lastName=this.state.lastName ;
            this.state.user.firstName=this.state.firstName;
            localStorage.setItem("user", JSON.stringify(this.state.user))
            console.log(this.state.user)
            this.setState({editName:!this.state.editName,firstName:this.state.user.firstName, lastName :this.state.user.lastName})
          }
    })
  
  }
  render() {
    
    const { classes, className, ...rest } = this.props;
    const {firstName,email,lastName,isValid,errorEmail,touchedEmail,user,editEmail,editName,isValidName} = this.state;
    const showEmailError = errorEmail && touchedEmail;
  
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
        
        <List className={classes.root}>
       <ListItem key={user.email} role={undefined} dense button >
       Email:
            <ListItemText  primary={user.email} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" onClick={ () => this.editEmailIcon() }>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>

          {editEmail && (
                      <div className={classes.field}>
                      <TextField
                        className={classes.textField}
                        label="Email Address"
                        margin="dense"
                        required
                        name="email"
                       // defaultValue={email || ''}
                       value={email || ''}
                        variant="outlined"
                        onChange={event =>this.handleChange(event)}
                        onKeyDown={this.onKeyPressed.bind(this)}
                      />
                
                       {showEmailError && (
                              <Typography
                                className={classes.fieldError}
                                variant="body2"
                              >
                                {errorEmail}
                              </Typography>
                            )}
                     
                     <Button color="primary"variant="contained"onClick={this.editEmail}disabled={!isValid} style={{display:"flex",marginTop:"20px"}}>
                     Edit 
                    </Button>  
                    </div>
                  
                    )}
          <ListItem key={user.username} role={undefined} dense button >
         Name: 
            <ListItemText  primary={user.firstName +' '+user.lastName} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" onClick={ () => this.editNameIcon() }>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          </List>
          {( editName &&
              <div className={classes.field}>
              
              <TextField
                className={classes.textField}
                label="First name"
                margin="dense"
                required
                value={firstName || ''}
                variant="outlined"
                onChange={this.handleChange}
                name="firstName"
              />
            
             
              <TextField
                className={classes.textField}
                label="Last name"
                margin="dense"
                required
                value={lastName || ''}
                variant="outlined"
                onChange={this.handleChange}
                name="lastName"
              />

           <Button color="primary"variant="contained" onClick={this.editName}  disabled={!isValidName} style={{display:"flex",marginTop:"20px"}}>
            Edit 
           </Button>  
            </div>
            
          
            )}
          </PortletContent>
      </Portlet>
      
    );
  }
}

Account.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Account);
