import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar
} from '@material-ui/core';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent
} from 'components';


// Component styles
import styles from './styles';
import axios from 'axios'


class OrdersTable extends Component {
  signal = false;

  state = {
    isLoading: false,
    limit: 10,
    candidates: [],
    candidatesTotal: 0
  };

  async getOrders(limit) {
    try {
      this.setState({ isLoading: true });
      
     // const { orders, ordersTotal } = await getOrders(limit);
      axios.get(process.env.REACT_APP_BACKEND+'/dashboard/latest-candidates?secret_token='+localStorage.getItem('token'))
      .then(res=>{
        if (this.signal) {
          console.log(res.data)
          this.setState({
            isLoading: false,
            candidates : res.data,
            candidatesTotal : res.data.length
          });
        }
      })
      
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

    const { limit } = this.state;

    this.getOrders(limit);
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className } = this.props;
    const { isLoading, candidates, candidatesTotal } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading && candidates.length > 0;

    return (
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            subtitle={`${candidatesTotal} in total`}
            title="Newest profiles"
          />
        </PortletHeader>
        <PerfectScrollbar>
          <PortletContent
            className={classes.portletContent}
            noPadding
          >
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}
            {showOrders && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right" colSpan={2}>First Name</TableCell>
                    <TableCell align="left">Last Name</TableCell>
                    <TableCell align="left">Lives in</TableCell>
                    <TableCell align="left">Country</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidates.map(c => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      onClick = {e => {window.open(c.profile,"_blank")}}
                      key={c._id}
                    >
                      <TableCell>
                        <Avatar
                          className={classes.avatar}
                          src={c.imageUrl !== 'No results'  ? c.imageUrl : "https://debut.careers/app/themes/debut/assets/images/Profile-Fallback-01-01.png"}
                        >
                        </Avatar>
                      </TableCell>
                      <TableCell>{c.firstName}</TableCell>
                      <TableCell className={classes.customerCell}>
                        {c.lastName}
                      </TableCell>
                      <TableCell>
                        {c.livesIn !== 'No results' ? c.livesIn : c.country}
                      </TableCell>
                      <TableCell>
                        {c.country}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PortletContent>
        </PerfectScrollbar>
      </Portlet>
    );
  }
}

OrdersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrdersTable);
