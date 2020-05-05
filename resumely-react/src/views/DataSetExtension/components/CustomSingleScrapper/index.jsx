import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import { IconButton  } from '@material-ui/core';
// Material components
import { Button, TextField,CircularProgress,Checkbox, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AlertDialog from '../FilesToolbar/AlertDialog'
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
import axios from 'axios'

class CustomSingleScrapper extends Component {

    state = {
    profileUrl: '',
    age : true,
    education : true,
    career : true,
    skills  : true,
    promptCancelScrapping : false,
    isTriggered : false,
    submitted : false,
    scrappingInfo : null,
    interval : null
  };
  checkStatus = ()=>{
    axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
    {currentstate : "started"}).then(d=>{
        if(d.status === 200 && d.data.length > 0){
            this.setState({
                isTriggered : true,
                submitted : false,
                scrappingInfo : d.data.sort((a, b) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()))
            })
        }
        else{
          this.setState({
            isTriggered : false,
            submitted : false,
            scrappingInfo : null
        })
        }
    })
  }
  componentDidUpdate(){
    setInterval(this.checkStatus(), 5000)
  }
  componentDidMount(){
    this.checkStatus()
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.values[field] = value;

    this.setState(newState);
  };
  submitSearch = ()=>{
    if(this.state.profileUrl && this.state.profileUrl.trim() !== ""){
      this.setState({submitted : true})
      axios
      .post(process.env.REACT_APP_BACKEND+'/single-scrapping?secret_token='+localStorage.getItem('token'),
      {
          url : this.state.profileUrl,
          scrapAge : this.state.age,
          scrapEducation : this.state.education,
          scrapExperience : this.state.career,
          scrapSkills : this.state.skills
      }).then(x=>{
          if(x.status === 200){
              console.log('processing request...')
              this.checkStatus()
          }
          else console.log('error')
      }).catch(err=>alert('error occured, could not connect to server'))
    }
    else alert("url is invalid")
  }
  cancelScrapping =()=>{
    axios
    .post(process.env.REACT_APP_BACKEND+'/stop-scrapping?secret_token='+localStorage.getItem('token'))
    .then(x=>{
        if(x.status === 200){
            console.log('cancelling scrapping...')
        }
        window.location.reload()
    })
  }
  handleConfirm = (answer)=>{
    if(answer === "ok"){
      this.cancelScrapping()
    }
      this.setState({promptCancelScrapping : false})  
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const { isTriggered,submitted } = this.state;
    
    const rootClassName = classNames(classes.root, className);
    if (isTriggered) {
      return (
        <>
        <AlertDialog open={this.state.promptCancelScrapping}
          text="are you sure you want to cancel this operation ?"
          close="abort"
          validate="proceed"
          title="cancel scrapping"
          handleConfirmDelete={this.handleConfirm}
       />
        <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="processing..."
            title="Scrapping"
          />
          <IconButton aria-label="stop" onClick={x=>this.setState({promptCancelScrapping : true})}>
            <CancelIcon />
          </IconButton>        
          </PortletHeader>
        <PortletContent  className={classes.progressWrapper}>
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
        </PortletContent>
        </Portlet>
        </>
      );
    }
    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="collect data from one profile"
            title="Single"
          />
        </PortletHeader>
        <PortletContent>
         
          <form className={classes.form}>
          <div className={classes.row}>
            <TextField
              className={classes.textField}
              label="profile url"
              name="url"
              placeholder="doyoubuzz.com/.."
              value={this.state.profileUrl}
              onChange={event =>
                this.setState({profileUrl : event.target.value})
              }
              type="text"
              variant="outlined"
            />
              <Typography
                className={classes.groupLabel}
                variant="h6"
              >
                Targeted data
              </Typography>
              <div>
                <Checkbox color="primary" onChange={event =>
                  this.setState({age : event.target.checked})}
                  defaultChecked/>
                age
                <Checkbox color="primary"onChange={event =>
                  this.setState({education : event.target.checked})}
                  defaultChecked
                />
                education
                <Checkbox color="primary" onChange={event =>
                  this.setState({skills : event.target.checked})}
                  defaultChecked
                />
                skills
                <Checkbox color="primary"onChange={event =>
                  this.setState({career : event.target.checked})}
                  defaultChecked
                />
                experience
              </div>
              <div>
              <Checkbox color="primary"
                disabled
                defaultChecked
              />
              image
              <Checkbox color="primary"
                disabled
                defaultChecked
              />
              firstname
              <Checkbox color="primary"
                disabled
                defaultChecked
              />
              lastname
              
              </div>
              <div>
              <Checkbox color="primary"
                disabled
                defaultChecked
              />
              presentation
              </div>
            </div>
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <Button
            color="primary"
            variant="outlined"
            onClick={this.submitSearch}
          >
            Launch
          </Button>
          {submitted && 
          <CircularProgress />
          }
        </PortletFooter>
      </Portlet>
    );
  }
}

CustomSingleScrapper.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomSingleScrapper);