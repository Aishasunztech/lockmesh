import React, { Component, Fragment } from 'react'
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Table, Tabs } from "antd";
import moment from 'moment';
import { convertToLang, generatePDF, generateExcel, getDateFromTimestamp } from "../../../utils/commonUtils";
import { TAB_CHAT_ID, TAB_PGP_EMAIL, TAB_SIM_ID, TAB_VPN } from "../../../../constants/TabConstants";
import {
  LABEL_DATA_CHAT_ID,
  LABEL_DATA_CREATED_AT, LABEL_DATA_PGP_EMAIL,
  LABEL_DATA_SIM_ID,
  LABEL_DATA_VPN
} from "../../../../constants/LabelConstants";
import {DEVICE_PRE_ACTIVATION} from "../../../../constants/Constants";
const TabPane = Tabs.TabPane;
var columns   = [];
var rows      = [];
var fileName  = '';
var title     = 'Product Inventory Report';

class ProductInventory extends Component {
  constructor(props) {
    super(props);

    const columnsSimIDs = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_SIM_ID], "SIM ID"),
        dataIndex: 'sim_id',
        key: 'sim_id',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[''], "START DATE"),
        dataIndex: 'start_date',
        key: 'start_date',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[''], "EXPIRY DATE"),
        dataIndex: 'expiry_date',
        key: 'expiry_date',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        className: '',
      },
    ];

    const columnsChatIDs = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_CHAT_ID], "CHAT ID"),
        dataIndex: 'chat_id',
        key: 'chat_id',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        className: '',
      },
    ];

    const columnsVpn = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
      },
      {
        title: convertToLang(props.translation[''], "VPN ID"),
        dataIndex: 'vpn_id',
        key: 'vpn_id',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[''], "START DATE"),
        dataIndex: 'start_date',
        key: 'start_date',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[''], "END DATE"),
        dataIndex: 'end_date',
        key: 'end_date',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        className: '',
      },
    ];

    const columnsPgpemails = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL"),
        dataIndex: 'pgp_email',
        key: 'pgp_email',
        align: 'center',
        className: '',
      },
      {
        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        className: '',
      },

    ];

    this.state = {
      productType: '',
      reportCard: false,
      columns: [],
      columnsChatIDs: columnsChatIDs,
      columnsPgpemails: columnsPgpemails,
      columnsSimIDs: columnsSimIDs,
      columnsVpn: columnsVpn,
      pagination: 10,
      tabselect: 'all',
      innerTabSelect: '1',
      reportFormData: {}
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.state.reportFormData = values;
      this.props.generateProductReport(values)

    });
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.productReport !== prevProps.productReport) {
      if (this.props.productType === 'ALL' || this.props.productType === 'CHAT') {
        this.setState({
          columns: this.state.columnsChatIDs,
          innerTabSelect: '1'
        })
      } else if (this.props.productType === 'ALL' || this.props.productType === 'PGP') {
        this.setState({
          columns: this.state.columnsPgpemails,
          innerTabSelect: '2'
        })
      } else if (this.props.productType === 'ALL' || this.props.productType === 'SIM') {
        this.setState({
          columns: this.state.columnsSimIDs,
          innerTabSelect: '3'
        })
      } else if (this.props.productType === 'ALL' || this.props.productType === 'VPN') {
        this.setState({
          columns: this.state.columnsVpn,
          innerTabSelect: '4'
        })
      }

      this.setState({
        reportCard: true,
        productType: this.props.productType
      });

      if (this.props.productReport.CHAT && this.state.innerTabSelect === '1') {
        this.props.productReport.CHAT.map((item, index) => {
          rows.push({
            'count': ++index,
            'chat_id': item.chat_id ? item.chat_id : 'N/A',
            'used': item.used == 1 ? 'USED' : 'UNUSED',
            'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
          })
        });

        columns.push(
          { title: '#', dataKey: "count" },
          { title: convertToLang(this.props.translation[''], "CHAT ID"), dataKey: "chat_id" },
          { title: convertToLang(this.props.translation[''], "USED"), dataKey: "used" },
          { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
        )
        fileName  = 'product_inventory_CHAT_' + new Date().getTime();

      } else if (this.props.productReport.PGP && this.state.innerTabSelect === '2') {
        this.props.productReport.PGP.map((item, index) => {
          rows.push({
            'count': ++index,
            'used': item.used == 1 ? 'USED' : 'UNUSED',
            'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
            'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
          })
        });
        columns.push(
          { title: '#', dataKey: "count" },
          { title: convertToLang(this.props.translation[''], "PGP EMAIL"), dataKey: "pgp_email" },
          { title: convertToLang(this.props.translation[''], "USED"), dataKey: "used" },
          { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
        )
        fileName  = 'product_inventory_PGP_' + new Date().getTime();

      } else if (this.props.productReport.SIM && this.state.innerTabSelect === '3') {
        this.props.productReport.SIM.map((item, index) => {
          rows.push({
            'count': ++index,
            'used': item.used == 1 ? 'USED' : 'UNUSED',
            'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
            'start_date': item.start_date ? item.start_date : 'N/A',
            'expiry_date': item.expiry_date ? item.expiry_date : 'N/A',
            'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
          })
        });
        columns.push(
          { title: '#', dataKey: "count" },
          { title: convertToLang(this.props.translation[''], "SIM"), dataKey: "sim_id" },
          { title: convertToLang(this.props.translation[''], "USED"), dataKey: "used" },
          { title: convertToLang(this.props.translation[''], "START DATE"), dataKey: "start_date" },
          { title: convertToLang(this.props.translation[''], "EXPIRY DATE"), dataKey: "expiry_date" },
          { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
        )

        fileName  = 'product_inventory_SIM_' + new Date().getTime();
      } else if (this.props.productReport.VPN && this.state.innerTabSelect === '4') {
        this.props.productReport.VPN.map((item, index) => {
          rows.push({
            'count': ++index,
            'vpn_id': item.vpn_id ? item.vpn_id : 'N/A',
            'dealer_id': item.dealer_id ? item.dealer_id : 'N/A',
            'start_date': item.start_date ? item.start_date : 'N/A',
            'end_date': item.end_date ? item.end_date : 'N/A',
            'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
          })
        });
        columns.push(
          { title: '#', dataKey: "count" },
          { title: convertToLang(this.props.translation[''], "CHAT ID"), dataKey: "vpn_id" },
          { title: convertToLang(this.props.translation[''], "DEALER ID"), dataKey: "dealer_id" },
          { title: convertToLang(this.props.translation[''], "START DATE"), dataKey: "start_date" },
          { title: convertToLang(this.props.translation[''], "END DATE"), dataKey: "end_date" },
          { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
        )
        fileName  = 'product_inventory_VPN_' + new Date().getTime();
      }
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  handleChangeCardTabs = (value) => {

    switch (value) {
      case '1':
        this.setState({
          columns: this.state.columnsChatIDs,
          innerTabSelect: '1'
        });
        break;

      case '2':
        this.setState({
          columns: this.state.columnsPgpemails,
          innerTabSelect: '2'
        });

        break;
      case "3":
        this.setState({
          columns: this.state.columnsSimIDs,
          innerTabSelect: '3'
        });
        break;
      case '4':
        this.setState({
          columns: this.state.columnsVpn,
          innerTabSelect: '4'
        });
        break;
      default:
        this.setState({
          columns: this.state.columnsChatIDs,
          innerTabSelect: '1'
        });
        break;
    }
  };

  renderList(list) {
    let data = [];
    let i = 0;

    if (list.CHAT && this.state.innerTabSelect === '1') {
      list.CHAT.map((item, index) => {
        data.push({
          'row_key': `${i}Key`,
          'count': ++i,
          'chat_id': item.chat_id ? item.chat_id : 'N/A',
          'used': item.used ? item.used : 'N/A',
          'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
        })
      });
    } else if (list.PGP && this.state.innerTabSelect === '2') {
      list.PGP.map((item, index) => {
        data.push({
          'row_key': `${i}Key`,
          'count': ++i,
          'used': item.used ? item.used : 'N/A',
          'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
          'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
        })
      });
    } else if (list.SIM && this.state.innerTabSelect === '3') {
      list.SIM.map((item, index) => {
        data.push({
          'row_key': `${i}Key`,
          'count': ++i,
          'used': item.used ? item.used : 'N/A',
          'sim_id': item.sim_id ? item.sim_id : 'N/A',
          'start_date': item.start_date ? item.start_date : 'N/A',
          'expiry_date': item.expiry_date ? item.expiry_date : 'N/A',
          'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
        })
      });
    } else if (list.VPN && this.state.innerTabSelect === '4') {
      list.VPN.map((item, index) => {
        data.push({
          'row_key': `${i}Key`,
          'count': ++i,
          'used': item.used ? item.used : 'N/A',
          'dealer_id': item.dealer_id ? item.dealer_id : 'N/A',
          'vpn_id': item.vpn_id ? item.vpn_id : 'N/A',
          'start_date': item.start_date ? item.start_date : 'N/A',
          'end_date': item.end_date ? item.end_date : 'N/A',
          'created_at': getDateFromTimestamp(item.created_at) ? getDateFromTimestamp(item.created_at) : 'N/A',
        })
      });
    }

    return (data);
  }


  createPDFReport = () => {
    generatePDF(columns, rows, title, fileName, this.state.reportFormData);
  }

  createExcelReport = () => {
    generateExcel(rows, fileName);
  }

  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Card style={{ height: '500px' }}>
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
              >
              </Form.Item>

              <Form.Item
                label="Product"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('product', {
                  initialValue: 'ALL',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value='ALL'>ALL</Select.Option>
                    <Select.Option value='CHAT'>CHAT</Select.Option>
                    <Select.Option value='PGP'>PGP</Select.Option>
                    <Select.Option value='SIM'>SIM</Select.Option>
                    <Select.Option value='VPN'>VPN</Select.Option>
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="Type"
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
                    <Select.Option value='USED'>USED</Select.Option>
                    <Select.Option value='UNUSED'>UNUSED</Select.Option>
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
                label="Devices"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('device', {
                  initialValue: '',
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    <Select.Option value={DEVICE_PRE_ACTIVATION}>{DEVICE_PRE_ACTIVATION}</Select.Option>
                    {this.props.devices.map((device, index) => {
                      return (<Select.Option key={device.device_id} value={device.device_id}>{device.device_id}</Select.Option>)
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
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>GENERATE</Button>
              </Form.Item>
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card bordered={false} style={{ height: '500px', overflow: 'scroll' }} >
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Product Inventory Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={this.createPDFReport}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={this.createExcelReport}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
                <Tabs defaultActiveKey="1" activeKey={this.state.innerTabSelect} type="card" tabPosition="left" className="" onChange={this.handleChangeCardTabs}>

                  {(this.state.productType === 'ALL' || this.state.productType === 'CHAT') ?
                    < TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], "CHAT")} key="1" forceRender={true}>
                    </TabPane>
                    : null}
                  {(this.state.productType === 'ALL' || this.state.productType === 'PGP') ?
                    < TabPane tab={
                      convertToLang(
                        this.props.translation[TAB_PGP_EMAIL],
                        "PGP")} key="2" forceRender={true}>
                    </TabPane>
                    : null}
                  {(this.state.productType === 'ALL' || this.state.productType === 'SIM') ?
                    <TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SIM")} key="3" forceRender={true}>
                    </TabPane>
                    : null}
                  {(this.state.productType === 'ALL' || this.state.productType === 'VPN') ?
                    <TabPane tab={convertToLang(this.props.translation[TAB_VPN], "VPN")} key="4" forceRender={true}>
                    </TabPane>
                    : null}
                </Tabs>
                <Table
                  size="middle"
                  className="gx-table-responsive devices table m_d_table m_d_table1"
                  bordered
                  columns={this.state.columns}
                  rowKey='row_key'
                  align='center'
                  pagination={false}
                  dataSource={this.renderList(this.props.productReport)}
                />
              </Fragment>
              : null}
          </Card>
        </Col>
      </Row>
    )
  }

  componentWillReceiveProps(nextProps, prevProps) {
  }
}

const WrappedAddDeviceForm = Form.create()(ProductInventory);
export default WrappedAddDeviceForm;
