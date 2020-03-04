import React from 'react'
import predictionService from '../services/prediction.service';

class Prediction extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            prediction: ''
        };

        this.handleChange_FirstName = this.handleChange_FirstName.bind(this);
        this.handleChange_LastName = this.handleChange_LastName.bind(this);
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange_FirstName(event) {
        this.setState({
            firstName: event.target.value
        });
    }

    handleChange_LastName(event) {
        this.setState({
            lastName: event.target.value
        });
    }

    async handleSubmit(event) {
        // alert('Le nom a été soumis : ' + this.state.firstName + ' ' + this.state.lastName);
        
        try {
            const { data } = await predictionService.Predict(this.state.firstName, this.state.lastName);
            this.setState({
                prediction: data.Prediction
            });
        } catch (error) {
            this.setState({
                prediction: '????'
            });
            console.error(error);
        }

        event.persist();
    }

    render() {
        let predOutput = <h6> Fill in first and last names. </h6>

        if(this.state.firstName.length > 0 && this.state.lastName.length > 0)
            predOutput = <h4> Predicted Country: {this.state.prediction} </h4>

        return (
            <div>
                <label>
                First name:
                <input type="text" value={this.state.firstName} onChange={this.handleChange_FirstName} />
                <br/>
                Last name:
                <input type="text" value={this.state.lastName} onChange={this.handleChange_LastName} />
                <br/>
                </label>
                <input type="button" onClick={this.handleSubmit} value="Predict" />
                {predOutput}
            </div>
        );
    }

}

export default Prediction
