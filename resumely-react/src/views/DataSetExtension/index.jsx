import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { CircularProgress, Typography } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { FilesToolbar, FilesTable, CustomScrapping, CustomScrappingHistory } from './components';


import { Grid } from '@material-ui/core';

// Component styles
import styles from './style';

import axios from 'axios';

class FilesList extends Component {
  constructor(props){
    super(props);
    this.signal = true;
    
    this.handler = this.handler.bind(this)
  }
  signal = true;
  interval = null;
  handler(updatedList) {
    this.setState({
      isLoading : true,
      files : updatedList
    })
  }
  componentDidUpdate(){
    setTimeout(() => this.setState({isLoading:false}), 1000);
  }

  state = {
    isLoading: false,
    limit: 10,
    files: [],
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
      let files = null
      await this.getUserFiles().then(res=>{
        files = res.data
      });
      if (this.signal) {
        this.setState({
          isLoading: false,
          files : files
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
    this.interval = setInterval(this.getFiles(), 5000);
  }

  componentWillUnmount() {
    this.signal = false;
    clearInterval(this.interval);
  }

  handleSelect = selectedFiles => {
    this.setState({ selectedFiles });
  };

  renderfiles() {
    const { classes } = this.props;
    const { isLoading, files, error } = this.state;

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

    if (files.length === 0) {
      return <Typography variant="h6">There are no files</Typography>;
    }

    return (
      <FilesTable
        onSelect={this.handleSelect}
        files={files}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { selectedFiles,files } = this.state;
    return (
      <DashboardLayout title="File management">
      <Grid
            container
            spacing={4}
            className={classes.root}
          >
            <Grid
              item
              md={4}
              xs={6}   
            >
          <CustomScrapping />
          </Grid> 
          <Grid
              item
              md={8}
              xs={6}  
          >
          <CustomScrappingHistory />
          </Grid>
          <Grid
              item
              md={12}
              xs={12}
              className={classes.root}
            >
          <FilesToolbar reloadFilesAction={this.getUserFiles} handler={this.handler} allFiles={files} selectedFiles={selectedFiles} />
          <div className={classes.content}>{this.renderfiles()}</div>
        </Grid>
        </Grid>
      </DashboardLayout>
    );
  }
}

FilesList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilesList);
