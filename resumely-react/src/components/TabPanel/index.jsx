import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {Box, Typography} from '@material-ui/core';

export class TabPanel extends Component {
    render() {
        const { children, value, index, ...other } = this.props;
        return (
            <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && <Box p={3}>{children}</Box>}
          </Typography>
        );
    }
    
}
 
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

