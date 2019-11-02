import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, Row, Col, Select } from 'antd';
import { Link } from "react-router-dom";
import PurchaseCredit from "../../routes/account/components/PurchaseCredit";
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
import { convertToLang, generateExcel, formatMoney } from '../../routes/utils/commonUtils';
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
import { bindActionCreators } from "redux";
import {
  checkPass,
  createBackupDB,
  exportCSV, getPackages,
  importCSV,
  insertNewData, purchaseCredits, purchaseCreditsFromCC,
  releaseCSV,
  showBackupModal
} from "../../appRedux/actions";
import { connect } from "react-redux";
const confirm = Modal.confirm;
let paymentHistoryColumns;
let account_status_paragraph = '';


class CreditIcon extends Component {


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


    this.a_s_columns = [
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


    this.cr_blnc_columns = [
      {
        title: <h4 className="weight_600 bg_light_yellow p-5">TOTAL</h4>,
        dataIndex: 'name1',
        key: 'name1',
      },
      {
        title: <h4 className="weight_600 bg_light_yellow p-5"> {this.props.user_credit} </h4>,
        dataIndex: 'age1',
        key: 'age1',
      },
    ];

    this.overdue_columns = [
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

    this.cr_blnc_dataSource = [
      {
        name1: <h6 className="weight_600 p-5"> Dropdown</h6>,
        age1: <Select style={{ width: '100%' }}>
          <Select.Option value=''>ALL</Select.Option>
          <Select.Option value=''>My Report</Select.Option>

        </Select>,

      },
      {
        name1:
          <h6 className="weight_600 p-5"> USD (EQUIVALENT)</h6>,
        age1: <h6 className="weight_600 p-5 float-right">  $ {formatMoney(this.props.user_credit)}</h6>,

      },

      {
        name1: <span className="p-8"></span>,
        age1: <span className="p-8"></span>,
      },
      {
        name1: <h5 className="weight_600">PURCHASE CREDITS</h5>,
        age1: <Button type="default" size="small" className="buy_btn_invo" onClick={(e) => { this.showPurchaseModal(e, true); }}>
          BUY
        </Button>,

      }
    ];

    this.state = {
      paymentHistoryColumns: paymentHistoryColumns,
      visible: false,
    }
  }

  showPurchaseModal = (e, visible) => {
    this.setState({
      purchase_modal: visible
    })
  };

  showModal = () => {

    this.cr_blnc_columns[1].title = <h4 className="weight_600 bg_light_yellow p-5"> {this.props.user_credit} </h4>;
    this.cr_blnc_dataSource[1].age1 = <h6 className="weight_600 p-5 float-right">  $ {formatMoney(this.props.user_credit)}</h6>
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  ac_st_title = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "ACCOUNT STATUS")}</h4>
  };

  cr_blnc_title = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "CURRENT BALANCE (Credits)")}</h4>
  };



  overdue_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600">{convertToLang(this.props.translation[""], "OVERDUE")}
        <Link to={'/account/payment-overdue-history'}>
          <Button type="default" size="small" className="full_list_btn">Full List</Button>
        </Link>
      </h4>
    </div>
  };

  pay_history_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600">{convertToLang(this.props.translation[""], "PAYMENT HISTORY")}
        <Link to={'/account/credits-payment-history'}>
          <Button type="default" size="small" className="full_list_btn">Full List</Button>
        </Link>
      </h4>
    </div>
  };

  renderPaymentHistoryList = (list) => {

    if (list) {
      return list.map((item, index) => {
        return {
          rowKey: item.id,
          key: ++index,
          transaction_no: item.id,
          created_at: item.created_at,
          payment_method: JSON.parse(item.transection_data).request_type,
          amount: "$ " + formatMoney(item.credits),
          total_credits: item.credits,
        }
      })
    }
  };

  renderOverData = () => {
    return [
      {
        status: <span className="p-5 weight_600 black"> Account Suspension</span>,
        overdue: <span className="weight_600 p-5"> 60+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._60toOnward_dues) ? '-' + this.props.overdueDetails._60toOnward_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._60toOnward}</Button>
      },
      {
        status: <span className="p-5 weight_600"> Account Restriction</span>,
        overdue: <span className="weight_600 p-5"> 30+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._30to60_dues) ? '-' + this.props.overdueDetails._21to30_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn"> {this.props.overdueDetails._30to60}</Button>
      },
      {

        overdue: <span className="weight_600 p-5"> 21+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._21to30_dues)}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._21to30}</Button>
      },
      {
        overdue: <span className="weight_600 p-5"> 0-21</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._0to21_dues) ? '-' + this.props.overdueDetails._0to21_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._0to21}</Button>
      },
    ];
  };

  renderAccountStatus = () => {
    let statusBGC, statusDays;
    if (this.props.account_balance_status === 'restricted' && this.props.overdueDetails._30to60 > 0) {
      statusBGC = 'bg_yellow';
      statusDays = '31+ days Overdue';
      account_status_paragraph = "Please clear payment over 31+ days to activate \"PAY LATER\" feature";
    } else if (this.props.account_balance_status === 'restricted') {
      statusBGC = 'bg_yellow';
      statusDays = '21+ days Overdue';
      account_status_paragraph = "Please clear payment over 21+ days to activate \"PAY LATER\" feature";
    } else if (this.props.account_balance_status === 'suspended') {
      statusBGC = 'bg_red';
      statusDays = '60+ days Overdue';
      account_status_paragraph = "Please clear 60+ days payment to allow new device activation";
    } else {
      statusBGC = 'bg_green';
      statusDays = 'No Overdue';
    }
    return [
      {
        name: <h5 className={'weight_600 p-5 text-uppercase ' + statusBGC} >{this.props.account_balance_status}</h5>,
        age: <h5 className="weight_600 bg_brown p-5">{statusDays} </h5>,
      },
    ];
  }

  render() {
    return (

      <div>
        <PurchaseCredit
          showPurchaseModal={this.showPurchaseModal}
          // purchase_modal={this.state.purchase_modal}
          // purchaseCredits={this.props.purchaseCredits}
          // purchaseCreditsFromCC={this.props.purchaseCreditsFromCC}
          translation={this.props.translation}

        />
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
                  dataSource={this.renderAccountStatus()}
                  columns={this.a_s_columns}
                  pagination={false}
                  title={this.ac_st_title}
                  bordered
                  showHeader={false}
                />
                <h6 className="mt-6"> {account_status_paragraph}</h6>
              </Col>
              <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              </Col>
              <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <Table
                  className="ac_status_table"
                  dataSource={this.cr_blnc_dataSource}
                  columns={this.cr_blnc_columns}
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
                    dataSource={this.renderOverData()}
                    columns={this.overdue_columns}
                    pagination={false}
                    title={this.overdue_title}
                    bordered
                    size="small"
                  />
                </Col>
              </Row>

            </div>

            <div>
              <Table
                className="pay_history"
                columns={this.paymentHistoryColumns}
                dataSource={this.renderPaymentHistoryList(this.props.latestPaymentTransaction)}
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

// export default Account;
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    purchaseCredits: purchaseCredits,
    purchaseCreditsFromCC: purchaseCreditsFromCC
  }, dispatch);
}

var mapStateToProps = ({ account, devices, settings, auth }) => {
  return {
    msg: account.msg,
    showMsg: account.showMsg,
    newData: account.newData,
    backUpModal: account.backUpModal,
    translation: settings.translation,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CreditIcon);
