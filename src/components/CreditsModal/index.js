import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, Row, Col } from 'antd';
import { Link } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import {
  ADMIN,
  ACTION,
  CREDITS,
  CREDITS_CASH_REQUESTS,
  ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST,
  ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST,
  WARNING,
  DEVICE_UNLINKED,
  DEVICE_PRE_ACTIVATION
} from '../../constants/Constants';
import { convertToLang, generateExcel } from '../../routes/utils/commonUtils';
import {
  Button_Ok,
  Button_Cancel,
  Button_Confirm,
  Button_Decline,
  Button_ACCEPT,
  Button_Transfer,
  Button_DOWNLOAD
} from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME } from '../../constants/DealerConstants';
import { Markup } from "interweave";
import { DT_MODAL_BODY_7 } from "../../constants/AppConstants";
import { BASE_URL } from "../../constants/Application";
const confirm = Modal.confirm;
let paymentHistoryColumns;

const a_s_columns = [
  {
    title: 'RESTRICTED',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '21+ days Overdue',
    dataIndex: 'age',
    key: 'age',
  },
];
const ac_st_dataSource = [
  {
    name: <h5 className="weight_600 bg_yellow p-5">RESTRICTED</h5>,
    age: <h5 className="weight_600 bg_brown p-5">21+ days Overdue</h5>,


  },
];
const cr_blnc_columns = [
  {
    title: <h4 className="weight_600 bg_light_yellow p-5">TOTAL</h4>,
    dataIndex: 'name1',
    key: 'name1',
  },
  {
    title: <h4 className="weight_600 bg_light_yellow p-5"> -10,200</h4>,
    dataIndex: 'age1',
    key: 'age1',
  },
];
const overdue_columns = [
  {
    title: "",
    dataIndex: 'status',
    key: 'status',
    render: (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === 0) {
        obj.props.className = "bg_red border-left"
      }
      if (index === 1) {
        obj.props.rowSpan = 2;
        obj.props.className = "bg_yellow border-left"
      }
      if (index === 2) {
        obj.props.rowSpan = 0;
        obj.props.className = "bg_yellow"
      }
      if (index === 3) {
        obj.props.className = "border-bottom"
      }
      return obj;
    },
  },
  {
    title: <h4 className="weight_600">Overdue (days)</h4>,
    dataIndex: 'overdue',
    key: 'overdue',
  },
  {
    title: <h4 className="weight_600">Amount (credits)</h4>,
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: <h4 className="weight_600"># Invoices past due</h4>,
    dataIndex: 'invoices',
    key: 'invoices',
  },
];
const overdue_dataSource = [
  {
    status: <span className="p-5 weight_600 black"> Account Suspension</span>,
    overdue: <span className="weight_600 p-5"> 60+</span>,
    amount: <span className="weight_600 p-5"> 0</span>,
    invoices: <Button size="small" className="invo_btn">0</Button>
  },
  {
    status: <span className="p-5 weight_600"> Account Restriction</span>,
    overdue: <span className="weight_600 p-5"> 30+</span>,
    amount: <span className="weight_600 p-5"> -1200</span>,
    invoices: <Button size="small" className="invo_btn">3</Button>
  },
  {

    overdue: <span className="weight_600 p-5"> 21+</span>,
    amount: <span className="weight_600 p-5"> -2500</span>,
    invoices: <Button size="small" className="invo_btn">5</Button>
  },
  {
    overdue: <span className="weight_600 p-5"> 0-21</span>,
    amount: <span className="weight_600 p-5"> -6500</span>,
    invoices: <Button size="small" className="invo_btn">18</Button>
  },
];
const cr_blnc_dataSource = [
  {
    name1:
      <h6 className="weight_600 p-5"> USD (EQUIVALENT)</h6>,
    age1:
      <div>
        <h6 className="weight_600 p-5 float-left">-$</h6>
        <h6 className="weight_600 p-5 float-right">  10,200.00</h6>
      </div>,

  },
  {
    name1: <span className="p-8"></span>,
    age1: <span className="p-8"></span>,
    colSpan: 2,

  },
  {
    name1: <h5 className="weight_600">PURCHASE CREDITS</h5>,
    age1: <Button type="default" size="small" className="buy_btn_invo">
      BUY
    </Button>,

  }
];

export default class NewDevices extends Component {
  constructor(props) {
    super(props);

    this.paymentHistoryColumns = [
      {
        title: "Transaction #",
        dataIndex: 'transaction_no',
        align: "center",
        key: 'transaction_no',
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION DATE"),
        align: "center",
        dataIndex: 'created_at',
        key: 'created_at',
      },

      {
        title: convertToLang(props.translation[''], "PAYMENT METHOD"),
        align: "center",
        dataIndex: 'payment_method',
        key: 'payment_method',
      },

      {
        title: convertToLang(props.translation[''], "AMOUNT (USD)"),
        align: "center",
        dataIndex: 'amount',
        key: 'amount',
      },

      {
        title: convertToLang(props.translation[''], "TOTAL CREDITS"),
        align: "center",
        dataIndex: 'total_credits',
        key: 'total_credits',
      },

    ];

    this.state = {
      paymentHistoryColumns: paymentHistoryColumns,
      visible: false,
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  ac_st_title = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "ACCOUNT STATUS")}</h4>
  }

  cr_blnc_title = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "CURRENT BALANCE (Credits)")}</h4>
  }
  overdue_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600">{convertToLang(this.props.translation[""], "OVERDUE")}
        <Button type="default" size="small" className="full_list_btn">Full List</Button>
      </h4>
    </div>
  }
  pay_history_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600">{convertToLang(this.props.translation[""], "PAYMENT HISTORY")}
        <Button type="default" size="small" className="full_list_btn">Full List</Button>
      </h4>
    </div>
  }
  renderPaymentHistoryList = () => {
    return [{
      rowKey: 1,
      key: 1,
      transaction_no: '21121',
      created_at: '30-10-2120',
      payment_method: '30-10-2120',
      amount: '30-10-2120',
      total_credits: '30-10-2120'
    }]
  };

  render() {
    return (

      <div>
        <Modal
          width={'55%'}
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
          footer={false}
          className="credit_popup"
        >
          <Fragment>

            <Row>
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Table
                  className="ac_status_table"
                  dataSource={ac_st_dataSource}
                  columns={a_s_columns}
                  pagination={false}
                  title={this.ac_st_title}
                  bordered
                  showHeader={false}
                />
                <h6 className="mt-6"> Please clear payment over 21+ days to activate "PAY LATER" feature</h6>
              </Col>
              <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              </Col>
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Table
                  className="ac_status_table"
                  dataSource={cr_blnc_dataSource}
                  columns={cr_blnc_columns}
                  pagination={false}
                  title={this.cr_blnc_title}
                  bordered
                />
              </Col>
            </Row>
            <div>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Table
                    className="overdue_table"
                    dataSource={overdue_dataSource}
                    columns={overdue_columns}
                    pagination={false}
                    title={this.overdue_title}
                    bordered
                    size="small"
                  />
                </Col>
              </Row>

            </div>

            <div>
              {/* <h3 className="credit_modal_heading">{convertToLang(this.props.translation[""], "PAYMENT HISTORY")} <Button className="pull-right" type="primary" size="small">Full List</Button></h3> */}
              <Table
                className="pay_history"
                columns={this.paymentHistoryColumns}
                dataSource={this.renderPaymentHistoryList()}
                bordered
                title={this.pay_history_title}
                pagination={false}
              />
            </div>

            {/* <div className="edit_ftr_btn11">
              <Button type="primary" onClick={() => {
                this.setState({
                  visible: false
                })
              }} >{convertToLang(this.props.translation[""], "OK")}</Button>
            </div> */}
          </Fragment>
        </Modal>

      </div>
    )
  }
}
