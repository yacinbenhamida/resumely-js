import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from 'components/PrivateRoute';


// Views
import Dashboard from './views/Dashboard';
import ProductList from './views/ProductList';
import DataSetList from './views/DataSetList';
import DataSetExtension from './views/DataSetExtension';
import Typography from './views/Typography';
import Icons from './views/Icons';
import Account from './views/Account';
import Settings from './views/Settings';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Prediction from './views/Prediction'
import Parsing from './views/Parsing'
import DatasetParsing from './views/DatasetParsing'
import UnderDevelopment from './views/UnderDevelopment';
import NotFound from './views/NotFound';
import ResetPassword from 'views/ResetPassword';
import redirectResetPassword from 'views/ResetPassword/redirect-reset-password';



export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect
          exact
          from="/"
          to="/dashboard"
        />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <Route
        component={Prediction}
        exact
        path="/prediction"
        />
           <Route
        component={Parsing}
        exact
        path="/Parsing"
        />

        <Route
        component={DatasetParsing}
        exact
        path="/datasetparsing"
        />   
 

       
        
        <Route
          component={DataSetList}
          exact
          path="/data-list"
        />
        <Route
          component={DataSetExtension}
          exact
          path="/dataset-extension"
        />
        <Route
          component={ProductList}
          exact
          path="/products"
        />
        <Route
          component={Typography}
          exact
          path="/typography"
        />
        <Route
          component={Icons}
          exact
          path="/icons"
        />
        <Route
          component={Account}
          exact
          path="/account"
        />
        <Route
          component={Settings}
          exact
          path="/settings"
        />
        <Route
          component={SignUp}
          exact
          path="/sign-up"
        />
        <Route
          component={SignIn}
          exact
          path="/sign-in"
        />
        <Route
          component={ResetPassword}
          exact
          path="/reset-password"
        />
        <Route
          component={redirectResetPassword}
          exact
          path="/reset/:token"
        />
        <Route
          component={UnderDevelopment}
          exact
          path="/under-development"
        />
        <Route
          component={NotFound}
          exact
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}
