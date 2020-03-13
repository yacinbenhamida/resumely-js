import React from 'react'
import predictionService from '../services/prediction.service';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  });

class Prediction extends React.Component {

     Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://material-ui.com/">
                    Your Website
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            prediction: '',
            showPrediction: false
        };

        this.handleChange_FirstName = this.handleChange_FirstName.bind(this);
        this.handleChange_LastName = this.handleChange_LastName.bind(this);
        
        this.handleSubmit_Prediction = this.handleSubmit_Prediction.bind(this);
    }

    handleChange_FirstName(event) {
        this.setState({
            firstName: event.target.value,
            showPrediction: false
        });
    }

    handleChange_LastName(event) {
        this.setState({
            lastName: event.target.value,
            showPrediction: false
        });
    }

    async handleSubmit_Prediction(event) {
        event.preventDefault();

        if (this.state.showPrediction) 
        {
            event.persist();
            return;
        }

        this.setState({
            showPrediction: true,
            prediction: 'Loading...',
        });

        try {
            const { data } = await predictionService.Predict(this.state.firstName, this.state.lastName);
            this.setState({
                prediction: data.Prediction,
            });
        } catch (error) {
            this.setState({
                prediction: 'Unrecognized.',
            });
            console.error(error);
        } finally {
  
        }

        event.persist();
    }

    render() {
        const { classes } = this.props;

        let predictionContent = this.state.showPrediction ?
        <div> <h2> Predicted Country: </h2> <h1> {this.state.prediction} </h1> </div> 
            :
        <h2> Country Prediction </h2>
        
        let predictionSkull = 
            <div>
                {predictionContent}
            </div>

        return (
            <Grid container className={classes.root}>
                <Grid item xs={7}>
                    <Container component="main" >
                    <div className={classes.paper}>
                        <form onSubmit={this.handleSubmit_Prediction} className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First name"
                            name="firstName"
                            autoComplete="firstName"
                            autoFocus
                            value={this.state.firstName}
                            onChange={this.handleChange_FirstName}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last name"
                            name="lastName"
                            autoComplete="lastName"
                            value={this.state.lastName}
                            onChange={this.handleChange_LastName}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onSubmit={this.props.handleSubmit}
                            className={classes.submit}
                        >
                            Predict
                        </Button>
                        </form>
                    </div>
                    <Box mt={8}>
                    </Box>
                </Container>
                </Grid>
                <Grid item xs={5}>
                    <Container component="main">
                        <div className={classes.paper}>
                            {predictionSkull}
                        </div>
                    </Container>
                </Grid>
            </Grid>
        );
    }

}

export default withStyles(useStyles)(Prediction)
