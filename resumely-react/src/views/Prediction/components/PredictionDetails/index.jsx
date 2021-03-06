import React, { Component, Fragment } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Services
import predictionService from 'services/prediction.service';

// Material helpers
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// Material components
import { Avatar, Typography, Button, LinearProgress, TextField } from '@material-ui/core';
import { Grid } from '@material-ui/core';

import { CircularProgress } from '@material-ui/core';

// Shared components
import { Portlet, PortletContent } from 'components';
// Shared components
import { PortletHeader, PortletLabel } from 'components';

// Component styles
import styles from './styles';

class PredictionDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            prediction: '',
            countries: [],
            skills: [],
            showPrediction: false,
            isRating: false,

            ratingFirstName: '',
            ratingLastName: '',
            ratingLabel: '',
        };
    }

    handleChange_RatingFirstName(e) {

        this.setState({
            ratingFirstName: e.target.value
        });
    }

    handleChange_RatingLastName(e) {
        this.setState({
            ratingLastName: e.target.value
        });
    }

    handleChange_RatingLabel(e) {
        this.setState({
            ratingLabel: e.target.value
        });
    }

    // Called by parent Prediction component
    loadPredictionDetails(firstName, lastName, prediction, countries, skills) {
        console.log(countries)
        const targetCountries = countries;

        this.setState({
            firstName: firstName,
            lastName: lastName,
            prediction: prediction,
            countries: targetCountries,
            skills: skills,
            showPrediction: true,
            isRating: false
        });
    }

    showRatePredictionModal() {

        this.setState({
            isRating: true
        });
    }

    handleCloseRating() {
        this.setState({
            isRating: false
        });

    }


    renderCountries() {
        const { classes } = this.props;
        const { loading, countries } = this.state;

        if (loading) {
            return (
                <div className={classes.progressWrapper}>
                    <CircularProgress />
                </div>
            );
        }

        if (countries.length === 0) {
            return (
                <Typography variant="h6">No predicted countries.</Typography>
            );
        }

        return (
            <Fragment>
                {Object
                    .keys(countries)
                    .map((name, i) => (
                        <div className={classes.skill} key={i}>
                            <div className={classes.productDetails}>
                                <div className={classes.progressWrapper}>
                                    <Typography className={classes.productTitle} variant="h6">
                                        {name
                                            .charAt(0)
                                            .toUpperCase() + name.slice(1) + ' - ' + countries[name] * 100 + '%'}
                                    </Typography>
                                    <LinearProgress value={countries[name] * 100} variant="determinate" />
                                </div>
                            </div>
                        </div>
                    ))}
            </Fragment>
        );
    }

    renderSkills() {
        const { classes } = this.props;
        const { loading, skills } = this.state;

        if (loading) {
            return (
                <div className={classes.progressWrapper}>
                    <CircularProgress />
                </div>
            );
        }

        if (skills.length === 0) {
            return (
                <Typography variant="h6">No predicted skills.</Typography>
            );
        }

        return (
            <Fragment>
                {skills.map((skill, i) => (
                    <div className={classes.skill} key={i}>
                        <div className={classes.productDetails}>
                            <div className={classes.progressWrapper}>
                                <Typography className={classes.productTitle} variant="h6">
                                    {skill
                                        .charAt(0)
                                        .toUpperCase() + skill.slice(1)}
                                </Typography>

                            </div>
                        </div>
                    </div>
                ))}
            </Fragment>
        );
    }


    render() {

        function capitalize(name) {
            return name
                .charAt(0)
                .toUpperCase() + name.slice(1);
        }

        const {
            classes,
            className,
            ...rest
        } = this.props;
        const rootClassName = classNames(classes.root, className);

        const countries = this.state.countries;
        const countrySize = Object
            .keys(countries)
            .length;

        const skills = this.state.skills;
        const skillsSize = skills.length;

        if (!this.state.showPrediction)
            return (
                <Typography align="center" variant="h2">Fill in the form to perform the prediction.</Typography>
            )

        return (
            <div>

                <Dialog open={this.state.isRating} onClose={() => this.setState({ isRating: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Prediction Correction</DialogTitle>
                    <form
                        autoComplete="off"
                        // onSubmit={this.handleSubmitRating}
                        className={classes.form}
                    >

                        <DialogContent>
                            <DialogContentText>
                                You can improve the prediction.
                        </DialogContentText>



                            <div className={classes.field} style={{ textAlign: "center" }}>
                                <TextField
                                    className={classes.textField}
                                    label="First Name"
                                    required
                                    margin="dense"
                                    value={this.state.ratingFirstName}
                                    onChange={(e) => {
                                        this.setState({
                                            ratingFirstName: e.target.value
                                        });
                                    }}
                                    variant="outlined"
                                />
                                <br />
                                <TextField
                                    className={classes.textField}
                                    label="Last Name"
                                    required
                                    margin="dense"
                                    value={this.state.ratingLastName}
                                    onChange={(e) => {
                                        this.setState({
                                            ratingLastName: e.target.value
                                        });
                                    }}
                                    variant="outlined"
                                />
                                <br />
                                <TextField
                                    className={classes.textField}
                                    label="Label"
                                    required
                                    margin="dense"
                                    value={this.state.ratingLabel}
                                    onChange={(e) => {
                                        this.setState({
                                            ratingLabel: e.target.value
                                        });
                                    }}
                                    variant="outlined"
                                />
                            </div>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => this.setState({ isRating: false })} color="primary">
                                Cancel
          </Button>
                            <Button
                                onClick={

                                    (event) => {
                                        event.preventDefault();

                                        console.log(event);
                                        console.log(this);

                                        try {
                                            const { data } = predictionService.Correct(this.state.ratingFirstName, this.state.ratingLastName, this.state.ratingLabel);

                                        } catch (error) {
                                            console.error(error);
                                        } finally {
                                        }

                                        event.persist();
                                    }


                                }
                                color="primary">
                                Submit Rating
          </Button>
                        </DialogActions>
                    </form>

                </Dialog>

                <Portlet {...rest} className={rootClassName}>

                    <Button className={classes.uploadButton} onClick={() => this.setState({
                        isRating: true
                    })} color="secondary" variant="text">
                        RATE PREDICTION
                </Button>















                    <br />
                    <br />
                    <div>
                        <Grid container spacing={2}>
                            <Grid item container justify="center" lg={12} sm={12} xl={12} xs={12}>
                                <div className={classes.details}>
                                    <div className={classes.info}>

                                        <Typography variant="h1">{capitalize(this.state.firstName)} {capitalize(this.state.lastName)}</Typography>
                                        <Typography variant="h2">
                                            from {this.state.prediction}
                                        </Typography>
                                    </div>

                                    <Avatar className={classes.avatar} src="/images/avatars/avatar_1.png" />
                                </div>
                            </Grid>
                            <Grid item lg={6} sm={6} xl={6} xs={12}>
                                <PortletContent>
                                    <div className={classes.progressWrapper}>
                                        <LinearProgress value={100} variant="determinate" />
                                    </div>
                                    <Portlet {...rest} className={rootClassName}>
                                        <PortletHeader noDivider>
                                            <PortletLabel
                                                subtitle={`${countrySize} in total`}
                                                title="Countries Confidence" />
                                        </PortletHeader>
                                        <PortletContent className={classes.portletContent}>
                                            {this.renderCountries()}
                                        </PortletContent>

                                    </Portlet>
                                </PortletContent>

                            </Grid>

                            <Grid item lg={6} sm={6} xl={6} xs={12}>
                                <PortletContent>
                                    <div className={classes.progressWrapper}>
                                        <LinearProgress value={100} variant="determinate" />
                                    </div>
                                    <Portlet {...rest} className={rootClassName}>
                                        <PortletHeader noDivider>
                                            <PortletLabel subtitle={`${skillsSize} in total`} title="Predicted Skills" />
                                        </PortletHeader>
                                        <PortletContent className={classes.portletContent}>
                                            {this.renderSkills()}
                                        </PortletContent>

                                    </Portlet>
                                </PortletContent>

                            </Grid>

                        </Grid>
                    </div>

                </Portlet >
            </div>

        );
    }
}

PredictionDetails.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    prediction: PropTypes.string
};

export default withStyles(styles)(PredictionDetails);
