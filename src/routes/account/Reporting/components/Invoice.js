import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import styles from '../reporting.css'
import {convertToLang} from "../../../utils/commonUtils";

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Sr.#",
        dataIndex: 'sr',
        key: 'sr',
        align: "center",
        render: (text, record, index) => ++index,
      },

      {
        title: convertToLang(props.translation[''], "INVOICE ID"),
        align: "center",
        className: '',
        dataIndex: 'transection_data',
        key: 'transection_data',
      },

      {
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'transection_data',
        key: 'transection_data',
      },

      {
        title: convertToLang(props.translation[''], "DEALER ID"),
        align: "center",
        className: '',
        dataIndex: 'transection_data',
        key: 'transection_data',
      },

      {
        title: convertToLang(props.translation[''], "GENERATED AT"),
        align: "center",
        className: '',
        dataIndex: 'pkg_term',
        key: 'pkg_term',
      },

    ];
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log()
      let fromDate = values.from._d;
      let toDate = values.from._d;
      console.log('form', fromDate, toDate);
      if (!err) {

      }
    });
  };
  componentDidMount() {

  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = () => {

  };

  render() {
    // console.log(this.props.dealerList, "Dealer List");
    return (
      <Row>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Card style={{ height: '500px', paddingTop: '50px' }}>
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
              >
              </Form.Item>

              <Form.Item
                label="Dealer/Sdealer"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('dealer', {
                  initialValue: '',
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    {this.props.dealerList.map((dealer, index) => {
                      return (<Select.Option key={dealer.link_code} value={dealer.link_code}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="FROM (DATE) "
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
              >
                {this.props.form.getFieldDecorator('from', {
                  rules: [
                    {
                      required: false
                    }],
                })(
                  <DatePicker
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="TO (DATE)"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
              >
                {this.props.form.getFieldDecorator('to', {
                  rules: [
                    {
                      required: false
                    }],
                })(
                  <DatePicker
                    format="DD-MM-YYYY"
                    onChange={this.saveExpiryDate}
                    disabledDate={this.disabledDate}

                  />
                )}
              </Form.Item>
              <Form.Item className="edit_ftr_btn"
                         wrapperCol={{
                           xs: { span: 22, offset: 0 },
                         }}
              >
                <Button key="back" type="button" onClick={this.handleReset}>CANCEL</Button>
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>GENERATE</Button>
              </Form.Item>
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card style={{ height: '500px' }}>
            <Table
              columns={this.columns}
              dataSource={this.renderList()}
              bordered
              pagination={false}

            />
          </Card>
        </Col>
      </Row>
    )
  }
}

const WrappedAddDeviceForm = Form.create()(Invoice);
export default WrappedAddDeviceForm;
