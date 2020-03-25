import React, { Component } from 'react'

export default class Modal extends Component {
    state = {
        modal : false
    }
    toggleComponent(){
        this.setState({
            modal : !this.state.modal
        })
    }
    render() {
        return (
            <div>
                Modal
            </div>
        )
    }
}
