import React, { Component } from 'react';

// Services
import predictionService from 'services/prediction.service';

// Externals
import PropTypes, {} from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { PredictionDetails, PredictionInput } from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class Prediction extends Component {

  constructor(props) {
    super(props);

    this.childPredictionDetails = React.createRef();

    this.state = {
      firstName: '',
      lastName: '',
      prediction: '',
      tabIndex: 0
    };
    
    this.handleChange_FirstName = this.handleChange_FirstName.bind(this);
    this.handleChange_LastName = this.handleChange_LastName.bind(this);
    
    this.handleSubmit_Prediction = this.handleSubmit_Prediction.bind(this);
  }

  handleChange_FirstName(event) {
    this.setState({
        firstName: event.target.value
    });
  }

  handleChange_LastName(event) {
    this.setState({
        lastName: event.target.value,
    });
  }

  async handleSubmit_Prediction(event) {
    event.preventDefault();
    
    this.setState({
        prediction: 'Loading...',
    });

    try {
        const { data } = await predictionService.Predict(this.state.firstName, this.state.lastName);
        this.setState({
            prediction: data.Prediction,
        });

        this.childPredictionDetails.current.loadPredictionDetails(
          this.state.firstName, 
          this.state.lastName,
          this.state.prediction
          );

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

    return (
      <DashboardLayout title="Prediction">
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
              <PredictionInput 
                firstName = {this.state.firstName}
                lastName = {this.state.lastName}
                handleChange_FirstName = {this.handleChange_FirstName}
                handleChange_LastName = {this.handleChange_LastName}
                handleSubmit_Prediction = {this.handleSubmit_Prediction}
              />
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >
              <PredictionDetails
                ref = {this.childPredictionDetails}
              />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Prediction.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Prediction);
