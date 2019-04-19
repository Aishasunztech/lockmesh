import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message } from "antd";
import CircularProgress from "components/CircularProgress/index";
import { editDevice } from "../../appRedux/actions/Devices";


import {
  getDeviceDetails,
  getDeviceApps,
  getProfiles,
  getPolicies,
  getDeviceHistories,
  saveDeviceProfile,
  loadDeviceProfile,
  pushApps,
  undoApps,
  redoApps,
  applySetting,
  startLoading,
  endLoading,
  // showMessage,
  unlinkDevice,
  changePage,
  activateDevice2,
  suspendDevice2,
  getAccIdFromDvcId,
  unflagged,
  flagged,
  wipe,
  checkPass
} from "../../appRedux/actions/ConnectDevice";
import { getDevicesList } from '../../appRedux/actions/Devices';
import imgUrl from '../../assets/images/mobile.png';
import styles from './ConnectDevice.css';
// import { BASE_URL } from '../../constants/Application';
import {
  DEVICE_ACTIVATED, GUEST_PASSWORD, ENCRYPTED_PASSWORD, DURESS_PASSWORD, ADMIN_PASSWORD,
  SECURE_SETTING, SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS
} from '../../constants/Constants';

import DeviceActions from './components/DeviceActions';
import DeviceSidebar from './components/DeviceSidebar';
import SideActions from './components/SideActions';
import AppList from './components/AppList';
import Password from "./components/Password"
import { getColor } from "../utils/commonUtils"
import SettingAppPermissions from "./components/SettingAppPermissions";
import SystemControls from "./components/SystemControls";

class ConnectDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      device_id: '',
      pageName: MAIN_MENU,
      // apply: true,
      // undo: true,
      // redo: true,
      // clear: false,
      // syncStatus: false
    }
    // console.log("hello every body", this.props);
    this.mainMenu = [
      {
        pageName: "apps",
        value: 'Application Permission'
      },
      {
        pageName: SECURE_SETTING,
        value: 'Secure Settings Permission'
      },
      {
        pageName: SYSTEM_CONTROLS,
        value: 'System Permission'
      },

      {
        pageName: MANAGE_PASSWORD,
        value: 'Manage Passwords'
      },

    ]

    this.subMenu = [

      {
        pageName: GUEST_PASSWORD,
        value: 'Set Guest Password'
      },
      {
        pageName: ENCRYPTED_PASSWORD,
        value: 'Set Encrypted Password'
      },
      {
        pageName: DURESS_PASSWORD,
        value: 'Set Duress Password'
      },

      {
        pageName: ADMIN_PASSWORD,
        value: 'Change Admin Panel Code'
      },
    ]


  }
  changePage = (pageName) => {
    if(this.props.device_details.finalStatus === DEVICE_ACTIVATED){
      this.props.changePage(pageName);
    }
  }
  onBackHandler = () => {
    if (this.props.device_details.finalStatus === DEVICE_ACTIVATED) {
      if (this.props.pageName === GUEST_PASSWORD || this.props.pageName === ENCRYPTED_PASSWORD || this.props.pageName === DURESS_PASSWORD || this.props.pageName === ADMIN_PASSWORD) {
        this.props.changePage(MANAGE_PASSWORD);
      } else if (this.props.pageName === MANAGE_PASSWORD) {
        this.props.changePage(MAIN_MENU);
      } else {
        this.props.changePage(MAIN_MENU);
      }
    }
  }

  componentDidMount() {
    this.props.startLoading();

    this.setState({
      pageName: this.props.pageName,
      device_id: atob(this.props.match.params.device_id)
    });

    const device_id = atob(this.props.match.params.device_id);
    // console.log('ref', device_id)

    if (device_id !== '') {

      this.props.getDeviceDetails(device_id);
      this.props.getDeviceApps(device_id);
      this.props.getProfiles(device_id);
      this.props.getPolicies(device_id);
      this.props.getDeviceHistories(device_id);
      // this.setState({
      //     syncStatus: this.props.device_details.is_sync
      // })
    }

    // this.props.endLoading();
    setTimeout(() => {
      this.props.endLoading();
    }, 2000);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.pathName !== nextProps.pathName) {
      // alert("hello");
      // alert("hello");
      // this.setState({
      //     pageName: nextProps.pageName
      // });

      // nextProps.showMessage(false);

      // this.setState({
      //     device_id: nextProps.match.params.device_id
      // });
      // const device_id = nextProps.match.params.device_id;
      // if (device_id != '') {

      //     nextProps.getDeviceDetails(device_id);
      //     nextProps.getDeviceApps(device_id);
      //     nextProps.getProfiles();
      //     nextProps.getDeviceHistories(device_id);
      //     this.setState({
      //         syncStatus: this.props.device_details.is_sync
      //     })
      // }
      // this.props.endLoading();
      // setTimeout(() => {
      //     this.props.endLoading();
      // }, 2000);
    }
  }

  renderScreen = () => {
    const isSync = (this.props.isSync === 1 || this.props.isSync === true) ? true : false;

    if (this.props.pageName === MAIN_MENU && isSync) {
      return (<div>
        <div style={{ color: 'orange', width: '50%', float: 'left' }}></div>
        <List
          className="dev_main_menu"
          size="small"
          dataSource={this.mainMenu}
          renderItem={item => {
            return (<List.Item
              onClick={() => {

                this.changePage(item.pageName)
              }}
            ><a>{item.value}</a></List.Item>)
          }}
        />
      </div>
      );
    } else if (this.props.pageName === APPS && isSync) {
      return (
        <AppList
          app_list={this.props.app_list}
          // pushApps={this.props.pushApps}
          undoApps={this.props.undoApps}
        />
      );
    } else if (this.props.pageName === GUEST_PASSWORD && isSync) {
      return (<Password pwdType={this.props.pageName} />);
    } else if (this.props.pageName === ENCRYPTED_PASSWORD && isSync) {
      return (<Password pwdType={this.props.pageName} />);
    } else if (this.props.pageName === DURESS_PASSWORD && isSync) {
      return (<Password pwdType={this.props.pageName} />);
    } else if (this.props.pageName === ADMIN_PASSWORD && isSync) {
      return (<Password pwdType={this.props.pageName} />);
    } else if (this.props.pageName === SECURE_SETTING && isSync) {
      return (
        <SettingAppPermissions 
          pageName={this.props.pageName} 
          // extensions={this.props.extensions} 
        />
      );
    } else if (this.props.pageName === SYSTEM_CONTROLS && isSync) {
      return (<SystemControls />);
    } else if (this.props.pageName === MANAGE_PASSWORD) {
      return (
        <List
          className="dev_main_menu"
          size="small"
          dataSource={this.subMenu}
          renderItem={item => {
            return (<List.Item
              onClick={() => {

                this.changePage(item.pageName)
              }}
            ><a>{item.value}</a></List.Item>)
          }}
        />
      )

    } else if (this.props.pageName === NOT_AVAILABLE) {
      return (<div><h1 className="not_syn_txt"><a>Device is {this.props.status}</a></h1></div>);
    } else {
      return (<div><h1 className="not_syn_txt"><a>Device is not Synced</a></h1></div>)
    }
  }

  applyActionButton = () => {
    let objIndex = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING);
    this.props.applySetting(this.props.app_list,
      {
        adminPwd: this.props.adminPwd,
        guestPwd: this.props.guestPwd,
        encryptedPwd: this.props.encryptedPwd,
        duressPwd: this.props.duressPwd,
      }
      , this.state.device_id, this.props.user_acc_id, null, null, this.props.extensions[objIndex].subExtension);
    // 
  }
  componentWillUnmount() {
    this.onBackHandler();
  }
  refreshDevice = (deviceId) => {
    console.log(deviceId);
    this.props.startLoading();
    // console.log("refreshDevice", this.props);
    //   this.props.getAccIdFromDvcId(deviceId);
    if (deviceId === undefined) {
      deviceId = atob(this.props.match.params.device_id);
    }
    // console.log('ref', deviceId)
    this.props.getDeviceDetails(deviceId);
    this.props.getDeviceApps(deviceId);
    this.props.getProfiles(deviceId);
    this.props.getPolicies(deviceId);
    this.props.getDeviceHistories(deviceId);
    this.onBackHandler();
    setTimeout(() => {
      this.props.endLoading();
    }, 2000);
  }

  render() {
    let finalStatus = (this.props.device_details.finalStatus === 'Activated' || this.props.device_details.finalStatus === '' || this.props.device_details.finalStatus === null || this.props.device_details.finalStatus === undefined) ? 'Active' : this.props.device_details.finalStatus;
    let color = getColor(finalStatus)
    let onlineStatus = (this.props.device_details.online === 'off') ? 'Offline' : 'Online';
    let onlineColor = (onlineStatus === 'Offline') ? { color: 'red' } : { color: 'green' }
    return (
      <div className="gutter-example">
        {this.props.isLoading ?
          <div className="gx-loader-view">
            <CircularProgress />
          </div> : null}

        {this.props.showMessage === true ?
          (this.props.messageType === "error") ?
            message.error(this.props.messageText) :
            (this.props.messageType === "success") ?
              message.success(this.props.messageText) : null : null}

        <Row gutter={16} type="flex" align="top">
          <Col className="gutter-row left_bar" xs={24} sm={24} md={24} lg={24} xl={8} span={8}>
            <DeviceSidebar
              device_details={this.props.device_details}
              refreshDevice={this.refreshDevice}
              startLoading={this.props.startLoading}
              endLoading={this.props.endLoading}
            />
          </Col>
          <Col className="gutter-row action_group" span={8} xs={24} sm={24} md={24} lg={24} xl={8}>
            <Card>
              <div className="gutter-box bordered deviceImg" alt="Mobile Image" style={{ backgroundImage: 'url(' + imgUrl + ')' }}>
                <div className="status_bar">
                  <div className="col-md-6 active_st">
                    <h5><span style={color}>{finalStatus}</span></h5>
                  </div>
                  <div className="col-md-6 offline_st">
                    <h5><span style={onlineColor}>{onlineStatus}</span></h5>
                  </div>
                </div>
                {this.renderScreen()}
                <Button.Group className="nav_btn_grp">
                  <Button type="default" icon="left" className="nav_btn" onClick={() => {
                    this.onBackHandler();
                  }} />
                  <Button type="default" className="nav_btn" onClick={() => {
                    this.changePage("main_menu")
                  }} />
                  {/* <Button type="default" icon="border" className="nav_btn" /> */}
                </Button.Group>

              </div>
              <DeviceActions
                app_list={this.props.app_list}
                undoApplications={this.props.undoApplications}
                redoApplications={this.props.redoApplications}
                applyActionButton={this.applyActionButton}
              />
            </Card>
          </Col>
          <Col className="gutter-row right_bar" xs={24} sm={24} md={24} lg={24} xl={8}>
            {/*  */}
            <SideActions
              device={this.props.device_details}
              profiles={this.props.profiles}
              policies={this.props.policies}
              histories={this.props.histories}
              activateDevice={this.props.activateDevice2}
              suspendDevice={this.props.suspendDevice2}
              editDevice={this.props.editDevice}
              unlinkDevice={this.props.unlinkDevice}
              flagged={this.props.flagged}
              unflagged={this.props.unflagged}
              wipe={this.props.wipe}
              checkPass={this.props.checkPass}
              history={this.props.history}
              getDevicesList={this.props.getDevicesList}
              refreshDevice={this.refreshDevice}

            />

          </Col>
        </Row>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDeviceDetails: getDeviceDetails,
    getDeviceApps: getDeviceApps,
    getProfiles: getProfiles,
    getPolicies: getPolicies,
    getDeviceHistories: getDeviceHistories,
    saveDeviceProfile: saveDeviceProfile,
    loadDeviceProfile: loadDeviceProfile,
    pushApps: pushApps,
    startLoading: startLoading,
    endLoading: endLoading,
    undoApplications: undoApps,
    redoApplications: redoApps,
    applySetting: applySetting,
    changePage: changePage,
    suspendDevice2: suspendDevice2,
    activateDevice2: activateDevice2,
    editDevice: editDevice,
    getDevicesList: getDevicesList,
    getAccIdFromDvcId: getAccIdFromDvcId,
    // showMessage: showMessage,
    unlinkDevice: unlinkDevice,
    flagged: flagged,
    unflagged: unflagged,
    wipe: wipe,
    checkPass: checkPass,
  }, dispatch);
}
var mapStateToProps = ({ routing, device_details, devices }) => {
  //   console.log("connect device state", device_details);
  return {
    routing: routing,
    pathName: routing.location.pathname,
    device_details: device_details.device,
    app_list: device_details.app_list,
    undoApps: device_details.undoApps,
    profiles: device_details.profiles,
    policies: device_details.policies,
    histories: device_details.device_histories,
    isLoading: device_details.isLoading,
    showMessage: device_details.showMessage,
    messageType: device_details.messageType,
    messageText: device_details.messageText,
    pageName: device_details.pageName,
    isSync: device_details.device.is_sync,
    guestPwd: device_details.guestPwd,
    guestCPwd: device_details.guestCPwd,
    encryptedPwd: device_details.encryptedPwd,
    encryptedCPwd: device_details.encryptedCPwd,
    duressPwd: device_details.duressPwd,
    duressCPwd: device_details.duressCPwd,
    adminPwd: device_details.adminPwd,
    adminCPwd: device_details.adminCPwd,
    status: device_details.status,
    user_acc_id: device_details.device.id,
    extensions: device_details.extensions
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDevice);