import React from 'react';
import PropTypes from 'prop-types';

const SelectModal = (props) => {

  let listOptions;
  let submitType = props.submitType;
  let newValue = "";

  if ( props.listData !== undefined && Array.isArray(props.listData) && Array.isArray(props.listData[0]) !== true && props.listData.length > 0 ) {
    listOptions = props.listData.map((data) =>
      <option value={data} key={data}>{data}</option>
    );
  } else if ( props.listData !== undefined && props.listData[0] !== undefined ) {
    listOptions = props.listData[0].map((data) =>
      <option value={data} key={data}>{data}</option>
    );
  } else {
    listOptions = [];
  }

  const handleOnChange = (e) => {
    newValue = e.target.value;
    return;
  };

  return (
    <div id="myModal" className="modal" style={props.displayValue}>
      <div className={`modal-content ${[props.className]}`}>
        <div className="form-group">
          <div className="row">
          <i className="fas fa-times modal-close" id={props.closeId} onClick={props.onClose} />
          <h1 className="modal-title" htmlFor={props.selectId}>{props.labelValue}</h1>
          </div>
          <select className="form-control" id={props.selectId} onChange={handleOnChange}>
            <option value="">{props.placeHolder}</option>
            {listOptions}
          </select>
        </div>
        <div className="modal-submit-container">
          <button className="modal-submit" onClick={(e) => props.modalSubmit(e, submitType, newValue)}>{props.submitText}</button>
        </div>
      </div>
    </div>
  );

};

SelectModal.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  displayValue: PropTypes.object.isRequired,
  modalSubmit: PropTypes.func,
  placeHolder: PropTypes.string.isRequired,
  stateValue: PropTypes.string,
  submitType: PropTypes.string,
  submitText: PropTypes.string,
  labelValue: PropTypes.string,
  listData: PropTypes.array
};


export default SelectModal;