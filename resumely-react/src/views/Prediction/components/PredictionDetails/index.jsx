import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Avatar, Typography, Button, LinearProgress } from '@material-ui/core';

// Shared components
import { Portlet, PortletContent, PortletFooter } from 'components';

// Component styles
import styles from './styles';

class PredictionDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      prediction: '',
      showPrediction: false
    };
  }

  // Called by parent Prediction component
  loadPredictionDetails(firstName, lastName, prediction)
  {
    this.setState({
      firstName: firstName,
      lastName: lastName,
      prediction: prediction,
      showPrediction: true
    });
  }
  
  render() {
    const { classes, className, ...rest } = this.props;
    const rootClassName = classNames(classes.root, className);

    if(!this.state.showPrediction)
    return (
      <Typography align="center" variant="h2">Fill in the form to perform the prediction.</Typography>
    )

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletContent>
          <div className={classes.details}>
            <div className={classes.info}>
              <Typography variant="h1">{this.state.firstName} {this.state.lastName}</Typography>
              <Typography
                variant="h2"
              >
               from {this.state.prediction}
              </Typography>
            </div>
            <Avatar
              className={classes.avatar}
              src="/images/avatars/avatar_1.png"
            />
          </div>
          <div className={classes.progressWrapper}>
            <Typography variant="body1">Confidence: 99%</Typography>
            <LinearProgress
              value={99}
              variant="determinate"
            />
          </div>
        </PortletContent>
        <PortletFooter>
          <Button
            className={classes.uploadButton}
            color="primary"
            variant="text"
          >
            Upload picture
          </Button>
          <Button variant="text">Remove picture</Button>
        </PortletFooter>
      </Portlet>
    );
  }
}

PredictionDetails.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  prediction: PropTypes.string
};

export default withStyles(styles)(PredictionDetails);
