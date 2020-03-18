import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';

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
  TablePagination
} from '@material-ui/core';

// Shared helpers
import { getInitials } from 'helpers';

// Shared components
import { Portlet, PortletContent } from 'components';

// Component styles
import styles from './styles';

class FilesTable extends Component {
  state = {
    selectedFiles: [],
    rowsPerPage: 10,
    page: 0
  };

  handleSelectAll = event => {
    const { users, onSelect } = this.props;

    let selectedFiles;

    if (event.target.checked) {
      selectedFiles = users.map(user => user.id);
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
    const { classes, className, users } = this.props;
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
                      checked={selectedFiles.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedFiles.length > 0 &&
                        selectedFiles.length < users.length
                      }
                      onChange={this.handleSelectAll}
                    />
                    File Name
                  </TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="left">Upload date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .filter(user => {
                    if (activeTab === 1) {
                      return !user.returning;
                    }

                    if (activeTab === 2) {
                      return user.returning;
                    }

                    return user;
                  })
                  .slice(0, rowsPerPage)
                  .map(user => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedFiles.indexOf(user.id) !== -1}
                    >
                      <TableCell className={classes.tableCell}>
                        <div className={classes.tableCellInner}>
                          <Checkbox
                            checked={selectedFiles.indexOf(user.id) !== -1}
                            color="primary"
                            onChange={event =>
                              this.handleSelectOne(event, user.id)
                            }
                            value="true"
                          />
                          <Avatar
                            className={classes.avatar}
                            src={user.avatarUrl}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Link to="#">
                            <Typography
                              className={classes.nameText}
                              variant="body1"
                            >
                              {user.name}
                            </Typography>
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.id}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {moment(user.createdAt).format('DD/MM/YYYY')}
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
            count={users.length}
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
  users: PropTypes.array.isRequired
};

FilesTable.defaultProps = {
  users: [],
  onSelect: () => {},
  onShowDetails: () => {}
};

export default withStyles(styles)(FilesTable);
