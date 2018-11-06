import React from 'react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid';

const ListOptions = (props) => {

  if ( Array.isArray(props.data) && props.data.length > 0 ) {
    let listArr = [];

    /*if ( props.type && props.type === "chassisSlot" ) {
      listArr.push(<option value="Not Assigned" key={uuidv1()}>Not Assigned</option>)
    }*/

    props.data.forEach(item => {
      if ( item === props.defaultSelected ) {
       listArr.push(<option selected value={item} key={uuidv1()}>{item}</option>);
      } else if ( props.defaultSelected === "" && props.type && props.type === "chassisSlot") {
        listArr.push(<option value="Not Assigned" key={uuidv1()}>Not Assigned</option>);
      } else {
        listArr.push(<option value={item} key={uuidv1()}>{item}</option>);
      }
    });
    
    /*const listArr = props.data.map((item) => 
      <option selected={props.defaultSelected} value={item} key={uuidv1()}>{item}</option>
    );*/

    return (
      <select className="form-control list-options" onChange={(e) => props.OnClickHandler(e)}>
        {listArr}
      </select>
    );
  }

  if ( Array.isArray(props.data) && props.data.length === 0 ) {
    return (
      <select className="form-control list-options" onChange={(e) => props.OnClickHandler(e)}>
        <option value="No Data">No Data</option>
      </select>
    );
  }

  return (
    <select className="form-control list-options" onChange={(e) => props.OnClickHandler(e)}>
      <option value="No Data">Something Went Wrong</option>
    </select>
  );
  

};

ListOptions.propTypes = {
  data: PropTypes.array,
  OnClickHandler: PropTypes.func,
  defaultValue: PropTypes.string
};


export default ListOptions;