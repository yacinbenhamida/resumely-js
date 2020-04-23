import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
// Component styles
import styles from './styles';

class Sidebar extends Component {
  constructor(props)
  {
    super(props);

    const user = JSON.parse(localStorage.getItem('user'));

    this.state = {
      firstName: user.firstName,
      lastName: user.lastName
    }

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
        </div>
        <Divider className={classes.logoDivider} />
        <div className={classes.profile}>
          <Link to="/account">
            <Avatar
              alt="user"
              className={classes.avatar}
              src={imageUrl}
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
            to="/datasetparsing"
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
