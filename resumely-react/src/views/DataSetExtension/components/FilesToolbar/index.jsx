import React, { Component  } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

// Material components
import { Button, IconButton } from '@material-ui/core';

// Material icons
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
// Shared components
import { DisplayMode, SearchInput } from 'components';

// Component styles
import styles from './styles';

import {DropzoneDialog,SnackbarContentWrapper} from 'components/DropZone/index'
import Axios from 'axios';

class FilesToolbar extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        files: [],
        openSnackBar: false,
        snackbarMessage: '',
        snackbarVariant: 'success',
    };
  }
  handleClose() {
    this.setState({
        open: false,
        files : []
    });
  }

  handleSave(files) {
    this.setState({
        files: files, 
        open: false
    });
    const data = new FormData()
    for(var x = 0; x < files.length; x++) {
      data.append('file', files[x])
    }    
    data.append('user',  localStorage.getItem('user'))
    Axios.post(process.env.REACT_APP_BACKEND+'/upload-files',data,{})
    .then(response => {
      if(response.statusText === "OK"){
        this.setState({openSnackBar : true,snackbarMessage: 'uploaded successfuly'})
      }
      else {
        this.setState({openSnackBar : true,snackbarVariant: 'error',snackbarMessage: 'failed to upload'})
      }
      console.log(response.statusText)
    })
  }

  handleOpen() {
    this.setState({
        open: true,
    });
  }
  handleCloseSnackbar = () => {
    this.setState({
        openSnackBar: false,
    });

};
  render() {
    const { classes, className, selectedFiles } = this.props;
    const rootClassName = classNames(classes.root, className);
    return (
      <>
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          {selectedFiles.length > 0 && (
            <IconButton
              className={classes.deleteButton}
              onClick={this.handleDeletefiles}
            >
              <DeleteIcon />
            </IconButton>
          )}
     
          <Button
            className={classes.importButton}
            size="small"
            variant="outlined"
            onClick={this.handleOpen.bind(this)}
          >
            <ArrowDownwardIcon className={classes.importIcon} /> Import
          </Button>
          <Button
            className={classes.exportButton}
            size="small"
            variant="outlined"
          >
            <ArrowUpwardIcon className={classes.exportIcon} />
            Export
          </Button>
          <Button
            color="primary"
            size="small"
            variant="outlined"
          >
            Add
          </Button>
        </div>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search file"
          />

        </div>
      </div>
      <div className={classes.font}>
      <DropzoneDialog
        open={this.state.open}
        onSave={this.handleSave.bind(this)}
        acceptedFiles={['application/*']}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={this.handleClose.bind(this)}
      />
      </div>
      {this.props.showAlerts &&
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.openSnackBar}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
        >
            <SnackbarContentWrapper
                onClose={this.handleCloseSnackbar}
                variant={this.state.snackbarVariant}
                message={this.state.snackbarMessage}
            />
        </Snackbar>
    }
      </>
    );
  }
}

FilesToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedFiles: PropTypes.array,
  showAlerts: PropTypes.bool,
};

FilesToolbar.defaultProps = {
  selectedFiles: [],
  showAlerts: true,

};

export default withStyles(styles)(FilesToolbar);
