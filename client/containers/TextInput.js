import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAsset } from '../actions/updateAsset';

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ""
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  componentWillMount() {
    // set data to value from currentAsset
    if ( this.props.assetData.length > 0 ) {
      let len = this.props.assetData.length - 1;
      this.setState({
        data: this.props.assetData[len][0][this.props.htmlID],
        originalState: this.props.assetData[len][0][this.props.htmlID]
      });
    }
  }

  handleOnChange(e) {
    // update state
    this.setState({
      data: e.target.value
    });
  }

  handleOnBlur(e) {
    // fire action and update the asset
    let propName = this.props.htmlID;
    let assetState = {};
    assetState[propName] = this.state.data;

    if ( this.state.data !== this.state.originalState ) {
      this.props.updateAsset(assetState);
    } else {
      return;
    }
    
  }

  render() {
    return (
      <div>
        <input
          className={this.props.htmlClassName}
          id={this.props.htmlID}
          value={this.state.data}
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
        />
      </div>
    );
  }

}

TextInput.propTypes = {
  assetData: PropTypes.array,
  updatedAsset: PropTypes.array,
  updateAsset: PropTypes.func,
  htmlClassName: PropTypes.string,
  htmlID: PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    assetData: state.assetData,
    updatedAsset: state.updatedAsset
  };
};
  
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateAsset
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
