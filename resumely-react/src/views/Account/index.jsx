import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import {  AccountDetails } from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});
class Account extends Component {

  constructor(props)
  {
    super(props);

  
    
    this.state = { tabIndex: 0 };
  }
   
  

  render() {
    const { classes } = this.props;
  //  const user = JSON.parse(localStorage.getItem('user'));
    return (
      <DashboardLayout title="Account">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              lg={2}
              md={3}
              xl={2}
              xs={6}
            >
             
            </Grid>
            <Grid
              item
              lg={8}
              md={6}
              xl={8}
              xs={12}
            >
               <Grid
              item
              lg={2}
              md={3}
              xl={2}
              xs={6}
            ></Grid>
              <AccountDetails />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Account);
