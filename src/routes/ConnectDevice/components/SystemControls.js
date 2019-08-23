import React, { Component, Fragment, Typography } from 'react';
import { List, Switch, Col, Row } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SYSTEM_PERMISSION, NOT_AVAILABLE } from '../../../constants/Constants';
import {
  handleControlCheck,
  handleCheckAllExtension,
  handleMainSettingCheck

} from "../../../appRedux/actions/ConnectDevice";

import { Main_SETTINGS } from '../../../constants/Constants';
import { HOTSPOT, BLUETOOTH, WIFI, SCREENSHOTS, BLOCK_CALLS } from '../../../constants/DeviceConstants';
import { convertToLang } from '../../utils/commonUtils';

export default class SystemControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      controls: {},
      settings: [],
    }
  }

  componentDidMount() {
    if (this.props.controls) {
      this.setState({
        controls: this.props.controls.controls,
        settings: this.props.controls.settings,
        pageName: this.props.pageName,
        // secureSettingsMain: this.props.secureSettingsMain
      })
    }
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps.controls, 'testig sdf')
    if (this.props !== prevProps) {
      this.setState({
        controls: this.props.controls.controls,
        settings: this.props.controls.settings,
      })
    }
  }

  componentWillReceiveProps(nextprops) {
    // console.log('new props', nextprops)
    if (this.props.controls && (this.props.controls !== nextprops.controls)) {
      this.setState({
        controls: nextprops.controls.controls,
        settings: nextprops.controls.settings,

      })
    }
  }

  handleChecked = (value, controlName, main = null) => {
    this.props.handleControlCheck(value, controlName, main)
  }

  handleMainSettingCheck = (value, controlName) => {
    this.props.handleMainSettingCheck(value, controlName, Main_SETTINGS)

  }

  render() {
    // console.log('consroslss sdfsd fsd ', this.state.controls);
    let objindex = -1;
    // console.log('object settings', this.state.settings)
    // if(this.state.settings !== undefined && this.state.settings && this.state.controls.length){
    if (this.state.settings !== undefined && this.state.settings && this.state.settings !== []) {
      objindex = this.state.settings.findIndex(item => item.uniqueName === Main_SETTINGS)
    }
    // console.log('object settings', objindex)
    if (this.state.controls) {

      return (
        Object.entries(this.state.controls).length > 0 && this.state.controls.constructor === Object ?
          <Fragment>
            <div style={{ height: 400, overflow: 'overlay', borderTop: '1px solid #e8e8e8' }} >
              <List>
                {/* {
                  (this.state.settings !== undefined && this.state.settings && this.state.settings !== [] && objindex>=0) ?
                    <div className="row width_100 m-0 sec_head1">
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Guest</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "guest");
                        }} checked={this.state.settings[objindex].guest === 1 || this.state.settings[objindex].guest === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Encrypt</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "encrypted");
                        }} checked={this.state.settings[objindex].encrypted === 1 || this.state.settings[objindex].encrypted === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Enable</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "enable");
                        }} checked={this.state.settings[objindex].enable === 1 || this.state.settings[objindex].enable === true ? true : false} size="small" />
                      </div>
                    </div>
                    : false
                } */}

                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[WIFI], "Wifi")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.wifi_status === 1 || this.state.controls.wifi_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "wifi_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[BLUETOOTH], "Bluetooth")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.bluetooth_status === 1 || this.state.controls.bluetooth_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "bluetooth_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "Bluetooth File Sharing")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.bluetooth_sharing_status === 1 || this.state.controls.bluetooth_sharing_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "bluetooth_sharing_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[HOTSPOT], "Hotspot")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.hotspot_status === 1 || this.state.controls.hotspot_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "hotspot_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>

                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "Location Services")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.location_status === 1 || this.state.controls.location_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "location_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>


                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[SCREENSHOTS], "Screen Capture")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.screenshot_status === 1 || this.state.controls.screenshot_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "screenshot_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[BLOCK_CALLS], "Block Calls")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.call_status === 1 || this.state.controls.call_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "call_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "NFC")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.nfc_status === 1 || this.state.controls.nfc_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "nfc_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>

                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "Camera")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.camera_status === 1 || this.state.controls.camera_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "camera_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "Mic")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.mic_status === 1 || this.state.controls.mic_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "mic_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
                <List.Item>
                  <div className="row width_100">
                    <div className="col-md-10 col-sm-10 col-xs-10">
                      <span>{convertToLang(this.props.translation[""], "Speaker")}</span>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-2">
                      <Switch checked={this.state.controls.speaker_status === 1 || this.state.controls.speaker_status === true ? true : false} size="small"
                        onClick={(e) => {
                          // console.log("guest", e);
                          this.handleChecked(e, "speaker_status");
                        }}
                      />
                    </div>
                  </div>
                </List.Item>
              </List>
            </div>
          </Fragment> :
          <Fragment>
            <h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")} <br></br> {convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</a></h1>
          </Fragment>
      )
    }
    else {
      return (
        <Fragment>
          <h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")} <br></br> {convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</a></h1>
        </Fragment>
      )
    }
    // }
    // else{
    //   return(
    //     <Fragment>
    //         <h1 className="not_syn_txt"><a>{SYSTEM_PERMISSION} <br></br> Not Available</a></h1>
    //       </Fragment>
    //   )
    // }

  }
}


// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     // showHistoryModal: showHistoryModal
//     handleControlCheck: handleControlCheck,
//     handleCheckAllExtension: handleCheckAllExtension,
//     handleMainSettingCheck: handleMainSettingCheck,
//     // handleCheckAll: handleCheckAll
//   }, dispatch);
// }


// var mapStateToProps = ({ device_details }, ownProps) => {
//   // console.log(device_details, "applist ownprops", ownProps);
//   const pageName = ownProps.pageName;

//   let controls = device_details.controls;
//   console.log("controls are", controls);

//     return {
//       controls: controls,
//       guestAllExt: device_details.guestAllExt,
//       encryptedAllExt: device_details.encryptedAllExt,
//       checked_app_id: device_details.checked_app_id,
//       secureSettingsMain: device_details.secureSettingsMain,
//     }

// }

// export default connect(mapStateToProps, mapDispatchToProps)(SystemControls);
