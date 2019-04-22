import React, { Component, Fragment, Typography } from 'react';
import { List, Switch, Col, Row } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {SYSTEM_PERMISSION} from '../../../constants/Constants';
import {
  handleControlCheck,
  handleCheckAllExtension

} from "../../../appRedux/actions/ConnectDevice";

class SystemControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      controls: [],
    }
  }


  componentDidMount() {
    if (this.props.controls) {
      this.setState({
        controls: this.props.controls,
        pageName: this.props.pageName
      })
    }

  }

  componentWillReceiveProps(nextprops) {

    if (this.props.controls && (this.props.controls !== nextprops.controls)) {
      // alert("hello");
      this.setState({
        controls: nextprops.controls,
        // encryptedAllExt: nextprops.encryptedAllExt,
        // guestAllExt: nextprops.guestAllExt
      })
    }

  }

  handleChecked = (value, controlName) => {
    this.props.handleControlCheck(value, controlName)
  }



  render() {
    return (
      this.state.controls.length ?
        <Fragment>
          <div>
            <List>
              <div className="row width_100 m-0 sec_head1">
                <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                  <span>Guest</span>
                  <Switch defaultChecked size="small" />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                  <span>Encrypt</span>
                  <Switch size="small" />
                </div>
                <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                  <span>Enable</span>
                  <Switch defaultChecked size="small" />
                </div>
              </div>
              <List.Item>
                <div className="row width_100">
                  <div className="col-md-10 col-sm-10 col-xs-10">
                    <span>Wifi</span>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2">
                    <Switch checked={this.state.controls.wifi_status} size="small"
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
                    <span>Bluetooth</span>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2">
                    <Switch checked={this.state.controls.bluetooth_status} size="small"
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
                    <span>Hotspot</span>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2">
                    <Switch checked={this.state.controls.hotspot_status} size="small"
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
                    <span>Screenshots</span>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2">
                    <Switch checked={this.state.controls.screenshot_status} size="small"
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
                    <span>Block Calls</span>
                  </div>
                  <div className="col-md-2 col-sm-2 col-xs-2">
                    <Switch checked={this.state.controls.call_status} size="small"
                      onClick={(e) => {
                        // console.log("guest", e);
                        this.handleChecked(e, "call_status");
                      }}
                    />
                  </div>
                </div>
              </List.Item>
            </List>
          </div>
        </Fragment> :
        <Fragment>
          <h1 class="not_syn_txt"><a>{SYSTEM_PERMISSION} <br></br> Not Available</a></h1>
        </Fragment>
    )
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // showHistoryModal: showHistoryModal
    handleControlCheck: handleControlCheck,
    handleCheckAllExtension: handleCheckAllExtension
    // handleCheckAll: handleCheckAll
  }, dispatch);
}


var mapStateToProps = ({ device_details }, ownProps) => {
  // console.log(device_details, "applist ownprops", ownProps);
  const pageName = ownProps.pageName;

  let controls = device_details.controls;
  console.log("controls are", controls);

  if (controls !== undefined) {
    return {
      isExtension: true,
      controls: controls,
      guestAllExt: device_details.guestAllExt,
      encryptedAllExt: device_details.encryptedAllExt,
      checked_app_id: device_details.checked_app_id,
    }
  } else {
    return {
      isExtension: false
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SystemControls);
