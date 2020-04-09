import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid, AppBar, Tabs, Tab , CircularProgress, Typography} from '@material-ui/core';
import {TabPanel} from '../../components/TabPanel'
// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { FilesToolbar, FilesTable, CustomScrapping, CustomScrappingHistory, CustomSingleScrapper } from './components';

import SwipeableViews from 'react-swipeable-views';
// Component styles
import styles from './style';

import axios from 'axios';

class FilesList extends Component {
  signal = true;
  interval = null;
  constructor(props){
    super(props);
    this.signal = true;
    this.handler = this.handler.bind(this)
  }

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
    error: null,
    value : 1
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
    this.getFiles()
  }

  componentWillUnmount() {
    this.signal = false;
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
  handleChange = (event, newValue) => {
    this.setState({value : newValue})
  };
  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  handleChangeIndex = (ind) => {
    this.setState({ index : ind })
  };
  render() {
    const { classes } = this.props;
    const { selectedFiles,files, value } = this.state;
    return (
      <DashboardLayout title="Dataset extension">
      <AppBar position="static">
        <Tabs variant="fullWidth" value={value} onChange={this.handleChange} aria-label="simple tabs example">
          <Tab label="Data Scrapping" {...this.a11yProps(0)} />
          <Tab label="Files Management" {...this.a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
      axis={'x'}
      index={value}
      onChangeIndex={this.handleChangeIndex}
      >
      <TabPanel value={value} index={0}>
         <Grid
            container
            spacing={2}
            className={classes.root}
          >
          <Grid
            container
            item
            md={6}
            xs={6} 
            spacing={2}
            className={classes.root}
          >
          <Grid
              item
              md={12}
              xs={12}   
            >
            <CustomSingleScrapper />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}   
            >
          <CustomScrapping />
          </Grid> 
          </Grid>
          <Grid
              item
              md={6}
              xs={6}  
          >
          <CustomScrappingHistory />
          </Grid>       
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Grid
            container
            spacing={2}
            className={classes.root}
          >
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
      </TabPanel>    
      </SwipeableViews>
      </DashboardLayout>
    );
  }
}


FilesList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FilesList);
