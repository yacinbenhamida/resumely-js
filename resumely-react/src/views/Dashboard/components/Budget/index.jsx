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
  Money as MoneyIcon
} from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from 'axios'
class Budget extends Component {
  state = {
    scrapRequests : 0,
    totalProfiles : 0
  }
  componentDidMount(){
    this.loadScrappRequests()
  }
  loadScrappRequests = () => {
    axios.get(process.env.REACT_APP_BACKEND+'/dashboard/numbers?secret_token='+localStorage.getItem('token'))
    .then(res=>{
        this.setState({scrapRequests: res.data.scrapCount, totalProfiles : res.data.nbCandidates})
      })
  }
  render() {
    const { classes, className, ...rest } = this.props;

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
              SCRAPPING ATTEMPTS
            </Typography>
            <Typography
              className={classes.value}
              variant="h3"
            >
              {this.state.scrapRequests}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <MoneyIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.footer}>
          <Typography
            className={classes.difference}
            variant="body2"
          >
            <ArrowUpwardIcon />
          </Typography>
          <Typography
            className={classes.caption}
            variant="caption"
          >
            {this.state.totalProfiles} profiles
          </Typography>
        </div>
      </Paper>
    );
  }
}

Budget.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Budget);
