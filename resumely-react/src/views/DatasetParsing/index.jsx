import React, { Component } from 'react';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Typography } from '@material-ui/core';
import palette from 'theme/palette';
import {
  Status
} from 'components';
import {
  Phone,
} from '@material-ui/icons';


import PropTypes, {} from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(4)
  }
});


class Datasetparsing extends Component {

  constructor(props) {
    super(props);
    this.state = {resumes: [],
      open:false,
      test:true,
      verif:{
       },
       phone:"",
     
      name : {
        firstName: "",
        lastName: "",
        fullName: ""
      },
      email: "",
      phone: "",
      adresse:"",
      DateNaissance:"",
      age: ""
      
    }
  }

  handleChange(event) {
    //const name = event.target.name;
    const value = event.target.value;

    this.setState({
     firstName:value
    })
  }

    handleClose = () => {
      this.setState({
        open:false
  
      })
    }
   
    //'http://apilayer.net/api/validate?access_key=6f058e8d12f78fa6b4840c6ab3235c56&number'=+phone
     handleClickOpen = (number) => {
       console.log('numberrrrrrrr'+number)
       axios.get(`${process.env.REACT_APP_BACKEND}/verif/${number}`)
      .then(res => {
        console.log(res.data)
        this.setState({
          phone:number,
          verif:res.data})})
    .then( this.setState({
        open:true
      }))
   

    };

    
   componentgeteditable(id) {
    axios.get(process.env.REACT_APP_BACKEND+'/edit-resume/' +id)
      .then(res => {
        this.setState({
          resume:res.data,
          name :res.data.name ,
          email: res.data.email,
          phone: res.data.phone,
          adresse:res.data.adresse,
          DateNaissance:res.data.DateNaissance,
          age: res.data.age
    
        });
      }).then(res=>{
        this.setState({
          open:true
    
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }


    componentDidMount() {
        axios.get(process.env.REACT_APP_BACKEND+'/getall')
            .then(response => {
                this.setState({ resumes: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    deleteContact (id) {
      axios.delete(`${process.env.REACT_APP_BACKEND}/delete/${id}`)
      .then(res => {
         this.componentDidMount()
      })

  }



  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dataset of Parsed Resumes">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <TableContainer component={Paper}>
              <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Full name </TableCell>
            <TableCell align="right">First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Adress</TableCell>
            <TableCell align="right">Birth date</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Experience</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.resumes.map(resumes => (
              <TableRow key={resumes.name.fullName}>
              <TableCell align="right">{resumes.name.fullName} </TableCell>
              <TableCell align="right">{resumes.name.firstName}</TableCell>
              <TableCell align="right">{resumes.name.lastName}</TableCell>
              <TableCell align="right">{resumes.email}</TableCell>
              <TableCell align="right">{resumes.phone}
             {!!resumes.phone && <IconButton  onClick={ () => this.handleClickOpen(resumes.phone) }>  <Phone/>
          </IconButton> }
              </TableCell>
             
              <TableCell align="right">{resumes.adresse}</TableCell>
              <TableCell align="right">{resumes.DateNaissance}</TableCell>
              <TableCell align="right">{resumes.age}</TableCell>
              <TableCell align="right">{resumes.experience}</TableCell>
              <TableCell align="right">   <IconButton aria-label="delete" className={classes.margin} onClick={ () => this.deleteContact(resumes._id) }>
              <DeleteIcon />
              </IconButton>
             {/* <IconButton aria-label="edit" className={classes.margin} onClick={  () => this.componentgeteditable(resumes._id)}>
              <EditIcon />
              </IconButton>*/
             }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </TableContainer>
    <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" >   {"Validation of phone number"}&nbsp; <div  style={{ color: palette.warning.main }}>{this.state.phone}</div></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div> 
      <center>  { this.state.verif.valid===true &&
         <Typography 
              className={classes.value}
              style={{ color: palette.success.main}}
              variant="h5"
          
            >
           <Status
          className={classes.status}
          color="success"
          size="sm"
          />   Valid number

          <Typography 
            className={classes.value}
            style={{ color: palette.success }}
            variant="h5"
        
          >
             {this.state.verif.country_code} 
            </Typography>
            <Typography 
            className={classes.value}
            style={{ color: palette.success }}
            variant="h5"
        
          >
           {this.state.verif.country_name}
            </Typography>
            <Typography 
            className={classes.value}
            style={{ color: palette.success }}
            variant="h5"
        
          >
           {this.state.verif.carrier}
            </Typography>
            <Typography 
            className={classes.value}
            style={{ color: palette.success }}
            variant="h5"
          >
           {this.state.verif.location}
            </Typography>
       
            <Typography 
            className={classes.value}
            style={{ color: palette.success }}
            variant="h5"
          >
           {this.state.verif.line_type}
            </Typography>
            </Typography>
        
          } 
           </center> 
            </div>
            <div> 
      <center>   
      { this.state.verif.valid===false &&
         <Typography y={this.state.test}
              className={classes.value}
              style={{ color: palette.danger.main }}
              variant="h5"
          
            >
            <Status
             className={classes.status}
             color="danger"
             size="sm"
             />  Invalid number
             
       
      </Typography> }</center> 
            </div>

          </DialogContentText>
        </DialogContent>
      </Dialog>
      </Grid>
      <Grid
      item
      lg={12}
      md={12}
      xl={12}
      xs={12}
      >
            
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
 }
}

Datasetparsing.propTypes = {
  classes: PropTypes.object.isRequired
};


 

export default withStyles(styles)(Datasetparsing);
