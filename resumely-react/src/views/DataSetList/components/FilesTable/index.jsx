import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
    page: 0,
   // candidates: this.props.users,
    loading: false,

  };


  
 /* handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };*/

  render() {
    const { classes, className, users } = this.props;
    const { activeTab, selectedFiles, rowsPerPage, page,candidates } = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <PerfectScrollbar>
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left"> Nom</TableCell>
                  <TableCell align="left">prénom</TableCell>
                  <TableCell align="left">Date de naissance </TableCell>
                  <TableCell align="left">Ville </TableCell>
                  <TableCell align="left">Région </TableCell>
                  <TableCell align="left">Pays </TableCell>
         
                </TableRow>
              </TableHead>
              <TableBody>
              {
                 this.props.users
              
                  .map(candidate => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={candidate._id}>
                  
                      <TableCell className={classes.tableCell}>
                        {candidate._source.firstName}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {candidate._source.lastName}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                       0
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {candidate.country}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {candidate.livesIn}
                      </TableCell>
                   
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </PerfectScrollbar>
  
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