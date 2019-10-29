import React, { Component, Fragment } from 'react';
import {Modal, Table, Button, Row, Col} from 'antd';
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
import {convertToLang, generateExcel} from '../../routes/utils/commonUtils';
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
import {Markup} from "interweave";
import {DT_MODAL_BODY_7} from "../../constants/AppConstants";
import {BASE_URL} from "../../constants/Application";
const confirm = Modal.confirm;
let paymentHistoryColumns;

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
          width={'70%'}
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
          footer={false}
        >
          <Fragment>

            <Row>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h3 className="credit_modal_heading">{convertToLang(this.props.translation[""], "ACCOUNT STATUS")}</h3>
                Please clear payment over 21+ days to activate "PAY LATER" feature
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h3 className="credit_modal_heading">{convertToLang(this.props.translation[""], "CURRENT BALANCE (Credits)")}</h3>
              </Col>
            </Row>

            <div className="buy_credit_main_div">
              <h4 className="buy_credit_div"><span>PURCHASE CREDIT</span>
                <a href='#'>
                  <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                    {convertToLang(this.props.translation[''], "BUY")}
                  </Button>
                </a>
              </h4>
            </div>

            <div>
              <h3 className="credit_modal_heading">{convertToLang(this.props.translation[""], "OVERDUE")}</h3>
            </div>

            <div>
              <h3 className="credit_modal_heading">{convertToLang(this.props.translation[""], "PAYMENT HISTORY")} <Button className="pull-right" type="primary" size="small">Full List</Button></h3>
              <Table
                columns={this.paymentHistoryColumns}
                dataSource={this.renderPaymentHistoryList()}
                bordered
                pagination={false}
              />
            </div>

            <div className="edit_ftr_btn11">
              <Button type="primary" onClick={() => {
                this.setState({
                  visible: false
                })
              }} >{convertToLang(this.props.translation[""], "OK")}</Button>
            </div>
          </Fragment>
        </Modal>

      </div>
    )
  }
}
