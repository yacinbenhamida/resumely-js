import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import { LinearProgress,IconButton  } from '@material-ui/core';
// Material components
import { Button, TextField,CircularProgress,Checkbox, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import AlertDialog from '../FilesToolbar/AlertDialog'
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";
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

class CustomScrapping extends Component {

    state = {
    country: '',
    age : true,
    education : true,
    career : true,
    skills  : true,
    promptCancelScrapping : false,
    isTriggered : false,
    user : JSON.parse(localStorage.getItem('user')),
    submitted : false,
    scrappingInfo : null,
    interval : null
  };
  checkStatus = ()=>{
    axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
    {id : this.state.user._id, currentstate : "started"}).then(d=>{
        if(d.status === 200 && d.data.length > 0){
            this.setState({
                isTriggered : true,
                submitted : false,
                scrappingInfo : d.data.sort((a, b) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()))
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
    if(this.state.country && this.state.country.trim() !== ""){
      this.setState({submitted : true})
      axios
      .post(process.env.REACT_APP_BACKEND+'/scrapping?secret_token='+localStorage.getItem('token'),
      {
          country : this.state.country,
          username : this.state.user.username,
          ownerid :  this.state.user._id,
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
    else alert("country invalid")
  }
  cancelScrapping =()=>{
    axios
    .post(process.env.REACT_APP_BACKEND+'/stop-scrapping?secret_token='+localStorage.getItem('token'),
    {
        id : this.state.scrappingInfo[0]._id,
    }).then(x=>{
        if(x.status === 200){
            console.log('cancelling scrapping...')
            this.setState({isTriggered : false, scrappingInfo : null})
        }
        else console.log('error')
    })
  }
  handleConfirm = (answer)=>{
    if(answer === "ok"){
      this.cancelScrapping()
    }
      this.setState({promptCancelScrapping : false})  
  }
  getCountrys = ()=>{
    const url = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    axios.get(url).then(d=>this.setState({countrys : d.data})).catch(err=>alert('no internet connection'))
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const { isTriggered, scrappingInfo,submitted,content } = this.state;
    
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
        {(scrappingInfo[0].type === 'multiple' || !scrappingInfo[0].type )
        &&
          <div>
          <span>
            {scrappingInfo[0].expectedNoOfRows} useful profiles
          </span> 
          <LinearProgress variant="determinate" value={100} />
          <br/>
          <span>
            {scrappingInfo[0].currentNoOfRows} scrapped profiles
          </span> 
          <LinearProgress variant="determinate" value={scrappingInfo[0].currentNoOfRows}/>
          </div>
        }
        {(scrappingInfo[0].type === 'single' || !scrappingInfo[0].type)
         &&
         <div className={classes.progressWrapper}>
          <CircularProgress />
          <span>Scrapping a single profile...</span>
          </div>
        }
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
            subtitle="collect data online"
            title="Multiple"
          />
        </PortletHeader>
        <PortletContent>
         
          <form className={classes.form}>
          <div className={classes.row}>
          <div>
            <MapChart setInputContent={d=>this.setState({country : d})} setTooltipContent={x=>this.setState({content : x})} />
            <ReactTooltip>{content}</ReactTooltip>
          </div>
            <TextField
              className={classes.textField}
              label="country"
              name="country"
              value={this.state.country}
              onChange={event =>
                this.setState({country : event.target.value})
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
              <Checkbox color="primary"
                disabled
                defaultChecked
              />
              presentation
              </div>
              <div>
              
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
            Search
          </Button>
          {submitted && 
          <CircularProgress />
          }
        </PortletFooter>
      </Portlet>
    );
  }
}

CustomScrapping.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomScrapping);