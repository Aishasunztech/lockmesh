import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { convertToLang, generateExcel, generatePDF} from "../../../utils/commonUtils";
var fileName = 'payment_history_' + new Date().getTime()
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
        title: convertToLang(props.translation[''], "DEALER ID"),
        align: "center",
        className: '',
        dataIndex: 'user_id',
        key: 'user_id',
      },

      {
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
      },

      {
        title: convertToLang(props.translation[''], "TYPE"),
        align: "center",
        className: '',
        dataIndex: 'type',
        key: 'type',
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION TYPE"),
        align: "center",
        className: '',
        dataIndex: 'transection_type',
        key: 'transection_type',
      },

      {
        title: (
          <span>{convertToLang(props.translation[''], "CREDITS")}</span>
        ),
        align: 'center',
        dataIndex: 'credits',
        key: 'credits',
        className: 'row '
      },

      {
        title: (
          <span>{convertToLang(props.translation[''], "STATUS")}</span>
        ),
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        className: 'row '
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION DATE"),
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
      this.props.generatePaymentHistoryReport(values)
    });
  };

  componentDidMount() {

  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.paymentHistoryReport !== prevProps.paymentHistoryReport){
      this.setState({
        reportCard: true
      })

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "DEALER ID"), dataKey: "user_id" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "PRODUCT TYPE"), dataKey: "type" },
        { title: convertToLang(this.props.translation[''], "TRANSACTION TYPE"), dataKey: "transection_type" },
        { title: convertToLang(this.props.translation[''], "CREDITS"), dataKey: "credits" },
        { title: convertToLang(this.props.translation[''], "STATUS"), dataKey: "status" },
        { title: convertToLang(this.props.translation[''], "TRANSACTION DATE"), dataKey: "created_at" },
      ];

      rows = this.props.paymentHistoryReport.map((item, index) => {
        return {
          count: ++index,
          user_id: item.user_id,
          credits: item.credits,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          status: item.status,
          type: item.type,
          transection_type: item.transection_type,
          created_at: item.created_at
        }
      });
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
      return list.map((item, index) => {
        return {
          rowKey: index,
          key: item.id,
          sr: ++index,
          user_id: item.user_id,
          credits: item.credits,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          status: item.status,
          type: item.type,
          transection_type: item.transection_type,
          created_at: item.created_at
        }
      })
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
                      return (<Select.Option key={dealer.link_code} value={dealer.link_code}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="Product Type"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('type', {
                  initialValue: '',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    <Select.Option value='hardwares'>HARDWARES</Select.Option>
                    <Select.Option value='services'>SERVICES</Select.Option>
                    <Select.Option value='credits'>CREDITS</Select.Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="Transaction Type"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('transaction_type', {
                  initialValue: '',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    <Select.Option value='debit'>DEBIT</Select.Option>
                    <Select.Option value='credit'>CREDIT</Select.Option>
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
                <Button type="primary" htmlType="submit">GENERATE</Button>
              </Form.Item>
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card style={{ height: '500px', overflow: 'overlay'}}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Payment History Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Payment History Report', fileName)}}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName)}}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
              <Table
                columns={this.columns}
                dataSource={this.renderList(this.props.paymentHistoryReport)}
                bordered
                pagination={false}
                scroll={{x:true}}
                  />
              </Fragment>
            : null }
          </Card>
        </Col>
      </Row>
    )
  }
}

const WrappedAddDeviceForm = Form.create()(PaymentHistory);
export default WrappedAddDeviceForm;