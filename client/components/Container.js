import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import ApplicationForm from '../containers/ApplicationForm';
//import AssetForm from '../containers/AssetForm';
//import Login from '../containers/Login';
//import NewForm from '../containers/NewForm';

const ApplicationForm = lazy(() => import('../containers/ApplicationForm'));
const AssetForm = lazy(() => import('../containers/AssetForm'));
const Login = lazy(() => import('../containers/Login'));
const NewForm = lazy(() => import('../containers/NewForm'));

const Container = (props) => {

  return (
    <div className="container-fluid" id="container-fluid">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/application-form" component={ApplicationForm}/>
            <Route exact path="/asset-form" component={AssetForm}/>
            <Route exact path="/" component={Login}/>
            <Route exact path="/new-form" component={NewForm}/>
          </Switch>
        </Suspense>
      </Router>
    </div>
  );

};


export default Container;
