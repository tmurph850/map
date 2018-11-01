import React from 'react';
import { Route } from 'react-router-dom';
import ApplicationForm from '../containers/ApplicationForm';
import AssetForm from '../containers/AssetForm';

const Container = (props) => {

  return (
    <div className="container-fluid" id="container-fluid">
      <Route exact path="/" component={ApplicationForm}/>
      <Route exact path="/asset-form" component={AssetForm}/>
    </div>
  );

};


export default Container;
