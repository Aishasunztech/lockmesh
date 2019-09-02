import React, { Component, Fragment, Typography } from 'react';
import { List, Switch, Col, Row } from "antd";

import { SYSTEM_PERMISSION, NOT_AVAILABLE, ADMIN, ANDROID_SETTING_PERMISSION } from '../../../constants/Constants';


import { Main_SETTINGS } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';

export default class SystemControls extends Component {
  constructor(props) {
    super(props)
    this.state = {
      controls: props.controls.controls,
      settings: props.controls.settings,
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

  // componentDidUpdate(prevProps) {
  //   console.log(this.props.controls, 'testig sdf')
  //   if (this.props !== prevProps) {
  //     this.setState({
  //       controls: this.props.controls.controls,
  //       settings: this.props.controls.settings,
  //     })
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    console.log('SystemControls.componentWillReceiveProps: ', nextProps)
    if (this.props.controls !== nextProps.controls) {
      this.setState({
        controls: nextProps.controls.controls,
        settings: nextProps.controls.settings,
      })
    }
  }

  handleChecked = (value, controlName) => {
    console.log("handleCheck permission:", value, controlName);

    this.props.handleControlCheck(value, controlName)
  }

  handleMainSettingCheck = (value, controlName) => {
    this.props.handleMainSettingCheck(value, controlName, Main_SETTINGS)

  }
  renderSystemPermissions = () => {
    console.log("controls:", this.state.controls)
    return this.state.controls.map(sysPermission => {
      return (
        <List.Item
          key={sysPermission.setting_name}
        >
          <div className="row width_100">
            <div className="col-md-10 col-sm-10 col-xs-10">
              <span>{sysPermission.setting_name}</span>
            </div>
            <div className="col-md-2 col-sm-2 col-xs-2">
              <Switch
                checked={sysPermission.setting_status === 1 || sysPermission.setting_status === true ? true : false}
                size="small"
                onClick={(e) => {
                  this.handleChecked(e, sysPermission.setting_name);
                }}
              />
            </div>
          </div>
        </List.Item>
      );
    })
  }

  render() {
    console.log("systemControls.render()");
    let objIndex = -1;
    if (this.state.settings && this.state.settings.length) {
      objIndex = this.state.settings.findIndex(item => item.uniqueName === Main_SETTINGS)
    }

    if (this.state.controls) {

      return (
        <Fragment>
          <div style={{ height: 415, overflow: 'overlay' }} >
            {/* this is android main settings with guest, encrypted and enable toggles */}
            {
              (this.props.auth.authUser.type === ADMIN) ?
                (this.state.settings && this.state.settings.length && objIndex >= 0) ?
                  <Fragment>
                    <Row className="first_head">
                      <Col span={4} className="pr-0">
                        <img src={require("assets/images/setting.png")} />
                      </Col>
                      <Col span={20} className="pl-4 pr-0">
                        <h5>{convertToLang(this.props.translation[ANDROID_SETTING_PERMISSION], "Android Settings Permission")}</h5>
                      </Col>
                    </Row>
                    <div className="row width_100 m-0 sec_head1">
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Guest</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "guest");
                        }} checked={this.state.settings[objIndex].guest === 1 || this.state.settings[objIndex].guest === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Encrypt</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "encrypted");
                        }} checked={this.state.settings[objIndex].encrypted === 1 || this.state.settings[objIndex].encrypted === true ? true : false} size="small" />
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                        <span>Enable</span>
                        <Switch onClick={(e) => {
                          this.handleMainSettingCheck(e, "enable");
                        }} checked={this.state.settings[objIndex].enable === 1 || this.state.settings[objIndex].enable === true ? true : false} size="small" />
                      </div>
                    </div>
                  </Fragment>
                  : null
                : null
            }

            {/* Android System hardware permissions */}
            {
              (this.state.controls.length) ?
                <List>
                  {this.renderSystemPermissions()}
                </List>
                :
                <h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")} <br></br> {convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</a></h1>
            }

          </div>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <h1 className="not_syn_txt"><a>{convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")} <br></br> {convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</a></h1>
        </Fragment>
      )
    }


  }
}
