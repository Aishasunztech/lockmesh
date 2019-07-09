import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon } from "antd";
import CircularProgress from "components/CircularProgress/index";
import DeviceSettings from './components/DeviceSettings';
import { convertToLang } from '../../routes/utils/commonUtils';
import BackBtn from './back';
import {
  getDeviceDetails,
  getDeviceApps,
  getProfiles,
  getPolicies,
  getDeviceHistories,
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
  checkPass,
  undoExtensions,
  redoExtensions,
  undoControls,
  redoControls,
  getImeiHistory,
  handleMainSettingCheck,
  handleControlCheck,
  handleCheckAllExtension,
  reSyncDevice,
  getDealerApps,
  getActivities,
  clearApplications,
  clearState
} from "../../appRedux/actions/ConnectDevice";

import { getDevicesList, editDevice } from '../../appRedux/actions/Devices';
import { ackFinishedPushApps, ackFinishedPullApps, ackFinishedPolicy, actionInProcess, ackImeiChanged, getAppJobQueue, ackSinglePushApp, ackSinglePullApp, ackFinishedPolicyStep } from "../../appRedux/actions/Socket";

import imgUrl from '../../assets/images/mobile.png';
// import { BASE_URL } from '../../constants/Application';
import {
  DEVICE_ACTIVATED, GUEST_PASSWORD, ENCRYPTED_PASSWORD, DURESS_PASSWORD, ADMIN_PASSWORD,
  SECURE_SETTING, SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
  APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS,
  Main_SETTINGS
} from '../../constants/Constants';

import DeviceActions from './components/DeviceActions';
import DeviceSidebar from './components/DeviceSidebar';
import SideActions from './components/SideActions';
import AppList from './components/AppList';
import Password from "./components/Password"
import { getColor, isBase64 } from "../utils/commonUtils"
import SettingAppPermissions from "./components/SettingAppPermissions";
import SystemControls from "./components/SystemControls";
import styles from './ConnectDevice.css';
import ProgressBar from "../../components/ProgressBar";
import { Button_Apply } from "../../constants/ButtonConstants";

const success = Modal.success
const error = Modal.error

class ConnectDevice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      device_id: '',
      pageName: MAIN_MENU,
      showChangesModal: false,
      controls: [],
      changedCtrls: {},
      imei_list: [],
      showMessage: false,
      messageText: '',
      messageType: ''
    }
    // console.log("hello every body", this.props);
    this.mainMenu = [
      {
        pageName: APPS,
        value: convertToLang(props.translation[APPLICATION_PERMISION], APPLICATION_PERMISION)
      },
      {
        pageName: SECURE_SETTING,
        value: convertToLang(props.translation[SECURE_SETTING_PERMISSION], SECURE_SETTING_PERMISSION)
      },
      {
        pageName: SYSTEM_CONTROLS,
        value: convertToLang(props.translation[SYSTEM_PERMISSION], SYSTEM_PERMISSION)
      },

      {
        pageName: MANAGE_PASSWORD,
        value: convertToLang(props.translation[MANAGE_PASSWORDS], MANAGE_PASSWORDS)
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
    if (this.props.device_details.finalStatus === DEVICE_ACTIVATED) {
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
      device_id: isBase64(this.props.match.params.device_id),
      controls: this.props.controls,
      changedCtrls: this.props.changedCtrls
    });

    const device_id = isBase64(this.props.match.params.device_id);


    if (device_id !== '') {

      this.props.actionInProcess(this.props.socket, device_id);
      this.props.getDeviceDetails(device_id);
      this.props.getAppJobQueue(device_id);
      this.props.getDeviceApps(device_id);
      this.props.getProfiles(device_id);
      this.props.getPolicies(device_id);
      this.props.getDeviceHistories(device_id);
      this.props.getImeiHistory(device_id);
      this.props.getDealerApps();
      this.props.ackFinishedPushApps(this.props.socket, device_id);
      this.props.ackFinishedPullApps(this.props.socket, device_id);
      this.props.ackFinishedPolicy(this.props.socket, device_id);
      this.props.ackImeiChanged(this.props.socket, device_id);
      this.props.ackSinglePushApp(this.props.socket, device_id);
      this.props.ackSinglePullApp(this.props.socket, device_id);
      this.props.ackFinishedPolicyStep(this.props.socket, device_id);

      this.props.getActivities(device_id)

      // console.log('ack_finished_push_apps_' + device_id);
    }

    // this.props.endLoading();
    setTimeout(() => {
      this.props.endLoading();
    }, 2000);
    // window.addEventListener('hashchange', this.componentGracefulUnmount);
  }

  // componentGracefulUnmount = () => {
  //   console.log("COMPONENT UNMOUNT");
  //   window.removeEventListener('hashchange', this.componentGracefulUnmount);

  // }
  // componentWillUnmount() {
  //   this.componentGracefulUnmount()
  //   // this.props.clearState()
  // }

  componentDidUpdate(prevProps) {
    if (this.props.forceUpdate !== prevProps.forceUpdate || this.props.controls !== prevProps.controls || this.props.imei_list !== prevProps.imei_list || this.props.showMessage !== prevProps.showMessage) {
      // console.log('show message sate', this.props.showMessage)
      this.setState({
        controls: this.props.controls,
        changedCtrls: this.props.changedCtrls,
        imei_list: this.props.imei_list,
        showMessage: this.props.showMessage,
        messageText: this.props.messageText,
        messageType: this.props.messageType
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      // console.log('object, ', nextProps.showMessage)
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   // if (this.props.controls !== nextProps.controls) {
  //   //   this.setState({
  //   //     controls: nextProps.controls
  //   //   })
  //     // this.setState({
  //     //     pageName: nextProps.pageName
  //     // });

  //     // nextProps.showMessage(false);

  //     // this.setState({
  //     //     device_id: nextProps.match.params.device_id
  //     // });
  //     // const device_id = nextProps.match.params.device_id;
  //     // if (device_id !== '') {

  //     //     nextProps.getDeviceDetails(device_id);
  //     //     nextProps.getDeviceApps(device_id);
  //     //     nextProps.getProfiles();
  //     //     nextProps.getDeviceHistories(device_id);
  //     //     this.setState({
  //     //         syncStatus: this.props.device_details.is_sync
  //     //     })
  //     // }
  //     // this.props.endLoading();
  //     // setTimeout(() => {
  //     //     this.props.endLoading();
  //     // }, 2000);
  //   }
  // }

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
          isHistory={false}
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
        />
      );
    } else if (this.props.pageName === SYSTEM_CONTROLS && isSync) {
      return (<SystemControls

        controls={this.state.controls}
        handleCheckAllExtension={this.props.handleCheckAllExtension}
        handleControlCheck={this.props.handleControlCheck}
        handleMainSettingCheck={this.props.handleMainSettingCheck}
        guestAllExt={this.props.guestAllExt}
        encryptedAllExt={this.props.encryptedAllExt}
        checked_app_id={this.props.checked_app_id}
        secureSettingsMain={this.props.secureSettingsMain}

      />);
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

  applyActionButton = (visible = true) => {
    this.setState({
      showChangesModal: visible,
    })
  }
  applyActions = () => {
    let objIndex = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING);
    let app_list = this.props.app_list;
    if (objIndex >= 0) {

      let obData = {
        enable: this.props.extensions[objIndex].enable,
        encrypted: this.props.extensions[objIndex].encrypted,
        guest: this.props.extensions[objIndex].guest,
        label: this.props.extensions[objIndex].label,
        uniqueName: this.props.extensions[objIndex].uniqueName
      }
    }

    // console.log('main scure settings', this.props.controls.settings);
    if (this.props.controls.settings.length) {
      let index = this.props.controls.settings.findIndex(item => item.uniqueName === Main_SETTINGS)
      if (index >= 0) {
        app_list.push(this.props.controls.settings[index])
      }
    }

    if (this.props.extensions.length) {
      let index = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING)
      if (index >= 0) {
        app_list.push(this.props.extensions[index])
      }
    }

    this.props.applySetting(
      app_list, {
        adminPwd: this.props.adminPwd,
        guestPwd: this.props.guestPwd,
        encryptedPwd: this.props.encryptedPwd,
        duressPwd: this.props.duressPwd,
      },
      (objIndex !== undefined && objIndex !== -1) ? this.props.extensions[objIndex].subExtension : [],
      // this.state.controls.controls,
      this.state.changedCtrls,
      this.state.device_id,
      this.props.user_acc_id,
      null, null,
    );

    this.onCancel();
    let deviceId = atob(this.props.match.params.device_id);
    this.props.getDeviceApps(deviceId);
    this.props.getActivities(deviceId);

    // console.log('app after push ', app_list)
  }
  componentWillUnmount() {
    this.onBackHandler();
  }
  refreshDevice = (deviceId, resync = false) => {

    this.props.startLoading();

    if (deviceId === undefined || deviceId === null) {
      deviceId = isBase64(this.props.match.params.device_id);
    }
    // console.log('ref', deviceId)
    if (resync) {
      this.props.reSyncDevice(deviceId);
      setTimeout(() => {
        this.props.getDeviceDetails(deviceId);
        this.props.getAppJobQueue(deviceId);
        this.props.getDeviceApps(deviceId);
        this.props.getProfiles(deviceId);
        this.props.getPolicies(deviceId);
        this.props.getDeviceHistories(deviceId);
        this.props.getImeiHistory(deviceId);
        this.props.getDealerApps();
        this.props.getActivities(deviceId)
        this.onBackHandler();
        this.props.endLoading();
      }, 10000);
    } else {
      this.props.getDeviceDetails(deviceId);
      this.props.getAppJobQueue(deviceId);
      this.props.getDeviceApps(deviceId);
      this.props.getProfiles(deviceId);
      this.props.getPolicies(deviceId);
      this.props.getDeviceHistories(deviceId);
      this.props.getImeiHistory(deviceId);
      this.props.getDealerApps();
      this.props.getActivities(deviceId)
      this.onBackHandler();
      setTimeout(() => {
        this.props.endLoading();
      }, 3000);
    }
  }
  undoAction = () => {
    let pageName = this.props.pageName;

    if (pageName === APPS) {
      this.props.undoApplications()
    } else if (pageName === SECURE_SETTING) {
      this.props.undoExtensions()
    } else if (pageName === SYSTEM_CONTROLS) {
      this.props.undoControls()
    }
  }

  redoAction = () => {

    let pageName = this.props.pageName;
    // console.log('redo', pageName)
    if (pageName === APPS) {
      this.props.redoApplications()
    } else if (pageName === SECURE_SETTING) {
      this.props.redoExtensions()
    } else if (pageName === SYSTEM_CONTROLS) {
      this.props.redoControls()
    }
  }

  onCancel = () => {
    this.setState({ showChangesModal: false });
  }


  capitalizeFirstLetter = (string) => {
    if (string && string !== '' && string !== null && string !== 'N/A') {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return string
    }

  }

  render() {
    let finalStatus = (this.props.device_details.finalStatus === 'Activated' || this.props.device_details.finalStatus === '' || this.props.device_details.finalStatus === null || this.props.device_details.finalStatus === undefined) ? 'Active' : this.props.device_details.finalStatus;
    let color = getColor(finalStatus)
    let onlineStatus = this.props.device_details.online
    let onlineColor = (onlineStatus === 'offline') ? { color: 'red' } : { color: 'green' }
    let totalApps = (this.props.noOfApp_push_pull === undefined || this.props.noOfApp_push_pull === 0) ? this.props.noOfApp_push_pull_device : this.props.noOfApp_push_pull
    let completeApps = (this.props.noOfApp_pushed_pulled === undefined) ? 0 : this.props.noOfApp_pushed_pulled
    let completeStep = this.props.complete_policy_step;
    let policy_loading = (this.props.is_policy_applying === 1) ? (this.props.is_policy_finish === false) ? 1 : this.props.is_policy_process : this.props.is_policy_process
    return (
      (this.props.device_found) ?
        <div className="gutter-example">
          {/* || this.props.is_in_process || this.props.device_details.is_push_apps */}
          {this.props.isLoading ?
            <div className="gx-loader-view">
              <CircularProgress />
            </div> :
            (this.props.is_in_process || this.props.is_push_apps === 1 || policy_loading === 1) ?
              <div>

                <CircularProgress />

                {/* {(this.props.device_details.online === 'online') ?
                  null : <CircularProgress />
                } */}
                {/* <Modal
                  width='auto'
                  centered
                  maskClosable={false}
                  visible={(this.props.device_details.online === 'online') ? true : false}
                  footer={null}
                  closable={false}
                > */}
                {/* {(policy_loading === 1) ?

                    <Progress className='prog' type="circle" percent={(completeStep / 4) * 100} format={percent => `Step ${completeStep} of ${4}`} />
                    :
                    <Progress className='prog' type="circle" percent={(completeApps / totalApps) * 100} format={percent => `${completeApps} of ${totalApps}`} />
                  } */}
                {/* <Progress type="circle" percent={100} /> */}
                {/* </Modal> */}

                {/* <ProgressBar
                  total={}
                  completed={}
                /> */}
              </div>
              :
              <div>
                <Row gutter={16} type="flex" align="top">
                  <Col className="gutter-row left_bar" xs={24} sm={24} md={24} lg={24} xl={8} span={8}>
                    <DeviceSidebar
                      device_details={this.props.device_details}
                      refreshDevice={this.refreshDevice}
                      startLoading={this.props.startLoading}
                      endLoading={this.props.endLoading}
                      translation={this.props.translation}
                    />
                  </Col>
                  <Col className="gutter-row action_group" span={8} xs={24} sm={24} md={24} lg={24} xl={8}>
                    <Card>
                      <div className="gutter-box bordered deviceImg" alt="Mobile Image" style={{ backgroundImage: 'url(' + imgUrl + ')' }}>
                        <div className="status_bar">
                          <div className="col-md-6 col-xs-6 col-sm-6 active_st">
                            <h5><span style={color}>{this.capitalizeFirstLetter(finalStatus)}</span></h5>
                          </div>
                          <div className="col-md-6 col-xs-6 col-sm-6 offline_st">
                            <h5><span style={onlineColor}>{this.capitalizeFirstLetter(onlineStatus)}</span></h5>
                          </div>
                        </div>
                        {this.renderScreen()}
                        <DeviceActions
                          undoApplications={this.undoAction}
                          redoApplications={this.redoAction}
                          applyActionButton={this.applyActionButton}
                          clearApplications={this.props.clearApplications}
                          applyBtn={this.props.applyBtn}
                          undoBtn={this.props.undoBtn}
                          redoBtn={this.props.redoBtn}
                          clearBtn={this.props.clearBtn}
                          translation={this.props.translation}
                        />
                        <Button.Group className="nav_btn_grp">

                          <Button type="default" className="nav_btn" onClick={() => {
                            this.onBackHandler();
                          }} >
                            <Icon className="back_btn" component={BackBtn} />
                          </Button>
                          <Button type="default" className="nav_btn" onClick={() => {
                            this.changePage("main_menu")
                          }} />
                          {/* <Button type="default" icon="border" className="nav_btn" /> */}

                        </Button.Group>
                      </div>


                    </Card>
                  </Col>
                  <Col className="gutter-row right_bar" xs={24} sm={24} md={24} lg={24} xl={8}>
                    {/*  */}
                    <SideActions
                      translation={this.props.translation}
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
                      imei_list={this.props.imei_list}
                      apk_list={this.props.apk_list}
                    // applySetting = {this.applyActions}
                    />

                  </Col>
                </Row>
                <Modal
                  maskClosable={false}
                  title="Confirm new Settings to be sent to Device"
                  visible={this.state.showChangesModal}
                  onOk={this.applyActions}
                  onCancel={this.onCancel}
                  okText={convertToLang(this.props.translation[Button_Apply], Button_Apply)}
                >
                  <DeviceSettings
                    app_list={this.props.app_list}
                    extensions={this.props.extensions}
                    extensionUniqueName={SECURE_SETTING}
                    isAdminPwd={this.props.isAdminPwd}
                    isDuressPwd={this.props.isDuressPwd}
                    isEncryptedPwd={this.props.isEncryptedPwd}
                    isGuestPwd={this.props.isGuestPwd}
                    controls={{ 'controls': this.state.changedCtrls }}
                    showChangedControls={true}
                    translation={this.props.translation}
                  />
                </Modal>
              </div>}
          {/* {this.props.isLoading ?
          <div className="gx-loader-view">
            <CircularProgress />
          </div> : null} */}

          {this.state.showMessage === true ?
            (this.state.messageType === "error") ?
              error({
                title: this.state.messageText,
              })
              :
              (this.state.messageType === "success") ?
                success({
                  title: this.state.messageText,
                })
                : null : null}


        </div> : <h1>Device Not Found</h1>
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
    loadDeviceProfile: loadDeviceProfile,
    pushApps: pushApps,
    startLoading: startLoading,
    endLoading: endLoading,
    undoApplications: undoApps,
    redoApplications: redoApps,
    undoExtensions: undoExtensions,
    redoExtensions: redoExtensions,
    undoControls: undoControls,
    redoControls: redoControls,
    applySetting: applySetting,
    changePage: changePage,
    suspendDevice2: suspendDevice2,
    activateDevice2: activateDevice2,
    editDevice: editDevice,
    getDevicesList: getDevicesList,
    getAccIdFromDvcId: getAccIdFromDvcId,
    unlinkDevice: unlinkDevice,
    flagged: flagged,
    unflagged: unflagged,
    wipe: wipe,
    checkPass: checkPass,
    getImeiHistory: getImeiHistory,
    handleControlCheck: handleControlCheck,
    handleCheckAllExtension: handleCheckAllExtension,
    handleMainSettingCheck: handleMainSettingCheck,
    reSyncDevice: reSyncDevice,
    getDealerApps: getDealerApps,
    ackFinishedPullApps: ackFinishedPullApps,
    ackFinishedPushApps: ackFinishedPushApps,
    ackFinishedPolicy: ackFinishedPolicy,
    ackImeiChanged: ackImeiChanged,
    actionInProcess: actionInProcess,
    getActivities: getActivities,
    clearApplications: clearApplications,
    getAppJobQueue: getAppJobQueue,
    ackSinglePushApp: ackSinglePushApp,
    ackSinglePullApp: ackSinglePullApp,
    ackFinishedPolicyStep: ackFinishedPolicyStep,
    clearState: clearState
  }, dispatch);
}
var mapStateToProps = ({ routing, device_details, auth, socket, settings }) => {
  return {
    translation: settings.translation,
    auth: auth,
    socket: auth.socket,
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
    extensions: device_details.extensions,
    applyBtn: device_details.applyBtn,
    redoBtn: device_details.redoBtn,
    undoBtn: device_details.undoBtn,
    clearBtn: device_details.clearBtn,
    isAdminPwd: device_details.isAdminPwd,
    isGuestPwd: device_details.isGuestPwd,
    isEncryptedPwd: device_details.isEncryptedPwd,
    isDuressPwd: device_details.isDuressPwd,
    controls: device_details.controls,
    changedCtrls: device_details.changedCtrls,
    imei_list: device_details.imei_list,
    guestAllExt: device_details.guestAllExt,
    encryptedAllExt: device_details.encryptedAllExt,
    checked_app_id: device_details.checked_app_id,
    secureSettingsMain: device_details.secureSettingsMain,
    forceUpdate: device_details.forceUpdate,
    apk_list: device_details.apk_list,
    is_in_process: socket.is_in_process,
    is_push_apps: socket.is_push_apps,
    device_found: device_details.device_found,
    noOfApp_push_pull: socket.noOfApp_push_pull,
    noOfApp_pushed_pulled: socket.noOfApp_pushed_pulled,
    noOfApp_push_pull_device: device_details.noOfApp_push_pull,
    is_policy_process: socket.is_policy_process,
    complete_policy_step: socket.complete_policy_step,
    is_policy_applying: device_details.is_policy_process,
    is_policy_finish: socket.is_policy_finish
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDevice);