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
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';



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
  }
});


class Datasetparsing extends Component {

  constructor(props) {
    super(props);
    this.state = {resumes: [],
      open:false,
     
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
    
   componentgeteditable(id) {
    axios.get('http://localhost:5000/edit-resume/' +id)
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
        axios.get('http://localhost:5000/getall')
            .then(response => {
                this.setState({ resumes: response.data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    deleteContact (id) {
      axios.delete(`http://localhost:5000/delete/${id}`)
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
              <TableCell align="right">{resumes.phone}</TableCell>
              <TableCell align="right">{resumes.adresse}</TableCell>
              <TableCell align="right">{resumes.DateNaissance}</TableCell>
              <TableCell align="right">{resumes.age}</TableCell>
              <TableCell align="right">   <IconButton aria-label="delete" className={classes.margin} onClick={ () => this.deleteContact(resumes._id) }>
              <DeleteIcon />
              </IconButton>
              <IconButton aria-label="edit" className={classes.margin} onClick={  () => this.componentgeteditable(resumes._id)}>
              <EditIcon />
              </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </TableContainer>
    <div>
      <form> 
    <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Resume</DialogTitle>
        <DialogContent>
        <input type="text" className="form-control" value={this.state.name.fullName} onChange={this.handleChange}/>
            <TextField
            autoFocus
            margin="dense"
            id="Firstname"
            label="First name"
            type="text"
            fullWidth
          />
            <TextField
            autoFocus
            margin="dense"
            id="Lastname"
            label="Last name"
            type="text"
            fullWidth
          />

         <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
          />
            <TextField
            autoFocus
            margin="dense"
            id="phone"
            label="Phone"
            type="text"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="adress"
            label="Adress"
            type="text"
            fullWidth
          />
            <TextField
            autoFocus
            margin="dense"
            id="birthdate"
            label="Birth date"
            type="date"
            fullWidth
          />
             <TextField
            autoFocus
            margin="dense"
            id="age"
            label="Age"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
      </form>
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

Datasetparsing.propTypes = {
  classes: PropTypes.object.isRequired
};


 

export default withStyles(styles)(Datasetparsing);
