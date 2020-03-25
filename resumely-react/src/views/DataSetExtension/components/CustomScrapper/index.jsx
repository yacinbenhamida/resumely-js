import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import { LinearProgress,IconButton  } from '@material-ui/core';
// Material components
import { Button, TextField,CircularProgress } from '@material-ui/core';
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

class CustomScrapping extends Component {
    state = {
    values: {
      country: '',
    },
    promptCancelScrapping : false,
    isTriggered : false,
    user : JSON.parse(localStorage.getItem('user')),
    submitted : false,
    scrappingInfo : null
  };
  checkStatus = async ()=>{
    await axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
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
  componentWillMount(){
    this.checkStatus()
  }
  componentDidMount(){
    setInterval(this.checkStatus, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.values[field] = value;

    this.setState(newState);
  };
  submitSearch = ()=>{
    if(this.state.values.country.trim() !== ""){
      this.setState({submitted : true})
      axios
      .post(process.env.REACT_APP_BACKEND+'/scrapping?secret_token='+localStorage.getItem('token'),
      {
          country : this.state.country,
          username : this.state.user.username,
          ownerid :  this.state.user._id
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
        id : this.state.scrappingInfo[0]._id
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
  render() {
    const { classes, className, ...rest } = this.props;
    const { isTriggered, scrappingInfo,submitted } = this.state;
    
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
          <span>
            {scrappingInfo[0].expectedNoOfRows} useful profiles
          </span> 
          <LinearProgress variant="determinate" value={100} />
          <br/>
          <span>
            {scrappingInfo[0].currentNoOfRows} scrapped profiles
          </span> 
          <LinearProgress variant="determinate" value={scrappingInfo[0].currentNoOfRows}/>
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
            title="Data Scrapping"
          />
        </PortletHeader>
        <PortletContent>
          <form className={classes.form}>
            <TextField
              className={classes.textField}
              label="country"
              name="country"
              onChange={event =>
                this.setState({country : event.target.value})
              }
              type="text"
              variant="outlined"
            />
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