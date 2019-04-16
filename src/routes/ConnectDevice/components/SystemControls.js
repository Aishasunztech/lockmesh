import React, { Component, Fragment, Typography } from 'react';
import { List, Switch, Col, Row } from "antd";

export default class SystemControls extends Component {
  render() {
    return (
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
                  <Switch defaultChecked size="small" />
                </div>
              </div>
            </List.Item>
            <List.Item>
              <div className="row width_100">
                <div className="col-md-10 col-sm-10 col-xs-10">
                  <span>Bluetooth</span>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <Switch size="small" />
                </div>
              </div>
            </List.Item>
            <List.Item>
              <div className="row width_100">
                <div className="col-md-10 col-sm-10 col-xs-10">
                  <span>Hotspot</span>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <Switch defaultChecked size="small" />
                </div>
              </div>
            </List.Item>
            <List.Item>
              <div className="row width_100">
                <div className="col-md-10 col-sm-10 col-xs-10">
                  <span>Location Services</span>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <Switch size="small" />
                </div>
              </div>
            </List.Item>
            <List.Item>
              <div className="row width_100">
                <div className="col-md-10 col-sm-10 col-xs-10">
                  <span>Block Calls</span>
                </div>
                <div className="col-md-2 col-sm-2 col-xs-2">
                  <Switch defaultChecked size="small" />
                </div>
              </div>
            </List.Item>
          </List>
        </div>
      </Fragment>
    )
  }
}
