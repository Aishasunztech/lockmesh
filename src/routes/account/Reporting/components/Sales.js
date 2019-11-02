import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import styles from '../reporting.css'
import { convertToLang, generatePDF, generateExcel} from "../../../utils/commonUtils";
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";

import { BASE_URL
} from "../../../../constants/Application";
var columns;
var rows;
var fileName = 'sales_' + new Date().getTime()

class Sales extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
      },

      {
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
      },

      {
        title: convertToLang(props.translation[''], "DEALER ID"),
        align: "center",
        className: '',
        dataIndex: 'dealer_id',
        key: 'dealer_id',
      },

      {
        title: convertToLang(props.translation[''], "TYPE"),
        align: "center",
        className: '',
        dataIndex: 'type',
        key: 'type',
      },

      {
        title: convertToLang(props.translation[''], "NAME"),
        align: "center",
        className: '',
        dataIndex: 'name',
        key: 'name',
      },

      {
        title: convertToLang(props.translation[''], "COST PRICE (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'cost_price',
        key: 'cost_price',
      },

      {
        title: convertToLang(props.translation[''], "SALE PRICE (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'sale_price',
        key: 'sale_price',
      },

      {
        title: convertToLang(props.translation[''], "PROFIT/LOSS (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'profit_loss',
        key: 'profit_loss',
      },

      {
        title: convertToLang(props.translation[''], "CREATED AT"),
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
        sortDirections: ['ascend', 'descend'],
        defaultSortOrder: 'descend'
      },
    ];

    this.state = {
      reportCard: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.generateSalesReport(values)
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.salesReport !== prevProps.salesReport){
      this.setState({
        reportCard:  true
      })

      rows = this.props.salesReport.map((item, index) => {
        return {
          count: ++index,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          dealer_id: item.dealer_id ? item.dealer_id : 'N/A',
          created_at: item.created_at ? item.created_at : 'N/A',
        }
      });

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "USER PAYMENT STATUS"), dataKey: "end_user_payment_status" },
        { title: convertToLang(this.props.translation[''], "GENERATED AT"), dataKey: "created_at" },
      ];
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = (list) => {

    let data = [];
    if (list) {
      list.map((item, index) => {
        data.push({
          'key': index,
          'count': ++index,
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_id': item.dealer_id ? item.dealer_id : 'N/A',
          'type': item.type ? item.type : 'N/A',
          'name': item.name ? item.name : 'N/A',
          'cost_price': item.cost_price ? item.cost_price : 'N/A',
          'sale_price': item.sale_price ? item.sale_price : 'N/A',
          'profit_loss': item.profit_loss ? item.profit_loss : 'N/A',
          'created_at': item.created_at ? item.created_at : 'N/A',
        })
      });
    }
    return data;
  };

  createPDF = () => {
    var columns = [
      { title: '#', dataKey: "count" },
      { title: convertToLang(this.props.translation[''], "INVOICE ID"), dataKey: "invoice_id" },
      { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
      { title: convertToLang(this.props.translation[''], "USER PAYMENT STATUS"), dataKey: "end_user_payment_status" },
      { title: convertToLang(this.props.translation[''], "GENERATED AT"), dataKey: "created_at" },
    ];

    var rows = this.props.salesReport.map((item, index) => {
      return {
        count: ++index,
        invoice_id: item.inv_no ? item.inv_no : 'N/A',
        device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
        dealer_id: item.dealer_id ? item.dealer_id : 'N/A',
        created_at: item.created_at ? item.created_at : 'N/A',
        end_user_payment_status: item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
      }
    });

    let fileName = 'invoice_' + new Date().getTime()
    generatePDF(columns, rows, 'Sales Report', fileName);
  }

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
                label="Product Type"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('product_type', {
                  initialValue: 'ALL',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value='ALL'>ALL</Select.Option>
                    <Select.Option value='PACKAGES'>PACKAGES</Select.Option>
                    <Select.Option value='PRODUCTS'>PRODUCTS</Select.Option>
                    <Select.Option value='HARDWARES'>HARDWARES</Select.Option>
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
          <Card style={{ height: '500px', overflow: 'scroll' }}>
            {(this.state.reportCard) ?
              <Fragment>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <h3>Sales Report</h3>
                </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Invoice Report', fileName) }}>Download PDF</Button>
                    <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                    </div>
                </Col>
              </Row>
            <Table
              columns={this.columns}
              dataSource={this.renderList(this.props.salesReport)}
              bordered
              pagination={false}
                />
              </Fragment>
            : null }
          </Card>
        </Col>
      </Row>
    )
  }
}

const WrappedAddDeviceForm = Form.create()(Sales);
export default WrappedAddDeviceForm;
