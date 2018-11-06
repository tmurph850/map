import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
import SizedSelectField from '../components/ApplicationForm/SizedSelectField';
import SelectModal from '../components/SelectModal';
import { getData } from '../actions/getData';
import { postData } from '../actions/postData';
import ListOptions from '../components/ListOptions';
import emptyAsset from '../common/assetObj';

class NewForm extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentAsset: emptyAsset,
      formType: "",
      formTypeSelected: false,
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
      sessionAuth: sessionStorage.getItem('isUserAuth')
    };

    this.dynamicOnChange = this.dynamicOnChange.bind(this);
    this.openModalOnClick = this.openModalOnClick.bind(this);
    this.selectFormType = this.selectFormType.bind(this);
  }

  componentDidMount() {
    this.props.getData("get_asset_names_types");
  }

  componentDidUpdate(prevProps, prevState) {
    if ( prevProps.assetNamesAndTypes.length !== this.props.assetNamesAndTypes.length ) {
      this.setAssetNames();
      this.setAssetTypes();
      this.setAppNames();
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

  setAppNames() {
    let allAssetNamesAndTypesLength = this.props.assetNamesAndTypes.length;
    let currentIndex = allAssetNamesAndTypesLength - 1;
    this.setState({
      appNames: this.props.assetNamesAndTypes[currentIndex][2].data
    });
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

  selectFormType(e) {
    let formType = e.target.value;
    if ( formType !== "Please Select A Form Type" ) {
      this.setState({
        formType: e.target.value,
        formTypeSelected: true
      });
    } else {
      this.setState({
        formType: "",
        formTypeSelected: false
      });
    }
  }

  setAssetTypes() {
    let assetTypes = this.props.assetNamesAndTypes[0][1].data;
    let assetKeys = Object.keys(assetTypes);
    let assetTypeArray = [""];
    assetKeys.forEach(key => {
      assetTypeArray.push(assetTypes[key]);
    });

    this.setState({
      assetTypes,
      assetTypeArray
    }, this.relateAssetTypes);
  }


  render () {
    if ( this.state.sessionAuth === "true" || this.props.userAuth !== undefined && this.props.userAuth.length > 0 && this.props.userAuth[this.state.userAuthCurrent].isAuthenticated === true ) {
      if ( this.state.formTypeSelected === false ) {
        return (
          <div className="application-form-container">
            <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 select-form-type">
              <h1>Select a Form Type</h1>
              <select className="form-control select-application" onChange={this.selectFormType}>
                <option value="Please Select A Form Type">Please Select A Form Type</option>
                <option value="Application">Application</option>
                <option value="Asset">Asset</option>
              </select>
            </div>
          </div>
          </div>
        );
      }
      if ( this.state.formTypeSelected === true && this.state.formType === "Asset" ) {
        return (
          <div className="application-form-container">
            <header>
              <h1 className="form-header">New Asset Form</h1>
            </header>
  
            <div className="row first-row">
  
              <div className="col-lg-6 col-md-6 col-xs-12 app-id-col">
  
                <div className="form-group">
                  <label className="app-data-label" htmlFor="asset_id">Asset ID:</label>
                  <div>
                    <input
                      className="form-control inputdefault"
                      id="asset_id"
                      readOnly
                      value="Generated By Database"
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
                      defaultSelected="No"
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
                      defaultSelected={"No"}
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
                      defaultSelected="No"
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
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="storageDependenciesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
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
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="dbAssetDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
                </div>
              </div>
             <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Network Dependency:"
                  selectID="network_dependencies"
                  selectSize="8"
                  listData={[this.state.currentAsset.network_dependencies]}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="networkDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
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
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fileShareDependModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Cluster Nodes:"
                  selectID="cluster_nodes"
                  selectSize="8"
                  listData={[this.state.currentAsset.cluster_nodes]}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="clusterNodesModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
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
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="applicationsModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-xs-12">
                <SizedSelectField
                  dynamicClass="sized-select"
                  labelText="Firewall:"
                  selectID="firewall"
                  selectSize="8"
                  listData={[this.state.currentAsset.firewall]}
                />
                <div className="add-remove-container">
                  <i className="fas fa-plus" id="fireWallModalDisplay" onClick={this.openModalOnClick}/>
                  <i className="fas fa-minus" />
                </div>
              </div>
  
            </div>
  
            <div className="row fourth-row">
              <div className="col-lg-8 col-md-8 col-xs-12 app-env-col" style={{margin: '0 auto'}}>
                <div className="form-group">
                  <label className="notes-label app-data-label" htmlFor="notes-field">Notes:</label>
                  <textarea className="form-control" id="notes-field" rows="8" defaultValue={this.state.currentAsset.notes}  onChange={this.state.notesOnChange}/>
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

NewForm.propTypes = {

};

const mapStateToProps = (state) => {
  return {
    assetNamesAndTypes: state.assetNamesAndTypes,
    userAuth: state.userAuth
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getData,
    postData
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewForm);