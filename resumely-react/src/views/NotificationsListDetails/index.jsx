import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import { NotificationList } from './components';
import axios from 'axios'
// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class NotifList extends Component {
  signal = true;

  state = {
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null
  };
  async getNotifications() {
    try {
      //const { notificationsLimit } = this.state;
      await axios.post(process.env.REACT_APP_BACKEND
        +'/notifications/all?secret_token='+localStorage.getItem('token'))
        .then(d => {
        console.log(d)
        console.log(d.data)
        if (this.signal) {
          this.setState({
            notifications : d.data,
            notificationsCount : d.data.length
          });
        }
      })
    } catch (error) {
      return;
    }
  }
  handleCloseNotifications = () => {
    this.setState({
      notificationsEl: null
    });
  };

  componentDidMount() {
    this.signal = true;
    this.getNotifications();
  }

  componentWillUnmount() {
    this.signal = false;
  }
  render() {
    const { notifications } = this.state
    const { classes } = this.props;

    return (
      <DashboardLayout title="Notifications">
        <div className={classes.root}>
        <NotificationList
          notifications={notifications}
          onSelect={this.handleCloseNotifications}
        />
        </div>
      </DashboardLayout>
    );
  }
}

NotifList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotifList);
