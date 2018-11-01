import React from 'react';
import PropTypes from 'prop-types';

const SelectApplication = (props) => {

  const listOptions = props.appNames.map((app) => 
    <option value ="" key={app}>{app}</option>
  );

  return (
    <div className="row">
      <div className="col-lg-6 col-md-6 col-xs-12 select-app-col">
        <div className="form-group select-application-group">
          <select className="form-control select-application" onChange={(e) => props.appOnClick(e)}>
            <option value="">{props.placeHolder}</option>
            {listOptions}
          </select>
        </div>
      </div>
    </div>
  );

};

SelectApplication.propTypes = {
  appNames: PropTypes.array,
  appOnClick: PropTypes.func,
  placeHolder: PropTypes.string.isRequired
};


export default SelectApplication;