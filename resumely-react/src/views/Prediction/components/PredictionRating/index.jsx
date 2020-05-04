import React, { Component, Fragment } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Avatar, Typography, Button, LinearProgress, TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';

import { CircularProgress } from '@material-ui/core';

// Material icons
import { ArrowRight as ArrowRightIcon } from '@material-ui/icons';

// Shared components
import { Portlet, PortletContent, PortletFooter } from 'components';
// Shared components
import { PortletHeader, PortletLabel } from 'components';

// Component styles
import styles from './styles';

class PredictionRating extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            prediction: '',
            loading: false,
        };
    }

    render() {
        function capitalize(name) {
            return name
                .charAt(0)
                .toUpperCase() + name.slice(1);
        }

        const {
            classes,
            className,
            ...rest
        } = this.props;

        const rootClassName = classNames(classes.root, className);

        const countries = this.state.countries;

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
                      {!this.state.loading && 'Predict'}
                      {this.state.loading && <CircularProgress color='secondary' size={24} className={classes.buttonProgress} />}
                    </Button>
                  </div>
                </form>
              </PortletContent>
            </Portlet>
          );
    }
}

export default withStyles(styles)(PredictionRating);
