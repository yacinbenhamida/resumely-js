import React, {Component, Fragment} from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import {withStyles} from '@material-ui/core';

// Material components
import {Avatar, Typography, Button, LinearProgress} from '@material-ui/core';
import {Grid} from '@material-ui/core';

import {CircularProgress} from '@material-ui/core';

// Material icons
import {ArrowRight as ArrowRightIcon} from '@material-ui/icons';

// Shared components
import {Portlet, PortletContent, PortletFooter} from 'components';
// Shared components
import {PortletHeader, PortletLabel} from 'components';

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
            showPrediction: false
        };
    }

    // Called by parent Prediction component
    loadPredictionDetails(firstName, lastName, prediction, countries, skills) {
        const targetCountries = countries.sort(e => e.score);
        this.setState({
            firstName: firstName,
            lastName: lastName,
            prediction: prediction,
            countries: countries,
            skills: skills,
            showPrediction: true
        });
    }

    renderCountries() {
        const {classes} = this.props;
        const {loading, countries} = this.state;

        if (loading) {
            return (
                <div className={classes.progressWrapper}>
                    <CircularProgress/>
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
                                    <LinearProgress value={countries[name] * 100} variant="determinate"/>
                                </div>
                            </div>
                        </div>
                    ))}
            </Fragment>
        );
    }

    renderSkills() {
        const {classes} = this.props;
        const {loading, skills} = this.state;

        if (loading) {
            return (
                <div className={classes.progressWrapper}>
                    <CircularProgress/>
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
            <Portlet {...rest} className={rootClassName}>
                <br/>
                <br/>
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

                                <Avatar className={classes.avatar} src="/images/avatars/avatar_1.png"/>
                            </div>
                        </Grid>
                        <Grid item lg={6} sm={6} xl={6} xs={12}>
                            <PortletContent>
                                <div className={classes.progressWrapper}>
                                    <LinearProgress value={100} variant="determinate"/>
                                </div>
                                <Portlet {...rest} className={rootClassName}>
                                    <PortletHeader noDivider>
                                        <PortletLabel
                                            subtitle={`${countrySize} in total`}
                                            title="Countries Confidence"/>
                                    </PortletHeader>
                                    <PortletContent className={classes.portletContent}>
                                        {this.renderCountries()}
                                    </PortletContent>
                                    <PortletFooter className={classes.portletFooter}>
                                        <Button color="primary" size="small" variant="text">
                                            Rate Prediction
                                            <ArrowRightIcon/>
                                        </Button>
                                    </PortletFooter>
                                </Portlet>
                            </PortletContent>

                        </Grid>

                        <Grid item lg={6} sm={6} xl={6} xs={12}>
                            <PortletContent>
                                <div className={classes.progressWrapper}>
                                    <LinearProgress value={100} variant="determinate"/>
                                </div>
                                <Portlet {...rest} className={rootClassName}>
                                    <PortletHeader noDivider>
                                        <PortletLabel subtitle={`${skillsSize} in total`} title="Predicted Skills"/>
                                    </PortletHeader>
                                    <PortletContent className={classes.portletContent}>
                                        {this.renderSkills()}
                                    </PortletContent>
                                    <PortletFooter className={classes.portletFooter}>
                                        <Button color="primary" size="small" variant="text">
                                            Rate Prediction
                                            <ArrowRightIcon/>
                                        </Button>
                                    </PortletFooter>
                                </Portlet>
                            </PortletContent>

                        </Grid>

                    </Grid>
                </div>

                <PortletFooter>
                    <Button className={classes.uploadButton} color="primary" variant="text">
                        RATE PREDICTION
                    </Button>
                </PortletFooter>
            </Portlet >
        );
    }
}

PredictionDetails.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    prediction: PropTypes.string
};

export default withStyles(styles)(PredictionDetails);
