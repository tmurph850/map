import React from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid';

const SelectApplication = (props) => {
  let arr = [];
  let selectFieldId = uuidv1();
  props.appNames.forEach((app) => {
    let uuidStr = uuidv1();
    arr.push(<option value={app} id={uuidStr} key={uuidStr}>{app}</option>);
  });

  return (
    <div className="row">
      <div className="col-lg-6 col-md-6 col-xs-12 select-app-col">
        <div className="form-group select-application-group">
          <select className="form-control select-application" id={selectFieldId} onChange={props.appOnClick}>
            <option value="">{props.placeHolder}</option>
            {arr}
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