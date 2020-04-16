import React, { Component  } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

// Material components
import { Button, IconButton } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
// Material icons
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
// Shared components
import {  SearchInput } from 'components';

// Component styles
import styles from './styles';
import {DropzoneDialog} from 'material-ui-dropzone'
import SnackBarWrapper from 'components/DropZone/SnackBar'
import Axios from 'axios';
import AlertDialog from './AlertDialog';
import download from 'downloadjs'
class FilesToolbar extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
        open: false,
        files: [],
        openSnackBar: false,
        snackbarMessage: '',
        snackbarVariant: 'success',
        allFiles : [],
        promptDelete : false,
        confirmDelete : false
    };
  }
  componentDidMount(){
    this.setState({
      allFiles : this.props.allFiles
    })
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
    Axios.post(process.env.REACT_APP_BACKEND+'/upload-files?secret_token='+localStorage.getItem('token'),data,{})
    .then(response => {
      if(response.statusText === "OK"){
        this.setState({openSnackBar : true,snackbarMessage: 'uploaded successfuly'})
      }
      else {
        this.setState({openSnackBar : true,snackbarVariant: 'error',snackbarMessage: 'failed to upload'})
      }
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
  reloadData = async () => {
    await this.props.reloadFilesAction().then(x=>{
      this.setState({
        allFiles : x.data
      })
    })
    this.props.handler(this.state.allFiles)
  }
  filterTable = (content)=>{
    if(content.target.value){
      this.setState({
        allFiles : this.props.allFiles.filter(f=>f.filename.includes(content.target.value))
      })
    }
    else  this.reloadData()
    this.props.handler(this.state.allFiles)
  }
  showDeleteDialog(){
    this.setState({promptDelete : true})
  }
  handleConfirmDelete = (answer) => {
    if(answer === "ok"){
      this.handleDeletefiles()
    }
      this.setState({promptDelete : false})   
  }
  handleDeletefiles = async () => {
    let toBeDeleted = []
    await this.props.allFiles.forEach(file=>{
      for (const iterator of this.props.selectedFiles) {
        if(iterator === file._id) toBeDeleted.push(file)
      }
    })
    Axios
    .post(process.env.REACT_APP_BACKEND+'/delete-files?secret_token='+localStorage.getItem('token')
    ,{files : toBeDeleted})
    .then(response=>{
      if(response.status === 200){
        this.reloadData()
        this.setState({openSnackBar : true,snackbarMessage: 'file deleted from storage'})
      }else{
        this.setState({openSnackBar : true,snackbarMessage: 'error deleting',snackbarVariant : 'error'})
      }
    })
  }
  handleExportFiles = async () => {
    console.log('triggered')
    let toBeDownloaded = []
    await this.props.allFiles.forEach(file=>{
      for (const iterator of this.props.selectedFiles) {
        if(iterator === file._id) toBeDownloaded.push(file)
      }
    })
    fetch(process.env.REACT_APP_BACKEND+'/download-files?secret_token='+localStorage.getItem('token')
    ,{method: 'put',files : toBeDownloaded})
    .then(response => {
      response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'files.zip';
					a.click();
      })
      //window.location.href = response.url;
    })
    /*.then(response=>{
      window.location.href = response.url
      if(response.status === 200){
        this.setState({openSnackBar : true,snackbarMessage: 'downloading files...'})
      }else{
        this.setState({openSnackBar : true,snackbarMessage: 'error downloading',snackbarVariant : 'error'})
      }
    })*/
  }
  render() {
    const { classes, className, selectedFiles } = this.props;
    const rootClassName = classNames(classes.root, className);
    return (
      <>
      <AlertDialog open={this.state.promptDelete}
       text="are you sure you want to delete these files ?"
       close="cancel"
       validate="proceed"
       title="deleting files"
       handleConfirmDelete={this.handleConfirmDelete}
       />
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          {selectedFiles.length > 0 && (
            <IconButton
              className={classes.deleteButton}
              onClick={()=>this.setState({promptDelete : true})}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <Button
          className={classes.importButton}
          size="small"
          variant="outlined"
          onClick={this.reloadData}
        >
          <AutorenewIcon /> 
        </Button>
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
            onClick={this.handleExportFiles}
          >
            <ArrowUpwardIcon className={classes.exportIcon} />
            Export
          </Button>
        </div>
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search file"
            onChange={this.filterTable}
          />
        </div>
      </div>
      <DropzoneDialog
        open={this.state.open}
        onSave={this.handleSave.bind(this)}
        acceptedFiles={['application/*']}
        showPreviews={true}
        maxFileSize={5000000}
        onClose={this.handleClose.bind(this)}
        showFileNamesInPreview={true}
      />
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={this.state.openSnackBar}
            autoHideDuration={6000}
            onClose={this.handleCloseSnackbar}
        >
            <SnackBarWrapper
                onClose={this.handleCloseSnackbar}
                variant={this.state.snackbarVariant}
                message={this.state.snackbarMessage}
            />
        </Snackbar>
    
      </>
    );
  }
}

FilesToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedFiles: PropTypes.array,
  showAlerts: PropTypes.bool,
  allFiles : PropTypes.array,
  reloadFilesAction : PropTypes.func,
};

FilesToolbar.defaultProps = {
  selectedFiles: [],
  showAlerts: true,
  allFiles : []
};

export default withStyles(styles)(FilesToolbar);
