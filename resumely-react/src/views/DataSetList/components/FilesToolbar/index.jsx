import React, { Component  } from 'react';
// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Material helpers
import { withStyles } from '@material-ui/core';
import axios from 'axios';
// Material components
import { Grid,Checkbox ,FormControlLabel ,FormGroup ,MuiThemeProvider ,Box} from '@material-ui/core';
// Shared components
import {  SearchInput } from 'components';
import { Portlet, PortletContent,  PortletHeader,PortletLabel, } from 'components';
// Component styles
import styles from './styles';
import { Backdrop } from '@material-ui/core';
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
        searchInput: null,
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
    this.timeout =  0;
  
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
    
  handleObserver(entities, observer)
  {
  
   if (this.state.search === false){

 
   const y = entities[0].boundingClientRect.y;
     if (this.state.prevY > y) 
     {
       const lastPhoto = this.state.candidates[this.state.candidates.length - 1];
       console.log(lastPhoto)
       this.getCandidates(this.state.page+10);
       this.setState({ page: this.state.page+10 });
     }
     this.setState({ prevY: y });
    }

 }

   handleClose = () => {
      this.setState({
        open: false
      });
    };
    handleToggle = () => {
      this.setState({
        open: !this.state.open
      });
      setTimeout(() => this.setState({ open: false}), 1000)
     
    };

    getCandidates(page)
    {
    this.setState({ loading: true });
      axios
      .get(process.env.REACT_APP_BACKEND+"/allData/"+page)
        .then(response => {
            if (response && response.data) {
                this.setState({   candidates: [...this.state.candidates, ...response.data] ,  filteredTableData:[...this.state.candidates, ...response.data],  loading: false });
         
            }
        })
        .catch(error => console.log(error));
  
  }

  getCountries()
   {
    axios
    .get(process.env.REACT_APP_BACKEND+"/countries")
    .then(response => {
            if (response && response.data) {
                this.setState({   countries: response.data});
              
            }
        })
        .catch(error => console.log(error));
  
  }

getautoComplete()
{ 
  axios({
    method: "get",
    url: process.env.REACT_APP_BACKEND+"/autocomplete/" ,
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


onKeyPressed(e) {
  clearTimeout(this.timeout);
  console.log("hey")
}
onFilterValueChanged =async(ev ) => 
  {
     if (ev.target.value  && this.state.options.length === 0 )
     {
    
      await this.setState({search : true ,query:ev.target.value});

      if(this.timeout) 
      {
        clearTimeout(this.timeout);
      }
    
      this.timeout = setTimeout(() => {
        this.getautoComplete()
        
      },300);   
      console.log(this.state.query)

    }

    

    else  if (ev.target.value && this.state.options.length !== 0)
    {
      await this.setState({search : true ,query:ev.target.value});

      if(this.timeout) 
      {
        clearTimeout(this.timeout);
      }
    
      this.timeout = setTimeout(() => {
        this.getautoComplete()
        
      },300);   
      console.log(this.state.query)

    
   }
 
   
   else  if (!ev.target.value  && this.state.options.length !== 0)
   {
    await this.setState({search : true , query:null});
    this.getautoComplete();
    console.log(  this.state.query)
    console.log(this.state.filteredTableData)
  }
    else if (!ev.target.value && this.state.options.length === 0)
    {

      await this.setState({
        filteredTableData: this.state.candidates ,search : false , query:null    
      });
      console.log(this.state.filteredTableData)
    }


  };

    


  handleChange = async(e) => {
  
 //this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
 const item = e.target.name;
 const isChecked = e.target.checked;

  await this.setState({ checkedItems: this.state.checkedItems.set(item, isChecked) , search:true});
   
  // var mapValues = this.state.checkedItems.values();
  // var mapIKey = this.state.checkedItems.keys();
 

   for (const  [key, value] of  this.state.checkedItems.entries()) {
   
    console.log(this.state.options.indexOf(key));
  if ( this.state.options.indexOf(key)  !== -1)
  {

   if (value ===false)
    {
      var index = this.state.options.indexOf(key); 
      this.state.options.splice(index,1);
    }
  }
  else if ( this.state.options.indexOf(key)  === -1)
  {
    if (value ===true)
    {
      console.log(key)
      this.state.options.push(key);
  
    }
    
  }
}
  console.log(  this.state.options)

  if (this.state.options.length >0 && this.state.query === null )
  {
    this.getautoComplete();
  }
  else if (this.state.options.length === 0 && this.state.query === null)
  {
  await this.setState({
    filteredTableData: this.state.candidates   , search:false  
  });

  }
  else if (this.state.options.length === 0 && this.state.query !== null)
  {
    this.getautoComplete();
  }
  else if (this.state.options.length !== 0 && this.state.query !== null)
  {
    this.getautoComplete();
  }
  


  };
 

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
      <Grid container spacing={1} >
        <Grid item xs={3}>
        <Portlet >
        <PortletHeader>
          <PortletLabel title="Localisation"/>
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
                    onClick={this.handleToggle}  
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
            placeholder="Rechercher par nom , prénom" value={this.state.searchInput}  onKeyUp={this.onFilterValueChanged.bind(this)} onKeyDown={this.onKeyPressed.bind(this)}
          />
        
        </div>
        </Box>
        <FilesTable users={this.state.filteredTableData} />
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
        </Grid>
    
      </Grid>
    
   
      <div>
      {this.state.open ? 
      <Backdrop className={classes.backdrop} open={this.state.open} onClick={this.handleClose}>
        <CircularProgress className={classes.progress} />
       
      </Backdrop>
       : null }
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
