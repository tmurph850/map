import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }

  componentWillMount() {
    // set data to value from currentAsset
    this.setState({
      data: this.props.assetData[name]
    });
  }

  handleOnChange() {
    // update state
  }

  handleOnBlur() {
    // fire action and update the asset
  }

  render() {

  }

}

TextInput.propTypes = {
  assetData: PropTypes.array,
  updatedAsset: PropTypes.object,
  updateAsset: PropTypes.func
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
