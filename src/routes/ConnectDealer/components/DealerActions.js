// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select, Form } from "antd";

// Components
import EditDealer from '../../dealers/components/editDealer';
import DealerPaymentHistory from './DealerPaymentHistory';

// Helpers
import { convertToLang } from '../../utils/commonUtils'
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
import {
    Button_Delete,
    Button_Activate,
    Button_Connect,
    Button_Suspend,
    Button_Undo,
    Button_passwordreset,
    Button_Ok,
    Button_Cancel,

} from '../../../constants/ButtonConstants';
import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
import {
    DEALER_TEXT
} from '../../../constants/DealerConstants';
import CreditsLimits from "./CreditLimits";

// user defined
const confirm = Modal.confirm;


function showConfirm(_this, dealer, action, btn_title, name = "") {
    let title_Action = '';
    if (btn_title == 'SUSPEND') {
        title_Action = convertToLang(_this.props.translation[Button_Suspend], "SUSPEND ");
    } else if (btn_title == 'DELETE') {
        title_Action = convertToLang(_this.props.translation[Button_Delete], "DELETE");
    } else if (btn_title == 'UNDELETE') {
        title_Action = convertToLang(_this.props.translation[Button_Undo], "UNDELETE");
    } else if (btn_title == "RESET PASSWORD") {
        title_Action = convertToLang(_this.props.translation[Button_passwordreset], "RESET PASSWORD");
    } else {
        title_Action = btn_title;
    }

    confirm({
        title: `${convertToLang(_this.props.translation[DO_YOU_WANT_TO], "Do you want to ")} ${title_Action} ${convertToLang(_this.props.translation[OF_THIS], " of this ")} Dealer ${name ? `(${name})` : ""} ?`,
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);

                if (btn_title === 'RESET PASSWORD') {
                    dealer.pageName = 'dealer'
                    action(dealer);
                } else {
                    action(dealer, 'CONNECT');
                }
                //  success();

            }).catch(() => console.log('Oops errors!'));
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() { },
    });
}

export default class DealerAction extends Component {

    render() {
        if (!this.props.dealer) {
            return null;
        }
        let dealer = this.props.dealer;
        const dealer_status = (dealer.account_status === "suspended") ? "Suspended" : "Activated";

        const restrict_button_type = (dealer_status === "Activated") ? "danger" : "default";
        const restrict_button_text = (dealer_status === 'Activated') ? 'Suspend/Restrict' : 'Activate';

        const undo_button_type = (dealer.unlink_status === 0) ? 'danger' : "default";
        const undo_button_text = (dealer.unlink_status === 0) ? 'Delete' : 'Undelete'
        return (
            <Fragment>
                <Card style={{ borderRadius: 12 }}>
                    <Row gutter={16} type="flex" justify="center" align="top">
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button disabled style={{ width: "100%", marginBottom: 16, }} >
                                <h6 className="mb-0">Activity</h6>
                            </Button>
                        </Col>
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button disabled style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Domains</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button style={{ width: "100%", marginBottom: 16, }}
                                onClick={() => { this.form1.showModal() }}
                            >
                                <h6 className="mb-0">Credit Limit</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button disabled style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">DEMO</h6>
                            </Button>
                        </Col>
                        <Col
                            className="gutter-row"
                            justify="center"
                            span={12}
                        >
                            <Button
                                style={{ width: "100%", marginBottom: 16, }}
                                onClick={() => this.refs.dealerPaymentHistory.showModal(this.props.dealer, this.props.getDealerPaymentHistory)}
                            >
                                <h6 className="mb-0">Payment History</h6>
                            </Button>
                        </Col>
                        <Col
                            className="gutter-row"
                            justify="center"
                            span={12}
                        >
                            <Button
                                disabled
                                style={{ width: "100%", marginBottom: 16, }}
                            >
                                <h6 className="mb-0">Sales History</h6>
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ borderRadius: 12 }}>
                    <Row
                        gutter={16}
                        type="flex"
                        justify="center"
                        align="top"
                    >
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }}
                                onClick={() => showConfirm(this, this.props.dealer, this.props.updatePassword, 'RESET PASSWORD', this.props.dealer.dealer_name)}
                            >
                                Pass Reset
                        </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                // disabled
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                onClick={() => this.refs.editDealer.showModal(this.props.dealer, this.props.editDealer, CONNECT_EDIT_DEALER)}
                            >
                                <Icon type='edit' />
                                Edit
                        </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                type={restrict_button_type}
                                style={{ width: "100%", marginBottom: 16, }}
                                onClick={
                                    () => (!dealer.account_status) ?
                                        showConfirm(this, dealer.dealer_id, this.props.suspendDealer, 'SUSPEND') :
                                        showConfirm(this, dealer.dealer_id, this.props.activateDealer, 'ACTIVATE')
                                }
                            >
                                {restrict_button_text}
                            </Button>
                        </Col>
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                type={undo_button_type}
                                className="btn_break_line"
                                style={{
                                    width: "100%", marginBottom: 16,
                                    // backgroundColor: '#f31517', color: '#fff'
                                }}
                                onClick={
                                    () => (dealer.unlink_status === 0) ?
                                        showConfirm(this, dealer.dealer_id, this.props.deleteDealer, 'DELETE') :
                                        showConfirm(this, dealer.dealer_id, this.props.undoDealer, 'UNDELETE')
                                }

                            >
                                <Icon type="lock" className="lock_icon" />
                                {undo_button_text}
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <EditDealer
                    ref='editDealer'
                    // getDealerList={this.props.getDealerList} 
                    translation={this.props.translation}
                />
                <DealerPaymentHistory
                    ref='dealerPaymentHistory'
                    translation={this.props.translation}
                    paymentHistory={this.props.paymentHistory}
                />

                <CreditsLimits
                    ref='credits_limits'
                    translation={this.props.translation}
                    wrappedComponentRef={(form) => this.form1 = form}
                    dealer={this.props.dealer}
                    credits_limit={this.props.dealer.credits_limit}
                    setCreditLimit={this.props.setCreditLimit}
                />
            </Fragment >
        )
    }

}
