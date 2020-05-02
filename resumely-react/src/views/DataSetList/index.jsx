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

class FilesList extends Component {
  signal = true;

  state = {
    isLoading: false,
    limit: 10,
    users: [],
    selectedFiles: [],
    error: null
  };

  async getFiles() {
    try {
      this.setState({ isLoading: true });

      const { limit } = this.state;

      const { users } = await getFiles(limit);

      if (this.signal) {
        this.setState({
          isLoading: false,
          users
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
      <DashboardLayout title="Liste des candidates">
        <div className={classes.root}>
          <FilesToolbar selectedFiles={selectedFiles} />
       
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
