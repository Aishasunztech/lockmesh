// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components
// import EditDealer from '../../dealers/components/editDealer';

// Helpers
import { convertToLang, formatMoney} from '../../utils/commonUtils'
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
// import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
// import {
//     Button_Delete,
//     Button_Activate,
//     Button_Connect,
//     Button_Suspend,
//     Button_Undo,
//     Button_passwordreset,
//     Button_Ok,
//     Button_Cancel,

// } from '../../../constants/ButtonConstants';
// import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
// import {
//     DEALER_TEXT
// } from '../../../constants/DealerConstants';


export default class DealerPaymentHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            paymentHistory: []
        }
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
    }

    showModal = (dealer, callback) => {
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
        });
        callback(dealer.dealer_id)
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.paymentHistory.length !== nextProps.paymentHistory.length) {
            this.setState({
                paymentHistory: nextProps.paymentHistory
            })
        }
    }
    renderPaymentHistoryList = (list) => {

        if (list) {
          return list.map((item, index) => {
            return {
              rowKey: item.id,
              key: ++index,
              transaction_no: item.id,
              created_at: item.created_at,
              payment_method: item.transection_type,
              amount: "$ " + formatMoney(item.credits),
              total_credits: item.credits,
            }
          })
        }
      };
    render() {
        const { visible } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title={""}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                            {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                        </Button>,
                        // <Button
                        //     key="submit"
                        //     type="primary"
                        //     onClick={this.handleSubmit}
                        // >
                        //     {convertToLang(this.props.translation[Button_submit], "Submit")}
                        // </Button>,
                    ]}
                >
                    <Table
                        className="pay_history"
                        columns={this.paymentHistoryColumns}
                        dataSource={this.renderPaymentHistoryList(this.state.paymentHistory)}
                        bordered
                        title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                </Modal>
            </Fragment >
        )
    }

}
