import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Shared components
import { Paper } from 'components';
import moment from 'moment';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
// Component styles
import styles from './styles';
import axios from 'axios'
class Profit extends Component {
  state = {
    lastConnectionAttempt : null
  }
  componentDidMount(){
    this.lastConnection()
  }
  lastConnection = () => {
    return axios.post(process.env.REACT_APP_BACKEND+'/user/cnx',{
      username : JSON.parse(localStorage.getItem('user')).username,
    }).then(result => {
      this.setState({lastConnectionAttempt :  result.data.cnx[0].dateCnx})
    })
  };
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
              className={classes.value}
              variant="h3"
            >
            {moment(new Date()).format('dddd, MMMM Do YYYY')}
            </Typography>
            <Typography
              className={classes.value}
              variant="h3"
            >
              {moment(new Date()).format('h:mm A')}
            </Typography>
            <Typography
              className={classes.value}
              variant="caption"
            >
            last connection at {moment(this.state.lastConnectionAttempt).format('DD/MM/YYYY h:mm A')}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <QueryBuilderIcon className={classes.icon} />
          </div>
          
        </div>
      </Paper>
    );
  }
}

Profit.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Profit);
