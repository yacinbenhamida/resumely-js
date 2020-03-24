import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

// Material components
import { Button, TextField } from '@material-ui/core';

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
    isTriggered : false,
    user : JSON.parse(localStorage.getItem('user')),
    scrappingInfo : null
  };
  componentWillMount(){
    axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
    {id : this.state.user._id}).then(d=>{
        if(d.status === 200 && d.data.length > 0){
            this.setState({
                isTriggered : true,
                scrappingInfo : d.data.sort((a, b) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()))
            })
        }
    })
  }
  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.values[field] = value;

    this.setState(newState);
  };
  submitSearch = ()=>{
    console.log(this.state.country)
    axios
    .post(process.env.REACT_APP_BACKEND+'/scrapping?secret_token='+localStorage.getItem('token'),
    {
        country : this.state.country,
        username : this.state.user.username,
        ownerid :  this.state.user._id
    }).then(x=>{
        if(x.status === 200){
            console.log('processing request...')
            this.setState({isTriggered : true})
        }
        else console.log('error')
    })
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const { isTriggered, scrappingInfo } = this.state;
    
    const rootClassName = classNames(classes.root, className);
    if (isTriggered) {
      return (
        <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="collect data online"
            title="processing"
          />
          <span>
            {scrappingInfo[0].currentNoOfRows} / {scrappingInfo[0].expectedNoOfRows}
          </span>        
          </PortletHeader>
        <PortletContent  className={classes.progressWrapper}>
          <CircularProgress />
        </PortletContent>
        </Portlet>
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