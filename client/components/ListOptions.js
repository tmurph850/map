import React from 'react';
import PropTypes from 'prop-types';

const ListOptions = (props) => {

  const listArr = props.data.map((item) => 
    <option selected={props.defaultSelected} value={item} key={item}>{item}</option>
  );

  return (
      <select className="form-control list-options" onChange={(e) => props.OnClickHandler(e)}>
        {listArr}
      </select>
  );

};

ListOptions.propTypes = {
  data: PropTypes.array,
  OnClickHandler: PropTypes.func,
  defaultValue: PropTypes.string
};


export default ListOptions;