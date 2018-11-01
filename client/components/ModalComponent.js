import React from 'react';
import PropTypes from 'prop-types';

const ModalComponent = (props) => {

  return (
    <div id="myModal" className="modal" style={props.displayValue}>
      <div className={`modal-content ${[props.className]}`}>
        <div className="form-group">
          <div className="row">
            <i className="fas fa-times modal-close" onClick={props.onClose} />
            <h1 className="modal-title" htmlFor={props.inputId}>{props.labelValue}</h1>
          </div>
          <div className="modal-input-container">
            <input
              className={props.inputClassName}
              id={props.inputId}
              value={props.stateValue}
              onChange={props.onChangeFunc}
              placeholder={props.placeHolder}
            />
          </div>
        </div>
        <div className="modal-submit-container">
          <button className="modal-submit" onClick={props.onSubmitFunc}>{props.submitText}</button>
        </div>
      </div>
    </div>
  );

};

ModalComponent.propTypes = {
  className: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  displayValue: PropTypes.object.isRequired,
  onSubmitFunc: PropTypes.func,
  placeHolder: PropTypes.string.isRequired,
  inputClassName: PropTypes.string.isRequired,
  onChangeFunc: PropTypes.func.isRequired,
  stateValue: PropTypes.string
};


export default ModalComponent;