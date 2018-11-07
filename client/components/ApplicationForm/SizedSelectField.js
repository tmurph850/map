import React from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid';

const SizedSelectField = (props) => {

  let listOptions;

  if ( props.listData && Array.isArray(props.listData) && props.listData[0] !== undefined && Array.isArray(props.listData[0]) ) {
    listOptions = props.listData[0].map((app) =>
      <option value ={app} key={uuidv1()}>{app}</option>
    );
  } else if ( props.listData && Array.isArray(props.listData) && props.listData[0] !== undefined && Array.isArray(props.listData[0]) !== true ) {
      listOptions = props.listData.map((app) =>
        <option value ={app} key={uuidv1()}>{app}</option>
      );
  } else {
    listOptions = [];
  }
  

  return (
    <div className="sized-group">
      <label className="app-data-label" htmlFor={props.selectID}>{props.labelText}</label>
      <select className={`${props.dynamicClass}`} id={props.selectID} size={props.selectSize} onClick={(e) => props.openOnClick(e)}>
        {listOptions}
      </select>
    </div>
  );

};

SizedSelectField.propTypes = {
  dynamicClass: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  selectID: PropTypes.string.isRequired,
  selectSize: PropTypes.string.isRequired,
  listData: PropTypes.array.isRequired,
  openOnClick: PropTypes.func
};


export default SizedSelectField;