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
    withStyles,Chip
  } from '@material-ui/core';
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
} from 'components';
import styles from './styles';
import axios from 'axios'

class CustomScrappingHistory extends Component {
    state = {
    isLoading : true,
    user : JSON.parse(localStorage.getItem('user')),
    scrappingAttempts : null,
    rowsPerPage: 10,
    page : 0
  };
  getData = async()=>{
    await axios.post(process.env.REACT_APP_BACKEND+'/check-scrapping?secret_token='+localStorage.getItem('token'),
    {id : this.state.user._id , currentstate : "done"}).then(d=>{
        if(d.status === 200){
            this.setState({
                isLoading : false,
                scrappingAttempts : d.data.sort((a, b) => new Date(...a.createdAt.split('/').reverse()) - new Date(...b.createdAt.split('/').reverse()))
            })
        }
    })
  }

  componentDidMount(){
    this.interval = setInterval(this.getData, 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  handleChangePage = (event, page) => {
    console.log(page)
    //this.setState({scrappingAttempts : this.state.scrappingAttempts.slice(this.state.rowsPerPage,this.state.scrappingAttempts.length)})
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
        <PortletContent >
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
        </PortletContent>
        </Portlet>
      );
    }
    if(scrappingAttempts.length === 0){
      return(
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
        <Typography
        className={classes.nameText}
        variant="body1"
        > no records
        </Typography>
      </PortletContent>
      </Portlet>)
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
        <PortletContent noPadding>
        <Table>
            <TableBody>
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
                    { (sc.type ==='multiple' || !sc.type) &&
                    <Typography
                              className={classes.nameText}          
                            >
                      Scrapped from {sc.country} : loaded {sc.currentNoOfRows} out of {sc.expectedNoOfRows} 
                      </Typography>
                    }
                    {sc.type ==='single' && sc.type &&
                    <Typography
                              className={classes.nameText}          
                            >
                      Scrapped one profile
                      </Typography>
                    }
                    </TableCell>
                    <TableCell>
                      <Chip  color="primary" variant="outlined" size="small" label={sc.currentState} />
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