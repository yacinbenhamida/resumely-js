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

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
// Shared helpers
import { getInitials } from 'helpers';

// Shared components
import { Portlet, PortletContent } from 'components';

// Component styles
import styles from './styles';


class FilesTable extends Component {
  state = {
    selectedFiles: [],
    rowsPerPage: 5,
    page: 0,
    activeTab : 0,
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

  render() {
    const { classes, className, files } = this.props;
    const { activeTab, selectedFiles, rowsPerPage, page } = this.state;

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
                      onClick={ev=>console.log(file._id)}
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
