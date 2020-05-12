import React, { Component } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router-dom';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';




// Services
// Externals
import PropTypes, {} from 'prop-types';
// Material helpers
import { withStyles } from '@material-ui/core';
// Material components
import { Grid } from '@material-ui/core';
// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
// Custom components
// Component styles
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(4)
  },

  
});


class ParserParent extends Component {

  constructor(props) {
    super(props);
     this.state = {
       selectedFile: null,
       loaded:0,
       open:false,
       resumes: [],
       sendToNextPage: false,
       show:false,
       openalert:false,
    }
    };


     handleChangeStatus = ({ meta }, status) => {
      console.log(status, meta)
    }
  
     handleSubmit = (files, allFiles) => {

       const formData = new FormData();
     files.map(f =>{
       console.log("testing f"+f)
      formData.append("file", f.file);
      return
     } )
     axios.post(process.env.REACT_APP_BACKEND+"/parsing", formData).then(response=>{
      allFiles.forEach(f => f.remove())
      this.setState({
        show: true,
       })

    
    })}


   handleClickOpenAlert = () => {
    this.setState({
      openalert:true
     })
  };
   handleCloseAlert = () => {
    this.setState({
      openalert:false,
      selectedFile: null,
     })
     window.location.reload();
  };

   renderTime = value => {
    if (value === 0) {
      this.handleClickOpen();
    }
  }
  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files,
     })
  }  
  handleClickOpen = () => {
    this.setState({
      show:false

    })
    axios.get(process.env.REACT_APP_BACKEND+'/parsing/parsed')
    .then((response) => {
      const resumes = response.data.map((resums) => ({
        name : resums.name,
      email: resums.email,
      phone: resums.phone,
      adresse:resums.adresse,
      DateNaissance:resums.DateNaissance,
      age: resums.age,
      experience: resums.experience

      }));
      this.setState({
        resumes
      });
  }).then(response=>{
    this.setState({
      open:true
    })
  });
    }
    handleClose = () => {
      this.setState({
        open:false
  
      })
    }
   handleCloseWithinsert = () => {
    axios.post(process.env.REACT_APP_BACKEND+'/parsing/database')
    .then(res => console.log(res.data));
    axios.get(process.env.REACT_APP_BACKEND+'/getall')
    .then(response => {
        this.setState({ resumes: response.data });
    })
    .catch(function (error){
        console.log(error);
    })
    this.setState({ sendToNextPage: true });  
  }
  handleCloseWithdelete = () => {
    axios.get(process.env.REACT_APP_BACKEND+'/delete/parsed')
    .then(response => {
      document.getElementById('idfile').value = null;
      this.setState({
        selectedFile:  null,

        open:false
      })
    })
    window.location.reload();
  }
  render() {
    const { classes } = this.props;
    console.log(this.state.show)
    return (
      <DashboardLayout title="Parsing">
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

           <div> 
           <Dropzone
      onChangeStatus={this.handleChangeStatus}
      onSubmit={this.handleSubmit}
      maxFiles={10}
      inputContent="Drop  Files"
      inputWithFilesContent={files => `${10 - files.length} more`}
      submitButtonDisabled={files => files.length > 10}
    />
         </div>
          <div> 
          <div>               
          <div>
      
        
           <br></br>
           { this.state.show &&  <CountdownCircleTimer 
      isPlaying
      durationSeconds={2.5}
      colors={[["#FF7F50", 1]]}
      renderTime={this.renderTime}
      onComplete={() => [true, 200]}
    /> }
         {this.state.open}
          </div>
          </div>
          <div>
      <Dialog
      fullWidth={true}
      maxWidth = {'lg'}
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">{"Display parsed resumes"}</DialogTitle>
      <DialogContent>
      <DialogContentText id="alert-dialog-description">
      <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Parsed Resumes</TableCell>
            
            <TableCell align="right">Full name </TableCell>
            <TableCell align="right">First name</TableCell>
            <TableCell align="right">Last name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Adress</TableCell>
            <TableCell align="right">Birth date</TableCell>
            <TableCell align="right">Age</TableCell>
            <TableCell align="right">Experience</TableCell> 
            <TableCell align="right">Delete</TableCell>
         
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.resumes.map(resumes => (
            
            <TableRow key={resumes.name.fullName}>
              <TableCell component="th" scope="row">
                {resumes.name.fullName}
              </TableCell>
           
              <TableCell align="right">{resumes.name.fullName} </TableCell>
              <TableCell align="right">{resumes.name.firstName}</TableCell>
              <TableCell align="right">{resumes.name.lastName}</TableCell>
              <TableCell align="right">{resumes.email}</TableCell>
              <TableCell align="right">{resumes.phone}</TableCell>
              <TableCell align="right">{resumes.adresse}</TableCell>
              <TableCell align="right">{resumes.DateNaissance}</TableCell>
              <TableCell align="right">{resumes.age}</TableCell>
              <TableCell align="right">{resumes.experience}</TableCell>
              <TableCell align="right">   <IconButton aria-label="delete" className={classes.margin} onClick={ console.log(resumes.filename) }>
              <DeleteIcon />
              </IconButton>
              </TableCell>
          
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseWithdelete} color="primary">
           Discard all
          </Button>
          <Button onClick={this.handleCloseWithinsert} color="primary" autoFocus>
           Add to dataset
          </Button>
          {this.state.sendToNextPage &&
          <Redirect to='/datasetparsing' />
        }
        </DialogActions>
      </Dialog>
    </div>
    </div>
    <div>
      <Dialog
        open={this.state.openalert}
        onClose={this.handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert of depassing files limit"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            you can upload max 10 files
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseAlert} color="error" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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

ParserParent.propTypes = {
  classes: PropTypes.object.isRequired
};


 

export default withStyles(styles)(ParserParent);



