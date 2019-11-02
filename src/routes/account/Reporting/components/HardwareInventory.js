import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment, { now } from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { convertToLang, generatePDF, generateExcel, getDateFromTimestamp } from "../../../utils/commonUtils";
let fileName = 'hardware_report_' + new Date().getTime()
var columns;
var rows;

class PaymentHistory extends Component {
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
        title: convertToLang(props.translation[''], "HARDWARE"),
        align: "center",
        className: '',
        dataIndex: 'hardware',
        key: 'hardware',
      },

      {
        title: convertToLang(props.translation[''], "DEALER ID"),
        align: "center",
        className: '',
        dataIndex: 'dealer_id',
        key: 'dealer_id',
      },

      {
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
      },

      {
        title: convertToLang(props.translation[''], "CREATED AT"),
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
      },
    ];

    this.state = {
      reportCard: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.generateHardwareReport(values)
    });
  };

  componentDidMount() {

  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.hardwareReport !== prevProps.hardwareReport) {
      this.setState({
        reportCard: true
      })

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "DEALER ID"), dataKey: "dealer_id" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "USER PAYMENT STATUS"), dataKey: "hardware" },
        { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
      ];

      rows = this.props.hardwareReport.map((item, index) => {
        return {
          count: ++index,
          dealer_id: item.dealer_id,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          hardware: item.dealer_id,
          created_at: getDateFromTimestamp(item.created_at)
        }
      })

    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = (list) => {
    if (list) {
      let data = []
      let counter = 1;
      list.map((item, index) => {
        // let hardwares = JSON.parse(item.hardware_data)
        // hardwares.map((hardware, i) => {
          data.push( {
            rowKey: counter++,
            key: counter++,
            sr: counter++,
            dealer_id: item.dealer_id,
            device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
            hardware: item.hardware_name,
            created_at: getDateFromTimestamp(item.created_at)
          })
        })
      // })
      return data;
    }
  };

  render() {
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
                label="Hardware"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('hardware', {
                  initialValue: '',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    {this.props.hardwares.map((hardware, index) => {
                      return (<Select.Option key={hardware.hardware_name} value={hardware.hardware_name}>{hardware.hardware_name}</Select.Option>)
                    })}
                  </Select>
                )}
              </Form.Item>

              {(this.props.user.type === 'sdealer') ?

                <Form.Item style={{ marginBottom: 0 }}
                >
                  {this.props.form.getFieldDecorator('dealer', {
                    initialValue: this.props.user.dealerId,
                  })(

                    <Input type='hidden' disabled />
                  )}
                </Form.Item>

                : <Form.Item
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
                      <Select.Option value={this.props.user.dealerId}>My Report</Select.Option>
                      {this.props.dealerList.map((dealer, index) => {
                        return (<Select.Option key={dealer.dealer_id} value={dealer.dealer_id}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                      })}
                    </Select>
                  )}
                </Form.Item>
              }

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
                      required: false,
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
                <Button type="primary" htmlType="submit">GENERATE</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card style={{ height: '500px', overflow: 'scroll' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Hardware Invenotory Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Invoice Report', fileName);}}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName)}}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
              <Table
                columns={this.columns}
                dataSource={this.renderList(this.props.hardwareReport)}
                bordered
                pagination={false}

                />
              </Fragment>
              : null}
          </Card>
        </Col>
      </Row>
    )
  }
}

const WrappedAddDeviceForm = Form.create()(PaymentHistory);
export default WrappedAddDeviceForm;
