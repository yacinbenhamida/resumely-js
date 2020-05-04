import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography, LinearProgress } from '@material-ui/core';

// Material icons
import { InsertChartOutlined as InsertChartIcon } from '@material-ui/icons';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from 'axios';

class Progress extends Component {
  state = {
    filesCount : 0
  }
  componentDidMount(){
    this.loadFiles()
  }
  loadFiles = () => {
    axios.get(process.env.REACT_APP_BACKEND+'/dashboard/numbers?secret_token='+localStorage.getItem('token'))
    .then(res=>{
        this.setState({filesCount: res.data.fileCount})
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
              FILES
            </Typography>
            <Typography
              className={classes.value}
              variant="h3"
            >
              {this.state.filesCount}
            </Typography>
          </div>
          <div className={classes.iconWrapper}>
            <InsertChartIcon className={classes.icon} />
          </div>
        </div>
        <div className={classes.footer}>
          <LinearProgress
            value={this.state.filesCount}
            variant="determinate"
          />
        </div>
      </Paper>
    );
  }
}

Progress.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Progress);
