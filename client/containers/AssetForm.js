import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import SizedSelectField from '../components/ApplicationForm/SizedSelectField';
import SelectModal from '../components/SelectModal';
import SelectApplication from '../components/ApplicationForm/SelectApplication';
import { getData } from '../actions/getData';
import { postData } from '../actions/postData';
import ListOptions from '../components/ListOptions';
import chassisObj from '../common/chassisObj';
import bladeObj from '../common//bladeObj';

class AssetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appNames: [],
      assetNames: [],
      assetTypes: {},
      assetNamesWithType: [],
      assetTypeArray: [],
      assetSelected: false,
      originalAssetState: {},
      currentAsset: {},
      bladeOriginal: {},
      chassisOriginal: {},
      bladeObj: bladeObj,
      chassisObj: chassisObj,
      currentAssetType: "",
      serverDependencies: [],
      applications: [],
      selectedApplications: [],
      dbAssetDependencies: [],
      networkDependencies: [],
      fileShareDependencies: [],
      clusterNodes: [],
      storageDependencies: [],
      appliances: [],
      storageArrays: [],
      switches: [],
      vms: [],
      esxHosts: [],
      chassis: [],
      bladeServers: [],
      servers: [],
      modalDisplay: {
        applicationsModalDisplay: "none",
        storageDependenciesModalDisplay: "none",
        dbAssetDependModalDisplay: "none",
        networkDependModalDisplay: "none",
        fileShareDependModalDisplay: "none",
        clusterNodesModalDisplay: "none",
        fireWallModalDisplay: "none"
      },
      userAuthCurrent: this.props.userAuth.length - 1,
      sessionAuth: sessionStorage.getItem('isUserAuth'),
      preppedData: {},
      submitRequested: false,
      requestNumber: 0
    };

    this.assetOnClick = this.assetOnClick.bind(this);
    this.dynamicOnChange = this.dynamicOnChange.bind(this);
    this.setClusteredValue = this.setClusteredValue.bind(this);
    this.openModalOnClick = this.openModalOnClick.bind(this);
    this.closeModalOnClick = this.closeModalOnClick.bind(this);
    this.modalSubmit = this.modalSubmit.bind(this);
    this.setAssetTypeOnChange = this.setAssetTypeOnChange.bind(this);
    this.chassisFieldOnChange = this.chassisFieldOnChange.bind(this);
    this.bladeFieldOnChange = this.bladeFieldOnChange.bind(this);
    this.removeDependency = this.removeDependency.bind(this);
    this.submitForm = this.submitForm.bind(this);
    //this.chassisSlotFieldOnChange = this.chassisSlotFieldOnChange.bind(this);
  }

  componentDidMount() {
    this.props.getData("get_asset_names_types");
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevProps.allAssetNames.length !== this.props.allAssetNames.length ) {
      this.setAssetNames();
    }

    if ( prevProps.assetNamesAndTypes.length !== this.props.assetNamesAndTypes.length ) {
      this.setAssetNames();
      this.setAssetTypes();
      this.setAppNames();
    }

    if ( prevProps.assetData.length !== this.props.assetData.length ) {
      this.setCurrentAsset();
      //this.setOriginalState();
    }
  }

  openOnClick(e) {
    let val = e.target.value;
  }

  compareState() {
    let currentState = Object.assign({}, this.state.currentAsset);
    let originalAssetState = Object.assign({}, this.state.originalAssetState);
    let bladeCurrent;
    let bladeOriginal;
    let chassisCurrent;
    let chassisOriginal;

    let changes = {
      numberOfFields: 0,
      newData: {},
      arrayUpdates: [],
      isNewData: false,
      isBladeData: false,
      isChassisData: false
    };



    for (const prop in currentState) {
      if ( Array.isArray(currentState[prop]) ) {
        let newArr = currentState[prop];
        let oldArr = originalAssetState[prop];
        let len;

        if ( newArr.length > oldArr.length ) {
          len = newArr.length;
        } else {
          len = oldArr.length;
        }
        
        for (let i = 0; i < len; i++ ) {
          if ( newArr[i] !== oldArr[i] || newArr.length !== oldArr.length ) {
            changes.newData[prop] = currentState[prop];
            changes.numberOfFields = changes.numberOfFields + 1;
            changes.isNewData = true;
            if ( oldArr.includes(newArr[i]) !== true && newArr[i] !== undefined ) {
              changes.arrayUpdates.push({
                asset_name: newArr[i],
                dependencyType: this.state.currentAsset.asset_type,
                dependencyName: this.state.currentAsset.asset_name,
                added: true,
                removed: false
              });
            }
            if ( newArr.includes(oldArr[i]) !== true && oldArr[i] !== undefined ) {
              changes.arrayUpdates.push({
                asset_name: oldArr[i],
                dependencyType: this.state.currentAsset.asset_type,
                dependencyName: this.state.currentAsset.asset_name,
                added: false,
                removed: true
              });
            }
          }
        }
      } else {
        if ( currentState[prop] !== originalAssetState[prop] ) {
          changes.newData[prop] = currentState[prop];
          changes.numberOfFields = changes.numberOfFields + 1;
          changes.isNewData = true;
        }
      }
    }

    if ( this.state.currentAsset.is_blade === true ) {
      bladeOriginal = this.state.bladeOriginal;
      bladeCurrent = this.state.bladeObj;

      for (const prop in bladeCurrent) {
        if ( bladeCurrent[prop] !== bladeOriginal[prop] ) {
          changes.bladeData = {};
          changes.bladeData[prop] = bladeCurrent[prop];
          changes.numberOfFields = changes.numberOfFields + 1;
          changes.isBladeData = true;
        }
      }
    }

    if ( this.state.currentAsset.is_chassis === true ) {
      chassisOriginal = this.state.chassisOriginal;
      chassisCurrent = this.state.chassisObj;

      for (const prop in chassisCurrent) {
        if ( chassisCurrent[prop] !== chassisOriginal[prop] ) {
          changes.chassisData = {};
          changes.chassisData[prop] = chassisCurrent[prop];
          changes.numberOfFields = changes.numberOfFields + 1;
          changes.isChassisData = true;
        }
      }
    }

    return changes;
  }

  setAssetNames() {
    let allAssetNamesAndTypesLength = this.props.assetNamesAndTypes.length;
    let currentIndex = allAssetNamesAndTypesLength - 1;
    let assetNamesWithType = this.props.assetNamesAndTypes[currentIndex][0].data;
    let assetNames = assetNamesWithType.map(asset => {
      return asset.asset_name;
    });
    this.setState({
      assetNamesWithType,
      assetNames
    });
  }

  setAssetTypes() {
    let assetTypes = this.props.assetNamesAndTypes[0][1].data;
    let assetKeys = Object.keys(assetTypes);
    let assetTypeArray = [0];
    assetKeys.forEach(key => {
      assetTypeArray.push(assetTypes[key]);
    });

    this.setState({
      assetTypes,
      assetTypeArray
    }, this.relateAssetTypes);
  }

  setAssetTypeOnChange(e) {
    let assetType = e.target.value;
    let assetTypes = this.state.assetTypes;
    let keys = Object.keys(assetTypes);
    let currentAsset = this.state.currentAsset;
    let assetInteger;
    keys.some(prop => {
      if ( assetTypes[prop] === assetType ) {
        assetInteger = Number(prop);
      }
    });
    currentAsset.asset_type = assetInteger;
    this.setState({
      currentAssetType: assetType,
      currentAsset
    });
  }

  setAppNames() {
    let allAssetNamesAndTypesLength = this.props.assetNamesAndTypes.length;
    let currentIndex = allAssetNamesAndTypesLength - 1;
    this.setState({
      appNames: this.props.assetNamesAndTypes[currentIndex][2].data
    });
  }

  relateAssetTypes() {
    let allAssets = this.state.assetNamesWithType;
    let servers = [],
    appliances = [],
    storageArrays = [],
    switches = [],
    vms = [],
    esxHosts = [],
    chassis = [],
    bladeServers = [];

    allAssets.forEach(asset => {
      switch (asset.asset_type) {
        case 1:
          servers.push(asset.asset_name);
          break;
        case 2:
          appliances.push(asset.asset_name);
          break;
        case 3:
          storageArrays.push(asset.asset_name);
          break;
        case 4:
          switches.push(asset.asset_name);
          break;
        case 5:
          vms.push(asset.asset_name);
          break;
        case 6:
          esxHosts.push(asset.asset_name);
          break;
        case 7:
          chassis.push(asset.asset_name);
          break;
        case 8:
          bladeServers.push(asset.asset_name);
          break;
      
        default:
          break;
      }
    });

    this.setState({
      appliances,
      storageArrays,
      switches,
      vms,
      esxHosts,
      chassis,
      bladeServers,
      servers
    });
  }

  setCurrentAsset() {
    let dataLength = this.props.assetData.length - 1;
    let currentAsset =  this.props.assetData[dataLength][0];
    let serverDependencies = currentAsset.server_dependencies;
    let theIndex = currentAsset.asset_type;
    let assetType = this.state.assetTypes[theIndex];

    let assetId = currentAsset.asset_id;
    let len = this.props.assetNamesAndTypes.length - 1;
    let currentChassisArr = this.props.assetNamesAndTypes[len][4].data;
    let currentBladeArr = this.props.assetNamesAndTypes[len][3].data;
    let bladeData;
    let bladeRef;
    let chassisData;
    let chassisRef;

    if ( currentAsset.asset_type === 7 && currentAsset.is_chassis === true ) {
      currentChassisArr.some(chassis => {
        if ( assetId === chassis.asset_id ) {
          chassisData = chassis;
        }
      });
      chassisRef = Object.assign({}, chassisData);
      this.setState({
        currentAsset: currentAsset,
        currentAssetType: assetType,
        serverDependencies: serverDependencies,
        chassisObj: chassisRef,
        bladeObj: bladeObj,
        assetSelected: true
      }, this.setOriginalState);
    } else if ( currentAsset.asset_type === 8 && currentAsset.is_blade === true ) {
      currentBladeArr.some(blade => {
        if ( assetId === blade.asset_id ) {
          bladeData = blade;
        }
      });
      bladeRef = Object.assign({}, bladeData);
      this.setState({
        currentAsset: currentAsset,
        currentAssetType: assetType,
        serverDependencies: serverDependencies,
        chassisObj: chassisObj,
        bladeObj: bladeRef,
        assetSelected: true
      }, this.setOriginalState);
    } else {
      this.setState({
        currentAsset: currentAsset,
        currentAssetType: assetType,
        serverDependencies: serverDependencies,
        chassisObj: chassisObj,
        bladeObj: bladeObj,
        assetSelected: true
      }, this.setOriginalState);
    }
      
  }

  setOriginalState() {
    let len = this.props.assetData.length - 1;
    let otherLen = this.props.assetNamesAndTypes.length - 1;
    //let originalAssetState = Object.assign({}, this.props.assetData[len][0]);
    let originalAssetState = Object.assign({}, this.state.currentAsset);
    let bladeOriginal;
    let chassisOriginal;

    if ( originalAssetState.is_blade ) {
      let blades = this.props.assetNamesAndTypes[otherLen][3].data;

      blades.some(blade => {
        if ( originalAssetState.asset_id === blade.asset_id ) {
          bladeOriginal = Object.assign({}, blade);
        }
      });

      this.setState({
        originalAssetState,
        bladeOriginal
      });

    } else if ( originalAssetState.is_chassis ) {
      let chassis = this.props.assetNamesAndTypes[otherLen][4].data;

      chassis.some(chas => {
        if ( originalAssetState.asset_id === chas.asset_id ) {
          chassisOriginal = Object.assign({}, chas);
        }
      });

      this.setState({
        originalAssetState,
        chassisOriginal
      });

    } else {

      this.setState({
        originalAssetState
      });

    }

  }

  assetOnClick(e) {
    let assetName = e.target.selectedOptions[0].innerText;
    let len = this.props.assetNamesAndTypes.length - 1;
    let assetId;
    this.props.assetNamesAndTypes[len][0].data.some((asset) => {
      if ( assetName === asset.asset_name ) {
        assetId = asset.asset_id;
      }
    });
    if ( assetName !== "Select an Asset" ) {
      this.props.postData(assetId, "get_asset_data");
    } else {
      this.setState({
        assetSelected: false
      });
    }
  }

  dynamicOnChange(e) {
    let currentAsset = this.state.currentAsset;
    let prop = e.target.id;
    currentAsset[prop] = e.target.value;
    this.setState({
      currentAsset
    });
  }

  setClusteredValue() {
    if ( this.state.currentAsset.clustered === true ) {
      return "Yes";
    } else {
      return "No";
    }
  }

  setDMZValue() {
    if ( this.state.currentAsset.dmz === true ) {
      return "Yes";
    } else {
      return "No";
    }
  }

  setLoadBalancedValue() {
    if ( this.state.currentAsset.load_balanced === true ) {
      return "Yes";
    } else {
      return "No";
    }
  }

  openModalOnClick(e) {
    let prop = e.target.id;
    let modalDisplay = this.state.modalDisplay;
    modalDisplay[prop] = "block";
    this.setState({
      modalDisplay
    });
  }

  closeModalOnClick(e) {
    let prop = e.target.id.slice(5);
    let modalDisplay = this.state.modalDisplay;
    modalDisplay[prop] = "none";
    this.setState({
      modalDisplay
    });
  }

  modalSubmit(e, type, newValue) {
    let modalProp;
    let prop;
    let currentAsset = this.state.currentAsset;
    let modalDisplay = this.state.modalDisplay;

    if ( type === "apps" ) {
      prop = "applications";
      modalProp = "applicationsModalDisplay";
    }
    if ( type === "storageDependencies" ) {
      prop = "storage_dependencies";
      modalProp = "storageDependenciesModalDisplay";
    }
    if ( type === "dbAssetDependencies" ) {
      prop = "db_asset_dependencies";
      modalProp = "dbAssetDependModalDisplay";
    }
    if ( type === "networkDependencies" ) {
      prop = "network_dependencies";
      modalProp = "networkDependModalDisplay";
    }
    if ( type === "fileShareDependencies" ) {
      prop = "fileshare_dependencies";
      modalProp = "fileShareDependModalDisplay";
    }
    if ( type === "clusterNodes" ) {
      prop = "cluster_nodes";
      modalProp = "clusterNodesModalDisplay";
    }
    if ( type === "fireWallDependencies" ) {
      prop = "firewall";
      modalProp = "fireWallModalDisplay";
    }

    let oldArr = currentAsset[prop];
    let newArr = [...oldArr, newValue];

    modalDisplay[modalProp] = "none";

    if ( newValue !== undefined && newValue !== null && newValue !== "" ) {
      currentAsset[prop] = newArr;
      this.setState({
        currentAsset,
        modalDisplay
      });
    } 

    return;

  }

  getBladeInfo(type) {
    let assetId = this.state.currentAsset.asset_id;
    let len = this.props.assetNamesAndTypes.length - 1;
    let current = this.props.assetNamesAndTypes[len][3].data;
    let bladeData;

    if ( current !== undefined ) {
      current.some(blade => {
        if ( assetId === blade.asset_id ) {
          bladeData = blade;
        }
      });
    }

    if ( type === "chassis" && bladeData !== undefined ) {
      return bladeData.chassis;
    } else if ( type === "slot" && bladeData !== undefined ) {
      return bladeData.chassis_slot_number;
    } else if ( type === "parent" && bladeData !== undefined && bladeData.parent_asset_id !== undefined ) {
      return bladeData.parent_asset_id;
    } else {
      return "";
    }
  }

  chassisFieldOnChange(e) {
    let chassisStateObj = Object.assign({}, this.state.chassisObj);
    let theId = e.target.id;
    let newVal = e.target.value;

    chassisStateObj[theId] = newVal;

    this.setState({
      chassisObj: chassisStateObj
    });
  }

  bladeFieldOnChange(e) {
    let bladeStateObj = Object.assign({}, this.state.bladeObj);
    let theId = e.target.id;
    let newVal = e.target.value;

    bladeStateObj[theId] = newVal;

    this.setState({
      bladeObj: bladeStateObj
    });
  }

  /*getChassisInfo(type) {
    let assetId = this.state.currentAsset.asset_id;
    let len = this.props.assetNamesAndTypes.length - 1;
    let current = this.props.assetNamesAndTypes[len][4].data;
    let chassisData;

    if ( current !== undefined ) {
      current.some(chassis => {
        if ( assetId === chassis.asset_id ) {
          chassisData = chassis;
        }
      });

      let chassisRef = Object.assign({}, chassisData);
      this.setState({
        chassisObj: chassisRef
      });

    } else {
      this.setState({
        chassisObj
      });
    }

    if ( type === "ilo" && chassisData !== undefined ) {
      return chassisData.ilo_address;
    } else if ( type === "slots" && chassisData !== undefined ) {
      return chassisData.number_of_slots;
    } else if ( type === "slot1" && chassisData ) {
      return chassisData.slot_1;
    } else if ( type === "slot2" && chassisData ) {
      return chassisData.slot_2;
    } else if ( type === "slot3" && chassisData ) {
      return chassisData.slot_3;
    } else if ( type === "slot4" && chassisData ) {
      return chassisData.slot_4;
    } else if ( type === "slot5" && chassisData ) {
      return chassisData.slot_5;
    } else if ( type === "slot6" && chassisData ) {
      return chassisData.slot_6;
    } else if ( type === "slot7" && chassisData ) {
      return chassisData.slot_7;
    } else if ( type === "slot8" && chassisData ) {
      return chassisData.slot_8;
    } else if ( type === "slot9" && chassisData ) {
      return chassisData.slot_9;
    } else if ( type === "slot10" && chassisData ) {
      return chassisData.slot_10;
    } else if ( type === "slot11" && chassisData ) {
      return chassisData.slot_11;
    } else if ( type === "slot12" && chassisData ) {
      return chassisData.slot_12;
    } else if ( type === "slot13" && chassisData ) {
      return chassisData.slot_13;
    } else if ( type === "slot14" && chassisData ) {
      return chassisData.slot_14;
    } else if ( type === "slot15" && chassisData ) {
      return chassisData.slot_15;
    } else if ( type === "slot16" && chassisData ) {
      return chassisData.slot_16;
    } else {
      return "";
    }

  }*/

  returnAssetType() {
    let assetTypes = this.state.assetTypeArray;
    let theIndex = this.state.currentAsset.asset_type;
    let assetType = assetTypes[theIndex];
    return assetType;
  }

  removeDependency(e) {
    let currentAsset = Object.assign({}, this.state.currentAsset);
    let target = e.target.id;
    let lastIndexOf_ = target.lastIndexOf("_");
    let prop = target.slice(0, lastIndexOf_);
    let oldArr = currentAsset[prop];
    let newArr = [...oldArr]; //creates copy so state does not get mixed up
    let selectTarget;
    
    switch (target) {
      case "storage_dependencies_i":
        selectTarget = document.getElementById("storage_dependencies");
        break;
      case "applications_i":
        selectTarget = document.getElementById("select-applications-list");
        break;
      case "db_asset_dependencies_i":
        selectTarget = document.getElementById("db_asset_dependencies");
        break;
      case "network_dependencies_i":
        selectTarget = document.getElementById("network_dependencies");
        break;
      case "fileshare_dependencies_i":
        selectTarget = document.getElementById("fileshare_dependencies");
        break;
      case "cluster_nodes_i":
        selectTarget = document.getElementById("cluster_nodes");
        break;
      case "firewall_i":
        selectTarget = document.getElementById("firewall");
        break;
      default:
        break;
    }

    if ( selectTarget.selectedIndex === - 1 ) {
      return;
    }

    let selected = selectTarget.options[selectTarget.selectedIndex].innerHTML;
    let targetIndex = oldArr.indexOf(selected);
    newArr.splice(targetIndex, 1);

    currentAsset[prop] = newArr;

    this.setState({
      currentAsset
    });

  }

  submitForm() {
    let updateObj = this.compareState();
    let requestNum = this.state.requestNumber + 1;
    let submitRequested = false;

    if ( updateObj.numberOfFields !== 0 ) {
      let formData = updateObj;
      delete formData.numberOfFields;
      formData.assetId = this.state.currentAsset.asset_id;
      formData.assetName = this.state.currentAsset.asset_name;
      formData.assetType = this.state.currentAsset.asset_type;
      formData.requestNumber = requestNum;
      this.props.postData(formData, "post_asset_form");
      submitRequested = true;

      this.setState({
        submitRequested,
        showLoading: true,
        requestNumber: this.state.requestNumber + 1,
      });

    }

  }

  render() {
    if ( this.state.sessionAuth === "true" || this.props.userAuth !== undefined && this.props.userAuth.length > 0 && this.props.userAuth[this.state.userAuthCurrent].isAuthenticated === true ) {
      if ( this.state.assetSelected === false ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">Asset Data Form</h1>
            </header>
            <SelectApplication
              appNames={this.state.assetNames}
              appOnClick={this.assetOnClick}
              placeHolder="Select an Asset"
            />
          </div>
        );
      }
      if ( this.state.assetSelected === true && this.state.currentAssetType !== "blade_server" && this.state.currentAssetType !== "chassis" ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">Asset Data Form</h1>
            </header>
  
            <SelectApplication
              appNames={this.state.assetNames}
              appOnClick={this.assetOnClick}
              placeHolder="Select an Asset"
            />
  
            <div className="row first-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_id">Asset ID:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_id"
                      readOnly
                      value={this.state.currentAsset.asset_id}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_name">Asset Name:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_name"
                      value={this.state.currentAsset.asset_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row second-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_type">Asset Type:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetTypeArray}
                      defaultSelected={this.state.currentAssetType}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_make">Asset Make:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_make"
                      value={this.state.currentAsset.asset_make}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_model">Asset Model:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_model"
                      value={this.state.currentAsset.asset_model}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_environment">Asset Environment:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_environment"
                      value={this.state.currentAsset.asset_environment}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_function">Asset Function:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_function"
                      value={this.state.currentAsset.asset_function}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="serial_number">Serial Number:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="serial_number"
                      value={this.state.currentAsset.serial_number}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="clustered">Clustered:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setClusteredValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="data_center">Data Center:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="data_center"
                      value={this.state.currentAsset.data_center}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
          
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="move_group">Move Group:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="move_group"
                      value={this.state.currentAsset.move_group}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="os">OS:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="os"
                      value={this.state.currentAsset.os}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="cpu">CPU:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="cpu"
                      value={this.state.currentAsset.cpu}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ram">RAM:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ram"
                      value={this.state.currentAsset.ram}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="disk_size">Disk Size:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="disk_size"
                      value={this.state.currentAsset.disk_size}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ip_address">IP Address:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ip_address"
                      value={this.state.currentAsset.ip_address}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="all_ips">All IP's:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="all_ips"
                      value={this.state.currentAsset.all_ips}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="subnet">Subnet:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="subnet"
                      value={this.state.currentAsset.subnet}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="gateway">Gateway:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="gateway"
                      value={this.state.currentAsset.gateway}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vlan">VLAN:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vlan"
                      value={this.state.currentAsset.vlan}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="domain">Domain:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="domain"
                      value={this.state.currentAsset.domain_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="db_dependency">DB Dependency:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="db_dependency"
                      value={this.state.currentAsset.db_dependency}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="load_balanced">Load Balanced:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setLoadBalancedValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vip_requirements">VIP:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vip_requirements"
                      value={this.state.currentAsset.vip_requirements}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="dmz">DMZ:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setDMZValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Storage Dependency:"
                  selectID="storage_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.storage_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="storageDependenciesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="storage_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="DB Asset Dependency:"
                  selectID="db_asset_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.db_asset_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="dbAssetDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="db_asset_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Network Dependency:"
                  selectID="network_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.network_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="networkDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="network_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Fileshare Dependency:"
                  selectID="fileshare_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.fileshare_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fileShareDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="fileshare_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Cluster Nodes:"
                  selectID="cluster_nodes"
                  selectSize="8"
                  listData={[this.state.currentAsset.cluster_nodes]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="clusterNodesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="cluster_nodes_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Applications"
                  selectID="select-applications-list"
                  selectSize="8"
                  listData={[this.state.currentAsset.applications]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="applicationsModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="applications_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Firewall:"
                  selectID="firewall"
                  selectSize="8"
                  listData={[this.state.currentAsset.firewall]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fireWallModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="firewall_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
              <div className="col-lg-8 col-md-8 col-xs-12 app-env-col" style={{margin: '0 auto'}}>
                <div className="form-group">
                  <label className="notes-label app-data-label" htmlFor="notes">Notes:</label>
                  <textarea className="form-control" id="notes" rows="8" defaultValue={this.state.currentAsset.notes}  onChange={this.dynamicOnChange}/>
                </div>
              </div>
            </div>
  
           
            <div className="row submit-row">
              <div className="col-lg-3 col-md-3 col-xs-6 submit-container">
                <button type="button" onClick={this.submitForm} className="submit-button">Submit Form</button>
              </div>
            </div>
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.applicationsModalDisplay}}
              labelValue="Select An Application"
              className="add-modal"
              selectId="application-select"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Application Name..."
              submitText="Add Application"
              listData={this.state.appNames}
              closeId="closeapplicationsModalDisplay"
              submitType="apps"
            />
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.storageDependenciesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closestorageDependenciesModalDisplay"
              submitType="storageDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.dbAssetDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closedbAssetDependenciesModalDisplay"
              submitType="dbAssetDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.networkDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closenetworkDependModalDisplay"
              submitType="networkDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fileShareDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closefileShareeDependModalDisplay"
              submitType="fileShareDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.clusterNodesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Cluster Node Name..."
              submitText="Add Cluster Node"
              listData={this.state.assetNames}
              closeId="closeclusterNodesModalDisplay"
              submitType="clusterNodes"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fireWallModalDisplay}}
              labelValue="Select A Firewall"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Firewall Name..."
              submitText="Add Firewall"
              listData={this.state.assetNames}
              closeId="closefireWallModalDisplay"
              submitType="fireWallDependencies"
            />            
          </div>
        );
      }
      if ( this.state.assetSelected === true && this.state.currentAssetType === "blade_server" ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">Asset Data Form</h1>
            </header>
  
            <SelectApplication
              appNames={this.state.assetNames}
              appOnClick={this.assetOnClick}
              placeHolder="Select an Asset"
            />
  
            <div className="row first-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_id">Asset ID:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_id"
                      readOnly
                      value={this.state.currentAsset.asset_id}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_name">Asset Name:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_name"
                      value={this.state.currentAsset.asset_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row second-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_type">Asset Type:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetTypeArray}
                      defaultSelected={this.state.currentAssetType}
                      OnClickHandler={this.setAssetTypeOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_make">Asset Make:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_make"
                      value={this.state.currentAsset.asset_make}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_model">Asset Model:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_model"
                      value={this.state.currentAsset.asset_model}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_environment">Asset Environment:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_environment"
                      value={this.state.currentAsset.asset_environment}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_function">Asset Function:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_function"
                      value={this.state.currentAsset.asset_function}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="serial_number">Serial Number:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="serial_number"
                      value={this.state.currentAsset.serial_number}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="clustered">Clustered:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setClusteredValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="data_center">Data Center:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="data_center"
                      value={this.state.currentAsset.data_center}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
          
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="move_group">Move Group:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="move_group"
                      value={this.state.currentAsset.move_group}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="os">OS:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="os"
                      value={this.state.currentAsset.os}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="cpu">CPU:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="cpu"
                      value={this.state.currentAsset.cpu}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ram">RAM:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ram"
                      value={this.state.currentAsset.ram}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="disk_size">Disk Size:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="disk_size"
                      value={this.state.currentAsset.disk_size}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ip_address">IP Address:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ip_address"
                      value={this.state.currentAsset.ip_address}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="all_ips">All IP's:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="all_ips"
                      value={this.state.currentAsset.all_ips}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="subnet">Subnet:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="subnet"
                      value={this.state.currentAsset.subnet}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="gateway">Gateway:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="gateway"
                      value={this.state.currentAsset.gateway}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vlan">VLAN:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vlan"
                      value={this.state.currentAsset.vlan}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="domain">Domain:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="domain"
                      value={this.state.currentAsset.domain_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="db_dependency">DB Dependency:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="db_dependency"
                      value={this.state.currentAsset.db_dependency}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="load_balanced">Load Balanced:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setLoadBalancedValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vip_requirements">VIP:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vip_requirements"
                      value={this.state.currentAsset.vip_requirements}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="dmz">DMZ:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setDMZValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Storage Dependency:"
                  selectID="storage_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.storage_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="storageDependenciesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="storage_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="DB Asset Dependency:"
                  selectID="db_asset_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.db_asset_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="dbAssetDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="db_asset_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Network Dependency:"
                  selectID="network_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.network_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="networkDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="network_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Fileshare Dependency:"
                  selectID="fileshare_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.fileshare_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fileShareDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="fileshare_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Cluster Nodes:"
                  selectID="cluster_nodes"
                  selectSize="8"
                  listData={[this.state.currentAsset.cluster_nodes]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="clusterNodesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="cluster_nodes_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Applications"
                  selectID="select-applications-list"
                  selectSize="8"
                  listData={[this.state.currentAsset.applications]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="applicationsModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="applications_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Firewall:"
                  selectID="firewall"
                  selectSize="8"
                  listData={[this.state.currentAsset.firewall]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fireWallModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="firewall_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
              <div className="blade-specific">
                <h1>Blade Specific Fields</h1>
              </div>
            </div>
  
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="chassis">Chassis:</label>
                  <div>
                    <ListOptions
                      data={this.state.chassis}
                      defaultSelected={this.state.bladeObj.chassis}
                      OnClickHandler={this.bladeFieldOnChange}
                      htmlId={"chassis"}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="subnet">Chassis Slot#:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="chassis_slot_number"
                      value={this.state.bladeObj.chassis_slot_number}
                      onChange={this.bladeFieldOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col" style={{margin: '0 auto'}}>
                <div className="form-group">
                  <label className="app-data-label" htmlFor="subnet">Parent Asset Id:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="subnet"
                      value={this.state.bladeObj.parent_asset_id}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <div className="row fourth-row">
              <div className="col-lg-8 col-md-8 col-xs-12 app-env-col" style={{margin: '0 auto'}}>
                <div className="form-group">
                  <label className="notes-label app-data-label" htmlFor="notes">Notes:</label>
                  <textarea className="form-control" id="notes" rows="8" defaultValue={this.state.currentAsset.notes}  onChange={this.dynamicOnChange}/>
                </div>
              </div>
            </div>
  
           
            <div className="row submit-row">
              <div className="col-lg-3 col-md-3 col-xs-6 submit-container">
                <button type="button" onClick={this.submitForm} className="submit-button">Submit Form</button>
              </div>
            </div>
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.applicationsModalDisplay}}
              labelValue="Select An Application"
              className="add-modal"
              selectId="application-select"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Application Name..."
              submitText="Add Application"
              listData={this.state.appNames}
              closeId="closeapplicationsModalDisplay"
              submitType="apps"
            />
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.storageDependenciesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closestorageDependenciesModalDisplay"
              submitType="storageDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.dbAssetDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closedbAssetDependenciesModalDisplay"
              submitType="dbAssetDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.networkDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closenetworkDependModalDisplay"
              submitType="networkDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fileShareDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closefileShareeDependModalDisplay"
              submitType="fileShareDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.clusterNodesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Cluster Node Name..."
              submitText="Add Cluster Node"
              listData={this.state.assetNames}
              closeId="closeclusterNodesModalDisplay"
              submitType="clusterNodes"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fireWallModalDisplay}}
              labelValue="Select A Firewall"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Firewall Name..."
              submitText="Add Firewall"
              listData={this.state.assetNames}
              closeId="closefireWallModalDisplay"
              submitType="fireWallDependencies"
            />            
          </div>
        );
      }
      if ( this.state.assetSelected === true && this.state.currentAssetType === "chassis" ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">Asset Data Form</h1>
            </header>
  
            <SelectApplication
              appNames={this.state.assetNames}
              appOnClick={this.assetOnClick}
              placeHolder="Select an Asset"
            />
  
            <div className="row first-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_id">Asset ID:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_id"
                      readOnly
                      value={this.state.currentAsset.asset_id}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_name">Asset Name:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_name"
                      value={this.state.currentAsset.asset_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row second-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_type">Asset Type:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetTypeArray}
                      defaultSelected={this.state.currentAssetType}
                    />
                  </div>
                </div>
  
              </div>
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_make">Asset Make:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_make"
                      value={this.state.currentAsset.asset_make}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_model">Asset Model:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_model"
                      value={this.state.currentAsset.asset_model}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_environment">Asset Environment:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_environment"
                      value={this.state.currentAsset.asset_environment}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_function">Asset Function:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_function"
                      value={this.state.currentAsset.asset_function}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="serial_number">Serial Number:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="serial_number"
                      value={this.state.currentAsset.serial_number}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="clustered">Clustered:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setClusteredValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="data_center">Data Center:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="data_center"
                      value={this.state.currentAsset.data_center}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
          
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="move_group">Move Group:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="move_group"
                      value={this.state.currentAsset.move_group}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="os">OS:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="os"
                      value={this.state.currentAsset.os}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="cpu">CPU:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="cpu"
                      value={this.state.currentAsset.cpu}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ram">RAM:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ram"
                      value={this.state.currentAsset.ram}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="disk_size">Disk Size:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="disk_size"
                      value={this.state.currentAsset.disk_size}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ip_address">IP Address:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="ip_address"
                      value={this.state.currentAsset.ip_address}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="all_ips">All IP's:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="all_ips"
                      value={this.state.currentAsset.all_ips}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="subnet">Subnet:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="subnet"
                      value={this.state.currentAsset.subnet}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="gateway">Gateway:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="gateway"
                      value={this.state.currentAsset.gateway}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vlan">VLAN:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vlan"
                      value={this.state.currentAsset.vlan}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="domain">Domain:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="domain"
                      value={this.state.currentAsset.domain_name}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="db_dependency">DB Dependency:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="db_dependency"
                      value={this.state.currentAsset.db_dependency}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="load_balanced">Load Balanced:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setLoadBalancedValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="vip_requirements">VIP:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="vip_requirements"
                      value={this.state.currentAsset.vip_requirements}
                      onChange={this.dynamicOnChange}
                    />
                  </div>
                </div>
  
              </div>
  
            </div>
  
            <div className="row third-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="dmz">DMZ:</label>
                  <div>
                    <ListOptions
                      defaultSelected={this.setDMZValue()}
                      data={["Yes", "No"]}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Storage Dependency:"
                  selectID="storage_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.storage_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="storageDependenciesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="storage_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="DB Asset Dependency:"
                  selectID="db_asset_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.db_asset_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="dbAssetDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="db_asset_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Network Dependency:"
                  selectID="network_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.network_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="networkDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="network_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Fileshare Dependency:"
                  selectID="fileshare_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.fileshare_dependencies]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fileShareDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="fileshare_dependencies_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Cluster Nodes:"
                  selectID="cluster_nodes"
                  selectSize="8"
                  listData={[this.state.currentAsset.cluster_nodes]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="clusterNodesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="cluster_nodes_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>
            <div className="row fourth-row">
  
             <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Applications"
                  selectID="select-applications-list"
                  selectSize="8"
                  listData={[this.state.currentAsset.applications]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="applicationsModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="applications_i" onClick={this.removeDependency}/>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Firewall:"
                  selectID="firewall"
                  selectSize="8"
                  listData={[this.state.currentAsset.firewall]}
                  openOnClick={this.openOnClick}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fireWallModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" id="firewall_i" onClick={this.removeDependency}/>
                </div>
              </div>
  
            </div>

            <div className="row fourth-row">
              <div className="blade-specific">
                <h1>Chassis Specific Fields</h1>
              </div>
            </div>

            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="ilo_address">ILO Address:</label>
                  <div>
                  <input
                      className="form-control inputdefault"
                      id="ilo_address"
                      value={this.state.chassisObj.ilo_address}
                      onChange={this.chassisFieldOnChange}
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="number_of_slots">Slots:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="number_of_slots"
                      value={this.state.chassisObj.number_of_slots}
                      onChange={this.chassisFieldOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_1">Slot #1:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_1}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_1"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_2">Slot #2:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_2}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_2"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_3">Slot #3:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_3}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_3"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_4">Slot #4:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_4}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_4"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_5">Slot #5:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_5}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_5"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_6">Slot #6:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_6}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_7">Slot #7:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_7}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_7"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_8">Slot #8:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_8}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_8"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_9">Slot #9:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_9}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_9"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_10">Slot #10:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_10}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_11">Slot #11:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_11}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_11"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_12">Slot #12:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_12}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_12"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_13">Slot #13:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_13}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_13"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_14">Slot #14:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_14}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_14"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row fourth-row">
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_15">Slot #15:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_15}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_15"
                    />
                  </div>
                </div>
  
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12 app-env-col">
                <div className="form-group">
                  <label className="app-data-label" htmlFor="slot_16">Slot #16:</label>
                  <div>
                    <ListOptions
                      data={this.state.assetNames}
                      defaultSelected={this.state.chassisObj.slot_16}
                      OnClickHandler={this.chassisFieldOnChange}
                      type="chassisSlot"
                      htmlId="slot_16"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <div className="row fourth-row">
              <div className="col-lg-8 col-md-8 col-xs-12 app-env-col" style={{margin: '0 auto'}}>
                <div className="form-group">
                  <label className="notes-label app-data-label" htmlFor="notes">Notes:</label>
                  <textarea className="form-control" id="notes" rows="8" defaultValue={this.state.currentAsset.notes}  onChange={this.dynamicOnChange}/>
                </div>
              </div>
            </div>
  
           
            <div className="row submit-row">
              <div className="col-lg-3 col-md-3 col-xs-6 submit-container">
                <button type="button" onClick={this.submitForm} className="submit-button">Submit Form</button>
              </div>
            </div>
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.applicationsModalDisplay}}
              labelValue="Select An Application"
              className="add-modal"
              selectId="application-select"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Application Name..."
              submitText="Add Application"
              listData={this.state.appNames}
              closeId="closeapplicationsModalDisplay"
              submitType="apps"
            />
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.storageDependenciesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closestorageDependenciesModalDisplay"
              submitType="storageDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.dbAssetDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closedbAssetDependenciesModalDisplay"
              submitType="dbAssetDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.networkDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closenetworkDependModalDisplay"
              submitType="networkDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fileShareDependModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Dependency Name..."
              submitText="Add Dependency"
              listData={this.state.assetNames}
              closeId="closefileShareeDependModalDisplay"
              submitType="fileShareDependencies"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.clusterNodesModalDisplay}}
              labelValue="Select A Dependency"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Cluster Node Name..."
              submitText="Add Cluster Node"
              listData={this.state.assetNames}
              closeId="closeclusterNodesModalDisplay"
              submitType="clusterNodes"
            />            
            <SelectModal 
              displayValue={{display: this.state.modalDisplay.fireWallModalDisplay}}
              labelValue="Select A Firewall"
              className="add-modal"
              selectId="asset-input"
              onClose={this.closeModalOnClick}
              modalSubmit={this.modalSubmit}
              placeHolder="Firewall Name..."
              submitText="Add Firewall"
              listData={this.state.assetNames}
              closeId="closefireWallModalDisplay"
              submitType="fireWallDependencies"
            />            
          </div>
        );
      }
    } else {
      return (
        //<h1>Please Login!</h1>
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

AssetForm.propTypes = {
  getData: PropTypes.func.isRequired,
  postData: PropTypes.func.isRequired,
  assetData: PropTypes.array,
  assetNamesAndTypes: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return {
    allAssetNames: state.allAssetNames,
    assetData: state.assetData,
    assetNamesAndTypes: state.assetNamesAndTypes,
    userAuth: state.userAuth,
    assetFormResponse: state.assetFormResponse
  };
};
  
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData,
    postData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AssetForm);