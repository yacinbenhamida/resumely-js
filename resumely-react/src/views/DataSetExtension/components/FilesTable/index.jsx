import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconButton } from '@material-ui/core';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
} from '@material-ui/core';
import axios from 'axios';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// Shared helpers
import { getInitials } from 'helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import { Redirect } from 'react-router-dom';

// Shared components
import { Portlet, PortletContent } from 'components';
import Paper from '@material-ui/core/Paper';

// Component styles
import styles from './styles';


class FilesTable extends Component {
  state = {
    selectedFiles: [],
    rowsPerPage: 5,
    page: 0,
    activeTab : 0,
    parsedFromFile : null,
    sendToNextPage : false,
    popupScanResult : false,
    targetedFileName : null
  };
 
  handleSelectAll = event => {
    const { files, onSelect } = this.props;

    let selectedFiles;

    if (event.target.checked) {
      selectedFiles = files.map(user => user._id);
    } else {
      selectedFiles = [];
    }

    this.setState({ selectedFiles });

    onSelect(selectedFiles);
  };

  handleSelectOne = (event, id) => {
    const { onSelect } = this.props;
    const { selectedFiles } = this.state;

    const selectedIndex = selectedFiles.indexOf(id);
    let newselectedFiles = [];

    if (selectedIndex === -1) {
      newselectedFiles = newselectedFiles.concat(selectedFiles, id);
    } else if (selectedIndex === 0) {
      newselectedFiles = newselectedFiles.concat(selectedFiles.slice(1));
    } else if (selectedIndex === selectedFiles.length - 1) {
      newselectedFiles = newselectedFiles.concat(selectedFiles.slice(0, -1));
    } else if (selectedIndex > 0) {
      newselectedFiles = newselectedFiles.concat(
        selectedFiles.slice(0, selectedIndex),
        selectedFiles.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedFiles: newselectedFiles });

    onSelect(newselectedFiles);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleScanFile = (file) => {
    axios.post(process.env.REACT_APP_BACKEND+'/parse-file?secret_token='+localStorage.getItem('token'),{filename : file.filename})
    .then(
      axios.post(process.env.REACT_APP_BACKEND+'/parse-file-data?secret_token='+localStorage.getItem('token'),{filename : file.filename})
      .then(parsed=>{
        console.log(parsed.data)
        this.setState({parsedFromFile : parsed.data.parsed , popupScanResult : true, targetedFileName : file.filename})
      })
    )     
  }
  handleCloseWithinsert = () => {
    axios.post(process.env.REACT_APP_BACKEND+'/parsing/database')
    .then(res => console.log(res.data));
    axios.get(process.env.REACT_APP_BACKEND+'/getall')
    .then(response => {
        this.setState({ resumes: response.data });
    })
    .catch(function (error){
        console.log(error);
    })
    this.setState({ sendToNextPage: true });  
  }
  handleCloseWithdelete = () => {
    axios.get(process.env.REACT_APP_BACKEND+'/delete/parsed')
    .then(response => {
      this.setState({
        parsedFromFile : null,
        popupScanResult : false,
        targetedFileName : null
      })
    })
    window.location.reload()
  }
  handleClose = () =>{
    this.setState({
      parsedFromFile : null,
      popupScanResult : false,
      targetedFileName : null
    })
  }
  render() {
    const { classes, className, files } = this.props;
    const { activeTab, selectedFiles, rowsPerPage, page, parsedFromFile,popupScanResult,targetedFileName } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <PerfectScrollbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <Checkbox
                      checked={selectedFiles.length === files.length}
                      color="primary"
                      indeterminate={
                        selectedFiles.length > 0 &&
                        selectedFiles.length < files.length
                      }
                      onChange={this.handleSelectAll}
                    />
                    File Name
                  </TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="left">Upload date</TableCell>
                  <TableCell align="left">Scan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files
                  .filter(file => {
                    if (activeTab === 1) {
                      return !file.returning;
                    }

                    if (activeTab === 2) {
                      return file.returning;
                    }

                    return file;
                  })
                  .slice(0, rowsPerPage)
                  .map(file => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={file._id}
                      selected={selectedFiles.indexOf(file._id) !== -1}
                    >
                      <TableCell className={classes.tableCell}>
                        <div className={classes.tableCellInner}>
                          <Checkbox
                            checked={selectedFiles.indexOf(file._id) !== -1}
                            color="primary"
                            onChange={event =>
                              this.handleSelectOne(event, file._id)
                            }
                            value="true"
                          />
                          <Avatar
                            className={classes.avatar}
                            src="../"
                          >
                            {getInitials(file.filename)}
                          </Avatar>
                          <Link to="#">
                            <Typography
                              className={classes.nameText}
                              variant="body1"
                            >
                              {file.filename}
                            </Typography>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {file.ownerUsername}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {moment(file.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                      <IconButton
                        className={classes.deleteButton}
                        onClick={this.handleScanFile.bind(this,file)}
                      >
                      <CloudUploadIcon />
                    </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </PerfectScrollbar>
          <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={files.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </PortletContent>
        {parsedFromFile &&  popupScanResult &&
          <Dialog
            fullWidth={true}
            maxWidth = {'lg'}
            open={popupScanResult}
            onClose={this.handleClose}
          >
          <DialogTitle >parsed data from file : {targetedFileName}</DialogTitle>
          <DialogContent>
          <TableContainer component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Results</TableCell>        
                <TableCell align="right">First name</TableCell>
                <TableCell align="right">Last name</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Phone</TableCell>
                <TableCell align="right">Adress</TableCell>
                <TableCell align="right">Birth date</TableCell>
                <TableCell align="right">Age</TableCell>         
              </TableRow>
            </TableHead>
            <TableBody>            
                <TableRow key={parsedFromFile.name.fullName}>         
                  <TableCell align="right">{parsedFromFile.name.firstName}</TableCell>
                  <TableCell align="right">{parsedFromFile.name.lastName}</TableCell>
                  <TableCell align="right">{parsedFromFile.email}</TableCell>
                  <TableCell align="right">{parsedFromFile.phone}</TableCell>
                  <TableCell align="right">{parsedFromFile.adresse}</TableCell>
                  <TableCell align="right">{parsedFromFile.DateNaissance}</TableCell>
                  <TableCell align="right">{parsedFromFile.age}</TableCell>         
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseWithdelete} color="primary">
               Discard all
              </Button>
              <Button onClick={this.handleCloseWithinsert} color="primary" autoFocus>
               Add to dataset
              </Button>
              {this.state.sendToNextPage &&
              <Redirect to='/datasetparsing' />
              }
            </DialogActions>
          </Dialog>
          }
      </Portlet>
    );
  }
}

FilesTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onShowDetails: PropTypes.func,
  files: PropTypes.array.isRequired
};

FilesTable.defaultProps = {
  files: [],
  onSelect: () => {},
  onShowDetails: () => {}
};

export default withStyles(styles)(FilesTable);
