import React, { Component, Fragment } from 'react';
import { Card, Row, Col, List, Button, message } from "antd";


export default class SystemControls extends Component {
  render() {
    const mainItem1 = [
     
    ]
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
