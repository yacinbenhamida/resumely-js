import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

// Shared components
import {
  Portlet,
  PortletContent,
} from 'components';

// Component styles
import styles from './styles';

class PredictionInput extends Component {
  render() {
    const { classes, className
      , firstName, lastName
      , handleChange_FirstName, handleChange_LastName
      , handleSubmit_Prediction, loading, ...rest } = this.props;

    console.log(loading)
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletContent noPadding>
          <form
            autoComplete="off"
            onSubmit={this.props.handleSubmit_Prediction}
            className={classes.form}
          >
            <div className={classes.field} style={{ textAlign: "center" }}>
              <TextField
                className={classes.textField}
                label="First name"
                required
                margin="dense"
                value={this.props.firstName}
                onChange={this.props.handleChange_FirstName}
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label="Last name"
                required
                margin="dense"
                value={this.props.lastName}
                onChange={this.props.handleChange_LastName}
                variant="outlined"
              />
              <br />
              <br />
              <Button
                type="submit"
                variant="contained"
                color="inherit"
                onSubmit={this.props.handleSubmit}
                className={classes.textField}
              >
                {!loading && 'Predict'}
                {loading && <CircularProgress color='secondary' size={24} className={classes.buttonProgress} />}
              </Button>
            </div>
          </form>
        </PortletContent>
      </Portlet>
    );
  }
}

PredictionInput.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PredictionInput);
