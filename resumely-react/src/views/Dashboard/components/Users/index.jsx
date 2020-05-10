import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';
// Material icons
import {
  ArrowUpward as ArrowUpwardIcon,
  PeopleOutlined as PeopleIcon,
} from '@material-ui/icons';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DragHandleIcon from '@material-ui/icons/DragHandle';
// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from 'axios'
class Users extends Component {
  state = {
    nbCandidates : 0,
    countscrappedProfiles : 0,
    contribution : 0
  }
  componentDidMount(){
    this.loadNbOfUsers()
  }
  loadNbOfUsers = () => {
    axios.get(process.env.REACT_APP_BACKEND+'/dashboard/numbers?secret_token='+localStorage.getItem('token'))
    .then(res=>{
      let contrib = Math.round(Number(res.data.countscrappedProfiles / res.data.nbCandidates )*100)
        this.setState({nbCandidates: res.data.nbCandidates , 
          countscrappedProfiles : res.data.countscrappedProfiles , contribution : contrib ? contrib : 0,
      })
      console.log(this.state.contribution)
    })
  }
  render() {
    const { classes, className, ...rest } = this.props;
    const {nbCandidates} = this.state
    const rootClassName = classNames(classes.root, className);
    
    return (
      <Paper
        {...rest}
        className={rootClassName}
      >
        <div className={classes.content}>
          <div className={classes.details}>
            <Typography
              className={classes.title}
              variant="body2"
            >
              TOTAL CANDIDATES
            </Typography>
            <Typography
              className={classes.value}
              variant="h3"
            >
              {nbCandidates}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <PeopleIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.footer}>
        {this.state.contribution > 0 && 
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <ArrowUpwardIcon />
            { this.state.contribution} %
          </Typography>
        }
        {this.state.contribution === 0 && 
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <DragHandleIcon />
            { this.state.contribution} %
          </Typography>
        }
        {this.state.contribution < 0 && 
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <ArrowDownwardIcon />
            { this.state.contribution} %
          </Typography>
        }
          <Typography
            className={classes.caption}
            variant="caption"
          >
             contriubution
          </Typography>
        </div>
      </Paper>
    );
  }
}

Users.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Users);
