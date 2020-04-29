import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography
} from '@material-ui/core';
// Material icons
import {
  DashboardOutlined as DashboardIcon,
  AccountBoxOutlined as AccountBoxIcon,
  SettingsOutlined as SettingsIcon
} from '@material-ui/icons';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import BookIcon from '@material-ui/icons/Book';
import StorageIcon from '@material-ui/icons/Storage';
import ExtensionIcon from '@material-ui/icons/Extension';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


// Component styles
import styles from './styles';


class Sidebar extends Component {
  constructor(props)
  {
    super(props);
    
    const user = JSON.parse(localStorage.getItem('user'));

    this.state = {
      open:false,
      firstName: user.firstName,
      lastName: user.lastName,
      id : user._id,
      selectedImg: null
    }
    this.uploadImg= this.uploadImg.bind(this)
  }
  uploadImg()
  {
    this.setState({
      open:true

    })
  }
  onChangeHandler=async (event)=>{

  
   await this.setState({
      selectedImg: event.target.files[0],
     
    })
  
    if (this.state.selectedImg )
    {   /* const formData = new FormData();
        formData.append('myImage',this.state.selectedImg);
        console.log(formData)*/
      axios.put(process.env.REACT_APP_BACKEND+'/editpicture',{
        Image: this.state.selectedImg.name , id : this.state.id}).then(res => { // then print response status
          console.log(res)
       })
    }
 
  

}
  handleClose = () => {
    this.setState({
      open:false

    })
  }
  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);
    //const user = localStorage.getItem('user');
    const { firstName, lastName } = this.state;

    const user = JSON.parse(localStorage.getItem('user'));
    const imageUrl = user.imageUrl ?? "/images/avatars/avatar_1.png";
    console.log(user.imageUrl)

    return (
   
      <nav className={rootClassName}>
          <div className={classes.logoWrapper}>
          <Link
            className={classes.logoLink}
            to="/"
          >
            <img
              alt="Resumely logo"
              className={classes.logoImage}
              src="/images/logos/resumely-small.png"
            />
          </Link>
          <div>
      <form> 
    <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth = {'xs'} fullWidth={true}  className={classes.dialogCustomizedWidth}>
        <DialogTitle id="customized-dialog-title"  >Change profile picture</DialogTitle>
        <Divider  />
        <DialogContent >
       
          <Button  component="label" color="primary">
          Upload Picture
         <input
          type="file"
         style={{ display: "none" }}
         onChange={this.onChangeHandler}
         />
         </Button>

        </DialogContent>
        <Divider  />
        <DialogContent >
        <Button style={{color: 'red'}} >
        Remove picture
          </Button>
     
        </DialogContent>
        <Divider  />
        <DialogActions  >
          <Button onClick={this.handleClose}  maxWidth = {'md'} fullWidth={true} >
            Cancel
          </Button>
         
        </DialogActions>
     
  
      </Dialog>
      </form>
      </div>

        </div>

      
        <Divider className={classes.logoDivider} />
        <div className={classes.profile}>
          <Link >
            <Avatar
              alt="user"
              className={classes.avatar}
              src={imageUrl}
              onClick={this.uploadImg}
            />
          </Link>
          <Typography
            className={classes.nameText}
            variant="h6"
          >
            {firstName + ' ' + lastName}
          </Typography>
          <Typography
            className={classes.bioText}
            variant="caption"
          >
            {/*Brain Director*/}
          </Typography>
        </div>
        <Divider className={classes.profileDivider} />
        <List
          component="div"
          disablePadding
        >
          
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dashboard"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dashboard"
            />
          </ListItem>
          <ListItem
              activeClassName={classes.activeListItem}
              className={classes.listItem}
              component={NavLink}
              to="/prediction"
            >
              <ListItemIcon className={classes.listItemIcon}>
                <FindReplaceIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Prediction"
              />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/dataset-extension"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <ExtensionIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dataset extension"
            />
          </ListItem>
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/parsing"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Parse resumees"
            />
          </ListItem>
          
          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/data-list"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Dataset"
            />
          </ListItem>

          <ListItem
            activeClassName={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/account"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Account"
            />
          </ListItem>
     
        </List>
        <Divider className={classes.listDivider} />
        <List
          component="div"
          disablePadding
          subheader={
            <ListSubheader className={classes.listSubheader}>
              Application
            </ListSubheader>
          }
        >
        <ListItem
        activeClassName={classes.activeListItem}
        className={classes.listItem}
        component={NavLink}
        to="/settings"
      >
        <ListItemIcon className={classes.listItemIcon}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.listItemText }}
          primary="Settings"
        />
      </ListItem>
        </List>
      </nav>
     
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Sidebar);
