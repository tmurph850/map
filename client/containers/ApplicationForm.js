import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import { getData } from '../actions/getData';
import { postData } from '../actions/postData';
import SelectApplication from '../components/ApplicationForm/SelectApplication';
import SizedSelectField from '../components/ApplicationForm/SizedSelectField';
import ModalComponent from '../components/ModalComponent';
import SelectModal from '../components/SelectModal';

class ApplicationForm extends Component {
  constructor(props) {
    super(props);
        
    this.state = {
      appNames: [],
      applicationSelected: false,
      currentApp: {},
      appOriginalState: {},
      currentAssets: [],
      currentDependencies: [],
      assetModalDisplay: "none",
      dependencyModalDisplay: "none",
      newDependency: "",
      newAsset: "",
      assetUpdates: [],
      dependencyUpdates: [],
      requestNumber: 0,
      showLoading: false,
      postedFormData: false,
      postedAssetOrDep: false,
      previouslySubmitted: false,
      userAuthCurrent: this.props.userAuth.length - 1,
      sessionAuth: sessionStorage.getItem('isUserAuth')
    };

    this.appOnClick = this.appOnClick.bind(this);
    this.openOnClick = this.openOnClick.bind(this);
    this.dynamicOnChange = this.dynamicOnChange.bind(this);
    this.pContactOnChange = this.pContactOnChange.bind(this);
    this.sContactOnChange = this.sContactOnChange.bind(this);
    this.businessOnChange = this.businessOnChange.bind(this);
    this.smeOnChange = this.smeOnChange.bind(this);
    this.descOnChange = this.descOnChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.openDependencyModal = this.openDependencyModal.bind(this);
    this.openAssetModal = this.openAssetModal.bind(this);
    this.closeAssetModal = this.closeAssetModal.bind(this);
    this.closeDependencyModal = this.closeDependencyModal.bind(this);
    this.dependencyOnChange = this.dependencyOnChange.bind(this);
    this.assetOnChange = this.assetOnChange.bind(this);
    this.addDependency = this.addDependency.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.modalSubmit = this.modalSubmit.bind(this);
    this.removeDependency = this.removeDependency.bind(this);
    this.removeAsset = this.removeAsset.bind(this);
  }

  componentDidMount() {
    this.props.getData("get_app_names");
    this.props.getData("get_asset_names_types");
  }
    
  componentDidUpdate(prevProps, prevState) {
    if ( prevProps.allApplicationNames.length !== this.props.allApplicationNames.length ) {
      this.setAppNames();
    }

    if ( prevProps.assetNamesAndTypes.length !== this.props.assetNamesAndTypes.length ) {
      this.setAssetNames();
    }

    if ( prevProps.applicationData.length !== this.props.applicationData.length ) {
      this.setCurrentApp();
    }

    if ( prevProps.currentAssets.length !== this.props.currentAssets.length ) {
      this.setAssets();
    }

    if ( prevProps.currentDependencies.length !== this.props.currentDependencies.length ) {
      this.setDependencies();
    }

    if ( prevProps.appFormResponse.length !== this.props.appFormResponse.length ) {
      this.checkForSuccess("form");
    }

    if ( prevProps.assetOrDepResponse.length !== this.props.assetOrDepResponse.length ) {
      this.checkForSuccess("assetOrDep");
    }

  }

  checkForSuccess(checkType) {
    if ( checkType === "assetOrDep" ) {
      let len = this.props.assetOrDepResponse.length;
      let current = this.props.assetOrDepResponse[len - 1];
      if ( this.state.postedAssetOrDep === true && this.state.postedFormData === true ) {
        if ( current.success === true && current.requestNumber === this.state.requestNumber ) {
          this.setState({
            postedAssetOrDep: false
          });
        }
      }
      if ( this.state.postedAssetOrDep === true && this.state.postedFormData === false ) {
        if ( current.success === true && current.requestNumber === this.state.requestNumber ) {
          let obj = Object.assign({}, this.state.currentApp);
          this.setState({
            postedAssetOrDep: false,
            showLoading: false,
            appOriginalState: obj
          });
          alert("Form updated!");
        }
      }
    }

    if ( checkType === "form" ) {
      let len = this.props.appFormResponse.length;
      let current = this.props.appFormResponse[len - 1];
      if ( this.state.postedFormData === true && this.state.postedAssetOrDep === true ) {
        if ( current.success === true && current.requestNumber === this.state.requestNumber ) {
          this.setState({
            postedFormData: false
          });
        }
      }
      if ( this.state.postedFormData === true && this.state.postedAssetOrDep === false ) {
        if ( current.success === true && current.requestNumber === this.state.requestNumber ) {
          let obj = Object.assign({}, this.state.currentApp);
          this.setState({
            postedFormData: false,
            showLoading: false,
            appOriginalState: obj
          });
          alert("Form updated!");
        }
      }
    }

  }

  setAppNames() {
    this.setState({
      appNames: this.props.allApplicationNames[0]
    });
  }

  setAssetNames(){
    let len = this.props.assetNamesAndTypes.length - 1;
    let currentData = this.props.assetNamesAndTypes[len][0].data;
    let assetNames = [];
    currentData.forEach(asset => {
      assetNames.push(asset.asset_name);
    });
    this.setState({
      assetNames
    });
  }

  setCurrentApp() {
    let dataLength = this.props.applicationData.length - 1;
    let currentApplication =  this.props.applicationData[dataLength][0];
    this.setState({
      currentApp: currentApplication,
      applicationSelected: true
    }, this.getAssets);
  }

  setAppOriginalState() {
    let obj = Object.assign({}, this.state.currentApp);
    this.setState({
      appOriginalState: obj
    });
  }

  getAssets() {
    let appId = this.state.currentApp.application;
    this.props.postData(appId ,"get_current_assets");
    this.setState({
      getDepends: "true"
    }, this.getDependencies);
  }

  getDependencies() {
    let appId = this.state.currentApp.application;
    this.props.postData(appId, "get_current_dependencies");
  }

  setAssets() {
    let dataLength = this.props.applicationData.length - 1;
    let currentAssets = this.props.currentAssets[dataLength];
    let assetNames = [];

    for (const prop in currentAssets) {
      assetNames.push(currentAssets[prop].asset_name);
    }
   
    this.setState({
      currentAssets: assetNames
    });
  }

  setDependencies() {
    let dataLength = this.props.applicationData.length - 1;
    let currentDependencies = this.props.currentDependencies[dataLength];
    let dependencyNames = [];

    for (const prop in currentDependencies) {
      dependencyNames.push(currentDependencies[prop].dependency_name);
    }
   
    this.setState({
      currentDependencies: dependencyNames
    }, this.setAppOriginalState);
  }

  appOnClick(e) {
    let appName = e.target.selectedOptions[0].innerText;
    if ( appName !== "Select an Application" ) {
      this.props.postData(appName, "get_application_data");
    } else {
      this.setState({
        applicationSelected: false
      });
    }
    
  }

  openOnClick(e) {
    console.log(e.target);
  }

  dynamicOnChange(e) {
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.application_environment = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  sContactOnChange(e) {
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.secondary_contact = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  descOnChange(e) {
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.application_description = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  pContactOnChange(e) {
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.primary_contact = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  businessOnChange(e) {
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.application_business = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  smeOnChange(e) {
    console.log(e.target);
    let theCurrentApp = this.state.currentApp;
    theCurrentApp.application_sme = e.target.value;
    this.setState({
      currentApp: theCurrentApp
    });
  }

  compareState() {
    let currentState = this.state.currentApp;
    let appOriginalState = this.state.appOriginalState;
    let changes = {
      numberOfFields: 0
    };

    for (const prop in currentState) {
      if ( currentState[prop] !== appOriginalState[prop] ) {
        changes[prop] = currentState[prop];
        changes.numberOfFields = changes.numberOfFields + 1;
      }
    }

    return changes;
  }

  submitForm() {
    let updateObj = this.compareState();
    let assetUpdates = this.state.assetUpdates;
    let dependencyUpdates = this.state.dependencyUpdates;
    let appId = this.state.currentApp.application;
    let requestNum = this.state.requestNumber + 1;
    let postedFormData = false;
    let postedAssetOrDep = false;

    let assetObj = {
      dataType: "asset",
      newData: assetUpdates
    };

    let dependencyObj = {
      dataType: "dependency",
      newData: dependencyUpdates
    };

    if ( assetUpdates.length !== 0 && dependencyUpdates.length !== 0 ) {
      this.props.postData([appId, assetObj, dependencyObj, requestNum], "post_asset_or_dep");
      postedAssetOrDep = true;
    } else if ( assetUpdates.length !== 0 && dependencyUpdates.length === 0 ) {
      this.props.postData([appId, assetObj, null, requestNum], "post_asset_or_dep");
      postedAssetOrDep = true;
    } else if ( assetUpdates.length === 0 && dependencyUpdates.length !== 0 ) {
      this.props.postData([appId, null, dependencyObj, requestNum], "post_asset_or_dep");
      postedAssetOrDep = true;
    } else {
      if ( updateObj.numberOfFields === 0 && assetUpdates.length === 0 && dependencyUpdates.length === 0 ) {
        alert("No changes!");
      }
    }

    if ( updateObj.numberOfFields !== 0 ) {
      let formData = updateObj;
      delete formData.numberOfFields;
      formData.appId = this.state.currentApp.application;
      formData.appName = this.state.currentApp.application_name;
      formData.requestNumber = requestNum;
      this.props.postData(formData, "post_app_form");
      postedFormData = true;
    }

    if ( postedFormData === true && postedAssetOrDep === true ) {
      this.setState({
        showLoading: true,
        requestNumber: this.state.requestNumber + 1,
        postedFormData: postedFormData,
        postedAssetOrDep: postedAssetOrDep,
        updateObj: {},
        assetUpdates: [],
        dependencyUpdates: []
      });
    }

    if ( postedFormData === true && postedAssetOrDep === false ) {
      this.setState({
        showLoading: true,
        requestNumber: this.state.requestNumber + 1,
        postedFormData: postedFormData,
        assetUpdates: [],
        dependencyUpdates: [],
        updateObj: {}
      });
    }

    if ( postedFormData === false && postedAssetOrDep === true ) {
      this.setState({
        showLoading: true,
        requestNumber: this.state.requestNumber + 1,
        postedAssetOrDep: postedAssetOrDep,
        assetUpdates: [],
        dependencyUpdates: []
      });
    }

  }

  openAssetModal() {
    this.setState({
      assetModalDisplay: "block"
    });
  }

  openDependencyModal() {
    this.setState({
      dependencyModalDisplay: "block"
    });
  }

  addDependency() {
    let currentApp = Object.assign({}, this.state.currentApp);
    let depUpdates = this.state.dependencyUpdates;
    currentApp.application_dependencies.push(this.state.newDependency);
    depUpdates.push(this.state.newDependency);

    this.setState({
      currentApp,
      dependencyUpdates: depUpdates,
      newDependency: "",
      dependencyModalDisplay: "none"
    });

  }

  addAsset() {
    let currentApp = Object.assign({}, this.state.currentApp);
    let assetUpdates = this.state.assetUpdates;
    if ( currentApp.asset_list === null ) {
      currentApp.asset_list = [];
    }
    currentApp.asset_list.push(this.state.newAsset);
    assetUpdates.push(this.state.newAsset);

    this.setState({
      currentApp: currentApp,
      assetUpdates: assetUpdates,
      newAsset: "",
      assetModalDisplay: "none"
    });
  }

  closeAssetModal() {
    this.setState({
      assetModalDisplay: "none"
    });
  }

  closeDependencyModal() {
    this.setState({
      dependencyModalDisplay: "none"
    });
  }

  dependencyOnChange(e) {
    this.setState({
      newDependency: e.target.value
    });
  }

  assetOnChange(e) {
    this.setState({
      newAsset: e.target.value
    });
  }

  modalSubmit(e, type, newValue) {
    let prop;
    let currentApp = this.state.currentApp;

    if ( type === "assetList" ) {
      prop = "asset_list";
    }

    if ( type === "appDependencies" ) {
      prop = "application_dependencies";
    }

    if ( currentApp[prop] === null ) {
      currentApp[prop] = [];
    }

    let oldArr = currentApp[prop];
    let newArr = [...oldArr, newValue];

    if ( newValue !== undefined && newValue !== null && newValue !== "" && type === "assetList" ) {
      currentApp[prop] = newArr;
      this.setState({
        currentApp,
        assetModalDisplay: "none"
      });
    } else {
      currentApp[prop] = newArr;
      this.setState({
        currentApp,
        dependencyModalDisplay: "none"
      });
    }

    return;

  }

  removeAsset(e) {
    let currentApp = Object.assign({}, this.state.currentApp);
    let oldArr = currentApp.asset_list;
    let target = document.getElementById("select-asset-list");
    if ( target.selectedIndex === -1 ) {
      return;
    }
    let selected = target.options[target.selectedIndex].innerHTML;
    let targetIndex = oldArr.indexOf(selected);
    oldArr.splice(targetIndex, 1);

    currentApp.asset_list = oldArr;

    this.setState({
      currentApp
    });
  }

  removeDependency(e) {
    let currentApp = Object.assign({}, this.state.currentApp);
    let oldArr = currentApp.application_dependencies;
    let target = document.getElementById("select-dependencies");
    if ( target.selectedIndex === -1 ) {
      return;
    }
    let selected = target.options[target.selectedIndex].innerHTML;
    let targetIndex = oldArr.indexOf(selected);
    oldArr.splice(targetIndex, 1);

    currentApp.application_dependencies = oldArr;

    this.setState({
      currentApp
    });
  }

  render() {
    if ( this.state.sessionAuth === "true" || this.props.userAuth !== undefined && this.props.userAuth.length > 0 && this.props.userAuth[this.state.userAuthCurrent].isAuthenticated === true ) {
      if ( this.state.applicationSelected === false ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">Application Data Form</h1>
            </header>
            <SelectApplication
              appNames={this.state.appNames}
              appOnClick={this.appOnClick}
              placeHolder="Select an Application"
            />
          </div>
        );
      } else {
          return (
            <div className="application-form-container">
              <header>
                <h1 className="form-header">Application Data Form</h1>
              </header>
  
              <SelectApplication
                appNames={this.state.appNames}
                appOnClick={this.appOnClick}
                selectedValue={this.state.currentApp.application_name}
              />
  
              <div className="row first-row">
  
                <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="application-id">Application ID:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="application-id"
                        readOnly
                        value={this.state.currentApp.application_id}
                      />
                    </div>
                  </div>
  
                </div>
  
                <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="application-env">Application Environment:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="application-env"
                        value={this.state.currentApp.application_environment}
                        onChange={this.dynamicOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
              </div>
              <div className="row second-row">
  
                <div className="col-lg-12 col-md-12 col-xs-12 app-desc-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="application-desc">Application Description:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="application-desc"
                        value={this.state.currentApp.application_description}
                        onChange={this.descOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
              </div>
              <div className="row third-row">
  
                <div className="col-lg-6 col-md-6 col-xs-12 primary-con-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="primary-con">Primary Contact:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="primary-con"
                        value={this.state.currentApp.primary_contact}
                        onChange={this.pContactOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
                <div className="col-lg-6 col-md-6 col-xs-12 secondary-con-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="application-env">Secondary Contact:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="secondary-con"
                        value={this.state.currentApp.secondary_contact}
                        onChange={this.sContactOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
              </div>
              <div className="row fourth-row">
  
                <div className="col-lg-6 col-md-6 col-xs-12 business-owner-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="business-owner">Application Business Owner:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="business-owner"
                        value={this.state.currentApp.application_business}
                        onChange={this.businessOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
                <div className="col-lg-6 col-md-6 col-xs-12 app-sme-col">
  
                  <div className="form-group">
                    <label className="app-data-label" htmlFor="app-sme">Application SME:</label>
                    <div>
                      <input
                        className="form-control inputdefault"
                        id="app-sme"
                        value={this.state.currentApp.application_sme}
                        onChange={this.smeOnChange}
                      />
                    </div>
                  </div>
  
                </div>
  
              </div>
  
              <div className="row fifth-row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
                  <SizedSelectField
                    dynamicClass="sized-select"
                    labelText="Application Dependencies:"
                    selectID="select-dependencies"
                    selectSize="10"
                    listData={this.state.currentApp.application_dependencies}
                    openOnClick={this.openOnClick}
                  />
                  <div className="add-remove-container">
                    <i className="fas fa-plus" onClick={this.openDependencyModal}/>
                    <i className="fas fa-minus" onClick={this.removeDependency}/>
                  </div> 
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-xs-12">
                  <SizedSelectField
                    dynamicClass="sized-select"
                    labelText="Asset List:"
                    selectID="select-asset-list"
                    selectSize="10"
                    listData={this.state.currentApp.asset_list}
                    openOnClick={this.openOnClick}
                  />
                  <div className="add-remove-container">
                    <i className="fas fa-plus" onClick={this.openAssetModal}/>
                    <i className="fas fa-minus" onClick={this.removeAsset}/>
                  </div>
                </div>
              </div>
              <div className="row submit-row">
                <div className="col-lg-3 col-md-3 col-xs-6 submit-container">
                  <button type="button" onClick={this.submitForm} className="submit-button">Submit Form</button>
                </div>
              </div>
              <SelectModal 
                displayValue={{display: this.state.dependencyModalDisplay}}
                labelValue="Provide an Application Name"
                className="add-modal"
                selectId="asset-input"
                onClose={this.closeDependencyModal}
                modalSubmit={this.modalSubmit}
                placeHolder="Application Name..."
                submitText="Add Application"
                listData={this.state.appNames}
                closeId="closeApplicationModal"
                submitType="appDependencies"
              />                   
              <SelectModal 
                displayValue={{display: this.state.assetModalDisplay}}
                labelValue="Provide an Asset Name"
                className="add-modal"
                selectId="asset-input"
                onClose={this.closeAssetModal}
                modalSubmit={this.modalSubmit}
                placeHolder="Asset Name..."
                submitText="Add Asset"
                listData={this.state.assetNames}
                closeId="closeAssetModal"
                submitType="assetList"
              />                   
            </div>
          );
        } 
    } else {
      return (
        <Redirect
            to={{
              pathname: "/",
              state: { from: this.props.location }
            }}
          />
      );
    }
  }

}

ApplicationForm.propTypes = {
    getData: PropTypes.func.isRequired,
    postData: PropTypes.func.isRequired,
    allApplicationNames: PropTypes.array.isRequired,
    applicationData: PropTypes.array,
    appFormResponse: PropTypes.array,
    currentAssets: PropTypes.array,
    currentDependencies: PropTypes.array
};
  
const mapStateToProps = (state) => {
  return {
    allApplicationNames: state.allApplicationNames,
    applicationData: state.applicationData,
    currentAssets: state.currentAssets,
    currentDependencies: state.currentDependencies,
    appFormResponse: state.appFormResponse,
    assetOrDepResponse: state.assetOrDepResponse,
    userAuth: state.userAuth,
    assetNamesAndTypes: state.assetNamesAndTypes
  };
};
  
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData: getData,
    postData: postData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationForm);