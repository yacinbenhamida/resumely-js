import React, { Component } from 'react';
// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';



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


  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet className={rootClassName} >
        <PortletContent noPadding>
          <PerfectScrollbar>
          <Table >
              <TableHead >
                <TableRow  >
                  <TableCell align="left">First Name</TableCell>
                  <TableCell align="left">Last Name</TableCell>
                  <TableCell align="left">Age</TableCell>
                  <TableCell align="left">Country </TableCell>
                  <TableCell align="left">lives In </TableCell>   
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
                      {candidate._source.age ? candidate._source.age : 0} 
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {candidate._source.country !== 'No results' ? candidate._source.country : candidate._source.livesIn }
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {candidate._source.livesIn}
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
