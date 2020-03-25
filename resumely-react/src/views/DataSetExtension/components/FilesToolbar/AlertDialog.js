import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

import  { Component } from 'react'

export default class AlertDialog extends Component {
    constructor(props){
        super(props);
        this.state = {
            open : false
        }
    }
    handleClose = () => {
        this.setState({open : false})
        this.props.handleConfirmDelete("no")
    }
    handleConfirm = () => {
        this.props.handleConfirmDelete("ok")
    }
    render() {
        return (
            <div>
            <Dialog
              open={this.props.open}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {this.props.text}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  {this.props.close}
                </Button>
                <Button onClick={this.handleConfirm} color="primary" autoFocus>
                  {this.props.validate}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )
    }

}
AlertDialog.prototypes = {
    open : PropTypes.bool,
    text : PropTypes.string,
    close : PropTypes.string,
    validate : PropTypes.string,
    title : PropTypes.string,
    handleConfirmDelete: PropTypes.func
}
