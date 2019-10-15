import React, {Component, Fragment} from 'react'
import {Button, Card, Col, DatePicker, Form, Row, Select, Table, Tabs} from "antd";
import moment from 'moment';
import {convertToLang} from "../../../utils/commonUtils";
import {TAB_CHAT_ID, TAB_PGP_EMAIL, TAB_SIM_ID, TAB_VPN} from "../../../../constants/TabConstants";
import {generateProductReport} from "../../../../appRedux/actions";
const TabPane = Tabs.TabPane;

class ProductInventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: '',
      productType: '',
      reportCard: false
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.state.productType  = values.product;
      this.state.reportCard   = true;
      this.props.generateProductReport(values)
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

  handleChangeCardTabs = (value) => {

    switch (value) {
      case '1':
        this.setState({
          innerContent: this.props.chat_ids,
          columns: this.state.columnsChatids,
          innerTabSelect: '1'
        });
        break;

      case '2':
        this.setState({
          innerContent: this.props.pgp_emails,
          columns: this.state.columnsPgpemails,
          innerTabSelect: '2'
        });

        break;
      case "3":
        this.setState({
          innerContent: this.props.sim_ids,
          columns: this.state.columnsSimids,
          innerTabSelect: '3'
        });
        break;
      case '4':
        this.setState({
          innerContent: [],
          columns: this.state.columnsVpn,
          innerTabSelect: '4'
        });
        break;


      default:
        this.setState({
          innerContent: this.props.chat_ids,
          columns: this.state.columnsChatids,
          innerTabSelect: '1'
        });
        break;
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
                label="Product"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('product', {
                  initialValue: '',
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
          <Card bordered={false} style={{ height: '500px' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Tabs defaultActiveKey="1" type="card" tabPosition="left" className="m_d_table_tabs" onChange={this.handleChangeCardTabs}>

                  {(this.state.productType === 'ALL' || this.state.productType === 'CHAT') ?
                    < TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], "CHAT")} key="1"></TabPane>
                    : null }
                  {(this.state.productType === 'ALL' || this.state.productType === 'PGP') ?
                    < TabPane tab = {
                      convertToLang(
                        this.props.translation[TAB_PGP_EMAIL],
                        "PGP")} key="2" forceRender={true}>
                    </TabPane>
                    : null }
                  {(this.state.productType === 'ALL' || this.state.productType === 'SIM') ?
                    <TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SIM")} key="3" forceRender={true}>
                    </TabPane>
                    : null }
                  {(this.state.productType === 'ALL' || this.state.productType === 'VPN') ?
                    <TabPane tab={convertToLang(this.props.translation[TAB_VPN], "VPN")} key="4" forceRender={true}>
                    </TabPane>
                    : null }
                </Tabs>
                <Table
                  size="middle"
                  className="gx-table-responsive devices table m_d_table"
                  bordered
                  columns={this.state.columns}
                  rowKey='row_key'
                  align='center'
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

const WrappedAddDeviceForm = Form.create()(ProductInventory);
export default WrappedAddDeviceForm;
