import React, { Component  } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';
import axios from 'axios';
// Material components

import { Grid,Checkbox ,FormControlLabel ,FormGroup ,MuiThemeProvider ,Box} from '@material-ui/core';

// Material icons
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

// Shared components
import {  SearchInput } from 'components';


import { Portlet, PortletContent,  PortletHeader,
  PortletLabel, } from 'components';
// Component styles
import styles from './styles';

import FilesTable from '../FilesTable';
import { CircularProgress } from '@material-ui/core';
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
        pageSearch:1,
        prevY: 0,
        search:false,
        countries:[],
        checkedItems: new Map(),
        options:[],
        query:null
    
    };

  }

  componentDidMount() 
  {
    
    this.getCandidates(this.state.page);
    this.getCountries();
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

  getCountries()
   {
 
    axios({
            method: "get",
            url: "http://localhost:5000/countries" ,
           
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
                this.setState({   countries: response.data});
               console.log(this.state.countries)
            }
        })
        .catch(error => console.log(error));
  
  }

getautoComplete()
{
  
  axios({
    method: "get",
    url: "http://localhost:5000/autocomplete/" ,
   params:{
     
     
      prefix : this.state.query ,
      options: this.state.options
     
    },
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
    if (ev.target.value && this.state.options.length == 0)
     {

      //this.setState({search : true});
      //this.getautoComplete(ev);
       this.state.query=ev.target.value;
      this.state.search=true;
      this.getautoComplete();
      console.log(  this.state.options)


    }
    else  if (ev.target.value && this.state.options.length != 0)
    {
      this.state.query=ev.target.value;
     this.state.search=true;
     this.getautoComplete();
     console.log(  this.state.query)

   }
   else  if (!ev.target.value  && this.state.options.length != 0)
   {
     this.state.query=null;
    this.state.search=true;
    this.getautoComplete();
    console.log(  this.state.query)

  }
    else if (!ev.target.value && this.state.options.length == 0)
    {

//      this.setState({search : false});

      this.state.search=false;
      this.state.query=null;
      console.log(  this.state.query)

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
    


  handleChange = e => {
   
 //this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
 const item = e.target.name;
 const isChecked = e.target.checked;

  this.setState({ checkedItems: this.state.checkedItems.set(item, isChecked) });
  // console.log(e.target.name)
   console.log(this.state.checkedItems)
   
   var mapValues = this.state.checkedItems.values();
   var mapIKey = this.state.checkedItems.keys();
 

  /* console.log(mapValues.next().value)
   console.log(mapIKey.next().value)*/
   for (const  [key, value] of  this.state.checkedItems.entries()) {
   
    console.log(this.state.options.indexOf(key));
  if ( this.state.options.indexOf(key)  !== -1)
  {

   if (value ==false)
    {
      var index = this.state.options.indexOf(key); // Let's say it's Bob.
      this.state.options.splice(index,1);
    }
  }
  else if ( this.state.options.indexOf(key)  == -1)
  {
    if (value ==true)
    {
      console.log(key)
      this.state.options.push(key);
  
    }
    
  }
  console.log(  this.state.options)
  if (this.state.options.length >0 && this.state.query == null)
  {
    this.getautoComplete();
  }
  else if (this.state.options.length == 0 && this.state.query == null)
  {
  this.setState({
    filteredTableData: this.state.candidates     
  });
  console.log(this.state.filteredTableData)
  }
  else if (this.state.options.length == 0 && this.state.query != null)
  {
    this.getautoComplete();
  }
  }


  };
 

  render() 
  {
    const { classes, className } = this.props;
    const rootClassName = classNames(classes.root, className);
    const { countries} = this.state;
    const loadingCSS = {
      height: "100px",
      margin: "30px"
    };

    // To change the loading icon behavior
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };
    return (
      <>
      <div className={rootClassName}>
      <Grid container spacing={1} >
       
        <Grid item xs={3}>
      
        <Portlet >
        <PortletHeader>
          <PortletLabel
           
            title="Localisation"
          />
        </PortletHeader>
        <PortletContent style={{ height: "250px", overflow: "auto" }}  >     
        <MuiThemeProvider >
        <FormGroup>
       {
    this.state.countries.map(c=>(
                <FormControlLabel
                 key={c.key}
                  control=
                  {
                    <Checkbox
                   
                      color="primary"
                      name={c.key}
                      checked={this.state.checkedItems.get(c.key) || false } 
                      onChange={this.handleChange}
                      value={c.key}
                    />
                  }
                  label={c.key}
                />
                ))
          }
        </FormGroup>
      </MuiThemeProvider>

    </PortletContent>
    </Portlet>
        </Grid>
        <Grid item xs={9}>
        <Box mt={-1}>
        <div className={classes.row}>
          
          <SearchInput
            className={classes.searchInput}
            placeholder="Rechercher par nom , prénom" value={this.state.birthPlace  } onChange={this.onFilterValueChanged}
          />
        
        </div>
        </Box>
        <FilesTable users={this.state.filteredTableData} />
        </Grid>
    
      </Grid>
    
   


 
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
