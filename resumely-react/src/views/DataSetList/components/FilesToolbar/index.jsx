import React, { Component  } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import axios from 'axios';
// Material components


// Shared components
import {  SearchInput } from 'components';

// Component styles
import styles from './styles';

import FilesTable from '../FilesTable';

class FilesToolbar extends Component {
 
  constructor(props)
   {
    super(props);
    this.state = {
        open: false,
        files: [],
        openSnackBar: false,
        snackbarMessage: '',
        snackbarVariant: 'success',
        filteredTableData: [],
        birthPlace: null,
        loading: false,
        candidates: [],
        page: 1,
        prevY: 0,
        search:false
    };
  }

  componentDidMount() 
  {
    
    this.getCandidates(this.state.page);

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };
    
    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  
   }



  getCandidates(page)
   {
    this.setState({ loading: true });
    axios({
            method: "get",
            url: "http://localhost:5000/allData/"+page  ,
           
            headers: {
              "Access-Control-Allow-Origin":" *",
              "Access-Control-Allow-Headers":" *",
              "Access-Control-Allow-Methods":" *",
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        })
        .then(response => {
            if (response && response.data) {
                this.setState({   candidates: [...this.state.candidates, ...response.data] ,  filteredTableData:[...this.state.candidates, ...response.data],  loading: false });
               console.log(this.state.candidates)
            }
        })
        .catch(error => console.log(error));
  
  }

getautoComplete(ev)
{
  axios({
    method: "get",
    url: "http://localhost:5000/autocomplete/"+ev.target.value  ,
   
    headers: {
      "Access-Control-Allow-Origin":" *",
      "Access-Control-Allow-Headers":" *",
      "Access-Control-Allow-Methods":" *",
        "Content-Type": "application/json",
        Accept: "application/json"
    }
    })
    .then(response => {
    if (response && response.data) {
        this.setState({        filteredTableData: response.data,  loading: false });
       console.log(this.state.filteredTableData)
    }
  })
    .catch(error => console.log(error));
}

  onFilterValueChanged = ev => 
  {
    if (ev.target.value)
     {
      this.setState({search : true});
      this.getautoComplete(ev);

    }
    else
    {
      this.setState({search : false});
      this.setState({
        filteredTableData: this.state.candidates     
      });
      console.log(this.state.filteredTableData)
    }
  };

  handleObserver(entities, observer)
   {
    const y = entities[0].boundingClientRect.y;
    if (this.state.search === false)
    {
      if (this.state.prevY > y) 
      {
        const lastPhoto = this.state.candidates[this.state.candidates.length - 1];
        console.log(lastPhoto)
        const curPage = lastPhoto._id;
        this.getCandidates(this.state.page+10);
        console.log(curPage)
        this.setState({ page: this.state.page+10 });
      }
      this.setState({ prevY: y });
    }
 

  }
    


 

  render() 
  {
    const { classes, className } = this.props;
    const rootClassName = classNames(classes.root, className);
    const loadingCSS = {
      height: "100px",
      margin: "30px"
    };

    // To change the loading icon behavior
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };
    return (
      <>
      <div className={rootClassName}>
       
        <div className={classes.row}>
          <SearchInput
            className={classes.searchInput}
            placeholder="Search file" value={this.state.birthPlace  } onChange={this.onFilterValueChanged}
          />
   
        </div>

        <FilesTable users={this.state.filteredTableData} />
        
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
      <div className={classes.font}>
 
      </div>
  
      </>
    );
  }
}

FilesToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  selectedFiles: PropTypes.array,
  showAlerts: PropTypes.bool,
};

FilesToolbar.defaultProps = {
  selectedFiles: [],
  showAlerts: true,

};

export default withStyles(styles)(FilesToolbar);
