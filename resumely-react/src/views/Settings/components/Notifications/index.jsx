import React, { Component } from 'react';
import axios from 'axios';
// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

import moment from 'moment'
import {
  ArrowRight as ArrowRightIcon,

} from '@material-ui/icons';
// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {  Typography, Button } from '@material-ui/core';

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
const displayCnx = (TargetUser) => {
  return axios.post(process.env.REACT_APP_BACKEND+'/user/cnx',{
    username : TargetUser,

  })
};
class Notifications extends Component {

  constructor(props)
  {
    const user = JSON.parse(localStorage.getItem('user'));
   super(props);
   this.state = {
    user : user,
    connexions:[],
    limitTo : 4 ,
    isClicked :false 
   }
  }
  componentDidMount = async () =>
 {
  await displayCnx (this.state.user.username).then(res=>{
  this.setState({ connexions :res.data.cnx})
   
  });

 }

 onLoadMore =async()=> {
   console.log(this.state.connexions.length-4)
  await this.setState({
     limitTo: this.state.connexions.length ,isClicked:true
  });
}
onLoadLess =async()=> {
  
 await this.setState({
    limitTo: 4,isClicked:false
 });
 console.log(this.state.limitTo)
}
  render() {
    const { classes, className, ...rest } = this.props;
    const {    connexions ,isClicked , limitTo} = this.state;
    const rootClassName = classNames(classes.root, className);
    
    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            
            title="Your Connections"
          />
        </PortletHeader>
        <PortletContent noPadding>
          <form >
            <div className={classes.group}>
            
              {console.log( limitTo)}
              <div className={classes.details} >
              {
                 connexions.slice(0,  limitTo).map((c, i)=>
                  <div    key={c._id} style={{paddingTop :"10px"}} >
                  { i === 0 ?
                     <div>
                     <Typography variant="body1">{c.Os} - {c.Localisation}</Typography>
                     <Typography variant="caption" >
                       {c. Browser } - <span style={{color :"green",fontWeight:" bold"}}>Active</span>
                     </Typography>
                     </div>
                    :
                    <div>
                  <Typography variant="body1">{c.Os} - {c.Localisation}</Typography>
                  <Typography variant="caption">
                    {c. Browser} -
                  
                  {
                  
                    moment(c.dateCnx).year() === moment().year() ? 
                    moment().diff(moment(c.dateCnx), 'hours') <= 24 ?
                    moment(c.dateCnx).startOf('hour').fromNow():
                    moment(c.dateCnx).format("DD MMMM , h:mm a")   :
                
                    moment(c.dateCnx).format("DD MMMM YYYY , h:mm a")
                  
                   }
                  </Typography>
                
                    </div>
                  }
                 
                 
                </div>
               
                  
               )
              }
               
              </div>
             
             
            </div>
           
          </form>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
        {!isClicked && (
          <Button
            color="primary"
            size="small"
            variant="text"
            onClick={this.onLoadMore}

          >
            View all <ArrowRightIcon />
          </Button>)}
          {isClicked && (  <Button
            color="primary"
            size="small"
            variant="text"
            onClick={this.onLoadLess}
          >
            View less <ArrowRightIcon />
          </Button> )}
        
        </PortletFooter>
      </Portlet>
    );
  }
}

Notifications.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Notifications);
