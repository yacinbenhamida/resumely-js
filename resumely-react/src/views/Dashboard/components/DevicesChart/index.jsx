import React, { Component } from 'react';

// Externals
import { Doughnut } from 'react-chartjs-2';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';



// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent
} from 'components';

// Palette
import palette from 'theme/palette';

// Chart configuration
import { options } from './chart';
import axios from 'axios'
// Component styles
import styles from './styles';

class DevicesChart extends Component {
  state = {
    countries : [],
    data : {
      datasets: [
        {
          data: [63, 15, 22],
          backgroundColor: [
            palette.primary.main,
            palette.danger.main,
            palette.warning.main
          ],
          borderWidth: 8,
          borderColor: palette.common.white,
          hoverBorderColor: palette.common.white
        }
      ],
      labels: ['France', 'Tunisia', 'Canada']
    }
  }
   
  componentDidMount(){
    this.getCountriesCount()
  }
  getRandomColor() {
    var letters = '0123456789ABCDEFGH'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    if(color !== '#FFFFFF' || color !=='FFFAFA' || color !== 'F0FFF0') return color;

}
  getCountriesCount(){
    axios.get(process.env.REACT_APP_BACKEND+'/dashboard/countriesCount?secret_token='+localStorage.getItem('token'))
    .then(res=>{
        let numbers = []
        let labels = []
        let colors = []
        res.data.countriesByCount.forEach(element => {
          numbers.push(element.count)
          labels.push(element._id)
          colors.push(this.getRandomColor())
        });
        console.log(numbers)
        this.setState({countries : res.data , data : {
          datasets: [
            {
              data: numbers,
              backgroundColor: colors,
              hoverBorderColor: palette.common.white
            }
          ],
          labels: labels
        }})
      })
  }
  render() {
    const { classes, className, ...rest } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader noDivider>
          <PortletLabel title="Countries" />
        </PortletHeader>
        <PortletContent>
          <div className={classes.chartWrapper}>
            <Doughnut
              data={this.state.data}
              options={options}
            />
          </div>
        </PortletContent>
      </Portlet>
    );
  }
}

DevicesChart.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DevicesChart);
