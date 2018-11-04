import React from 'react';
import { Route } from 'react-router-dom';
import ApplicationForm from '../containers/ApplicationForm';
import AssetForm from '../containers/AssetForm';
import Login from '../containers/Login';

const Container = (props) => {

  return (
    <div className="container-fluid" id="container-fluid">
      <Route exact path="/application-form" component={ApplicationForm}/>
      <Route exact path="/asset-form" component={AssetForm}/>
      <Route exact path="/" component={Login}/>
    </div>
  );

};


export default Container;
