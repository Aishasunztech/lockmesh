import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table } from 'antd';
const dataSource = [
  {
    key: '1',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '2',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '3',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '4',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '5',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '6',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }
];

const columns = [{
  title: 'In-App Menu Display',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Guest',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Encrypted',
  dataIndex: 'address',
  key: 'address',
}];


export default class SettingAppPermissions extends Component {
  render() {
    return (
      <Fragment>
        <Row className="first_head">
          <Col span={7} className="pr-0">
            <img src={require("assets/images/setting.png")} />
          </Col>
          <Col span={17}>
            <h5>Secure Settings Permission</h5>
          </Col>
        </Row>
        <Row className="sec_head">
          <Col span={8}>
            <span>Guest </span> <Switch defaultChecked size="small" />
          </Col>
          <Col span={8}>
            <span>Encrypt </span> <Switch defaultChecked size="small" />
          </Col>
          <Col span={8}>
            <span>Enable </span> <Switch defaultChecked size="small" />
          </Col>
        </Row>
        <div className="sec_set_table">
          <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 263 }} />
        </div>

      </Fragment>
    )
  }
}
