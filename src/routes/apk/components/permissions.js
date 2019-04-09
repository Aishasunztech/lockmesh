import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Input } from "antd";

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];

export default class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDealersModal: false,
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box"><h2>Permission List</h2> </div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" type="primary">Add</Button></div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" type="primary">Select All</Button></div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box search_heading">
              <Input.Search placeholder="Dealer Email" style={{ marginBottom: 0 }} />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Table
            columns={columns}
            dataSource={data}
          />
        </Row>
        <Modal
          title="Dealers Permission"
          visible={this.state.showDealersModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {/* <Table columns={columns} dataSource={data} /> */}
        </Modal>
      </Fragment>
    )
  }
}
