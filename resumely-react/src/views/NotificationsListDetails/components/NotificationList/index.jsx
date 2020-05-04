import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';

// Material icons
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  Payment as PaymentIcon,
  PeopleOutlined as PeopleIcon,
  Code as CodeIcon,
  Store as StoreIcon
} from '@material-ui/icons';

// Component styles
import styles from './styles';

const icons = {
  other: {
    icon: <PaymentIcon />,
    color: 'blue'
  },
  scrapping: {
    icon: <PeopleIcon />,
    color: 'red'
  },
  account: {
    icon: <StoreIcon />,
    color: 'green'
  },
  files: {
    icon: <CodeIcon />,
    color: 'purple'
  }
};

class NotificationList extends Component {
  notificationTarget = (notification) => {
    if(notification === ("scrapping" || "files") ) return "/dataset-extension"
    if(notification === "account") return "/Account"
    else return "/Dashboard"
  }
  render() {
    const { className, classes, notifications, onSelect } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        {notifications.length > 0 ? (
          <Fragment>
            <div className={classes.header}>
              <Typography variant="h6">User Notifications</Typography>
              <Typography
                className={classes.subtitle}
                variant="body2"
              >
                {notifications.length} new notifications
              </Typography>
            </div>
            <div className={classes.content}>
              <List component="div">
                {notifications.map(notification => (
                  <Link
                    key={notification._id}
                    to={this.notificationTarget(notification.type)}
                  >
                    <ListItem
                      className={classes.listItem}
                      component="div"
                      onClick={onSelect}
                    >
                      <ListItemIcon
                        className={classes.listItemIcon}
                        style={{ color: icons[notification.type].color }}
                      >
                        {icons[notification.type].icon}
                      </ListItemIcon>
                      <ListItemText
                        classes={{ secondary: classes.listItemTextSecondary }}
                        primary={notification.content}
                        secondary={moment(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                      />
                      <ArrowForwardIosIcon className={classes.arrowForward} />
                    </ListItem>
                    <Divider />
                  </Link>
                ))}
              </List>
            </div>
          </Fragment>
        ) : (
          <div className={classes.empty}>
            <div className={classes.emptyImageWrapper}>
              <img
                alt="Empty list"
                className={classes.emptyImage}
                src="/images/empty.png"
              />
            </div>
            <Typography variant="h4">There's nothing here...</Typography>
          </div>
        )}
      </div>
    );
  }
}

NotificationList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

NotificationList.defaultProps = {
  notifications: [],
  onSelect: () => {}
};

export default withStyles(styles)(NotificationList);
