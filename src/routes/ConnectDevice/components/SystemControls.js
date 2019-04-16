import React, { Component, Fragment } from 'react';
import { Card, Row, Col, List, Button, message } from "antd";

const mainItem1 = [
  {
    pageName: "apps",
    value: 'Application Permission'
  },
  {
    pageName: "setting_app_permissions",
    value: 'Secure Settings Permission'
  },
  {
    pageName: "system_controls",
    value: 'System Controls'
  },
  {
    pageName: "Manage_password",
    value: 'Manage Passwords'
  },

]

export default class SystemControls extends Component {
  render() {
    return (
      <Fragment>
        <List
          className="dev_main_menu"
          size="small"
          dataSource={mainItem1}
        />
      </Fragment>
    )
  }
}
