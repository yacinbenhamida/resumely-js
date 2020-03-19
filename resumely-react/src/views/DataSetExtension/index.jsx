import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { CircularProgress, Typography } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Shared services
import { getFiles } from 'services/user';

// Custom components
import { FilesToolbar, FilesTable } from './components';

// Component styles
import styles from './style';

import axios from 'axios';

class FilesList extends Component {
  signal = true;

  state = {
    isLoading: false,
    limit: 10,
    users: [],
    selectedFiles: [],
    error: null
  };
  
  getUserFiles = ()=>{
    return axios.get(process.env.REACT_APP_BACKEND+"/all-files/"
      +JSON.parse(localStorage.getItem('user'))._id)
  }
  async getFiles() {
    try {
      this.setState({ isLoading: true });      
      let users = null
      await this.getUserFiles().then(res=>{
        users = res.data
      });
      console.log(users[0])
      if (this.signal) {
        this.setState({
          isLoading: false,
          users : users
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }

  componentDidMount() {
    this.signal = true;
    this.getFiles();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSelect = selectedFiles => {
    this.setState({ selectedFiles });
  };

  renderUsers() {
    const { classes } = this.props;
    const { isLoading, users, error } = this.state;

    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (users.length === 0) {
      return <Typography variant="h6">There are no users</Typography>;
    }

    return (
      <FilesTable
        onSelect={this.handleSelect}
        users={users}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { selectedFiles } = this.state;

    return (
      <DashboardLayout title="File management">
        <div className={classes.root}>
          <FilesToolbar selectedFiles={selectedFiles} />
          <div className={classes.content}>{this.renderUsers()}</div>
        </div>
      </DashboardLayout>
    );
  }
}

FilesList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilesList);
