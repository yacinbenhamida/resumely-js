import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

// Material helpers
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    TablePagination,
    CircularProgress,
    withStyles
  } from '@material-ui/core';
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
} from 'components';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import styles from './styles';
import axios from 'axios'

class CustomScrappingHistory extends Component {
    state = {
    isLoading : true,
    user : JSON.parse(localStorage.getItem('user')),
    scrappingAttempts : null,
    rowsPerPage: 5,
    page : 0
  };
  getData = async()=>{
    await axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
    {id : this.state.user._id , currentstate : "done"}).then(d=>{
        console.log(d)
        if(d.status === 200){
            this.setState({
                isLoading : false,
                scrappingAttempts : d.data.sort((a, b) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()))
            })
        }
    })
  }
  componentWillMount(){
    this.getData()
  }
  componentDidMount(){
    setInterval(this.getData, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  
  render() {
    const { classes, className, ...rest } = this.props;
    const { isLoading,activeTab, rowsPerPage, page,scrappingAttempts } = this.state;
    
    const rootClassName = classNames(classes.root, className);
    if (isLoading) {
      return (
        <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
            subtitle="previous scrapping attempts"
            title="Scrapping History"
          />        
          </PortletHeader>
        <PortletContent noPadding>
          <CircularProgress />
        </PortletContent>
        </Portlet>
      );
    }
    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader>
          <PortletLabel
          subtitle="previous scrapping attempts"
          title="History"
          />
        </PortletHeader>
        <PortletContent>
        <Table>
            <TableBody>
            {scrappingAttempts.length === 0 &&
                <Typography
                className={classes.nameText}
                variant="body1"
                > no records
                </Typography>
            }
            {scrappingAttempts
                .filter(sc => {
                  if (activeTab === 1) {
                    return !sc.returning;
                  }

                  if (activeTab === 2) {
                    return sc.returning;
                  }

                  return sc;
                })
                .slice(0, rowsPerPage)
                .map(sc => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={sc._id}
                  >       
                    <TableCell align="justify" className={classes.tableCell}>
                    <Typography
                              className={classes.nameText}          
                            >
                    <ArrowRightIcon  fontSize="small" />
                      Scrapped from {sc.country} : loaded {sc.currentNoOfRows} out of {sc.expectedNoOfRows} 
                      </Typography>
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                      in {moment(sc.createdAt).format('DD/MM/YYYY')} at {moment(sc.createdAt).format('HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
        </Table>
        <TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={scrappingAttempts.length}
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

CustomScrappingHistory.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomScrappingHistory);