import React, { Component, Fragment } from 'react';
import { Modal, message, Col, Row, Table } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { inventorySales } from '../../utils/columnsUtils';
import moment from 'moment';
import { APP_TITLE } from '../../../constants/Application';


// const invoice = {
//     shipping: {
//         name: requestData.dealer_name.toUpperCase() + ` (${requestData.label})`,
//         dealer_id: requestData.dealer_id,
//         dealer_pin: requestData.dealer_pin,
//     },
//     items: [
//         {
//             item: "Credits",
//             description: "Credits puchased on cash",
//             quantity: requestData.credits,
//             amount: requestData.credits * 100
//         },
//     ],
//     subtotal: requestData.credits * 100,
//     paid: 0,
//     invoice_nr: inv_no
// };

const invoiceData = {
    shipping: {
        name: "Hamza Dawood".toUpperCase() + ` (LockMesh)`,
        dealer_id: "225",
        dealer_pin: "123456",
    },
    items: [
        {
            item: "Credits",
            description: "Credits puchased on cash",
            unit_price: 1,
            quantity: 1500,
            amount: 1500 * 100
        },
    ],
    subtotal: 1500 * 100,
    paid: 0,
    invoice_nr: "PI000018"
};

class Invoice extends Component {

    constructor(props) {
        super(props);

        const invoiceColumns = inventorySales(props.translation);


        this.state = {
            invoiceColumns: invoiceColumns,
            visible: false,
        }
    }


    showModal = (visible) => {
        // console.log("invoice showModal ", visible);
        this.setState({
            visible: visible
        });
    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {

    }

    handleOk = () => {
        console.log("handleOk for invoice")
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { user, deviceAction } = this.props;

        let total;
        let discount = Math.ceil(Number(this.props.subTotal) * 0.05);
        let balanceDue = this.props.subTotal;
        let paid = 0;


        if (deviceAction === "Edit") {
            total = this.props.total;
            paid = total;

            if (this.props.invoiceType === "pay_now") {
                paid = balanceDue = total = total - discount;
            } else {
                balanceDue = this.props.subTotal - this.props.creditsToRefund
            }
        } else {
            total = this.props.subTotal - discount;
            if (this.props.invoiceType === "pay_now") {
                balanceDue = total;
                paid = total;
            }
        }


        return (
            <div>
                <h1 style={{ textAlign: 'center' }}>MDM PANEL SERVICES</h1>
                <h4 style={{ textAlign: 'center' }}>FLAT/RM H 15/F  SIU KING BLDG 6 ON WAH ST <br /> NGAU TAU KOK KLN, HONG KONG</h4>
                <h2>INVOICE</h2>
                <div style={{
                    borderTop: "2px solid lightgray",
                    borderBottom: "2px solid lightgray",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <Row>
                        <Col span={6}>Invoice Number:</Col>
                        <Col span={6}>{this.props.invoiceID}</Col>
                        <Col span={6}>Dealer Name:</Col>
                        {/* <Col span={6}>{`${user.name.toUpperCase()} (${APP_TITLE})`}</Col> */}
                        <Col span={6}>{`${user.name.toUpperCase()} `}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Invoice Date:</Col>
                        <Col span={6}>{moment().format("YYYY/MM/DD")} </Col>
                        <Col span={6}>User ID:</Col>
                        <Col span={6}>{this.props.user_id}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Balance Due:</Col>
                        <Col span={6}>{balanceDue}.00&nbsp;Credits</Col>
                        <Col span={6}>Dealer PIN:</Col>
                        <Col span={6}>{user.dealer_pin}</Col>
                    </Row>
                    <Row>
                        <Col span={12} />
                        <Col span={6}>Device ID:</Col>
                        <Col span={6}>{(this.props.deviceAction === "Add") ? "Pre-Activation" : ((this.props.device_id) ? this.props.device_id : "ABCD123456")}</Col>
                    </Row>
                </div>

                <Fragment>
                    {(deviceAction === "Edit") ?
                        <div style={{ marginTop: 40 }}>
                            <h3 style={{ textAlign: "center" }}><b>CURRENT SERVICES</b></h3>
                            <Table
                                size="middle"
                                columns={this.state.invoiceColumns}
                                dataSource={this.props.renderInvoiceList((this.props.currentPakages) ? JSON.parse(this.props.currentPakages.packages) : [], (this.props.currentPakages) ? JSON.parse(this.props.currentPakages.products) : [], [], this.props.term, this.props.duplicate)}
                                pagination={false}
                            />
                            <br />
                            <div style={{ textAlign: 'right' }}>
                                <Row style={{ fontWeight: 'bold' }}>
                                    <Col span={12} />
                                    <Col span={8}>Remaining days of services : </Col>
                                    <Col span={4}>{this.props.serviceRemainingDays}</Col>
                                </Row>
                                <Row>
                                    <Col span={12} />
                                    <Col span={8}>Previous service refund credits : </Col>
                                    <Col span={4}>{this.props.creditsToRefund}.00 Credits</Col>
                                </Row>
                            </div>
                        </div >
                        : null}

                    <div style={{ marginTop: 20 }}>
                        {(deviceAction === "Edit") ?
                            <h3 style={{ textAlign: "center" }}><b>NEW SERVICES</b></h3>
                            : null}
                        <Table
                            // width='850px'
                            size="middle"
                            columns={this.state.invoiceColumns}
                            dataSource={this.props.renderInvoiceList(this.props.PkgSelectedRows, this.props.proSelectedRows, this.props.hardwares ? this.props.hardwares : [], this.props.term, this.props.duplicate)}
                            pagination={false}
                        />
                    </div >
                </Fragment>

                <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Row>
                        <Col span={16} />
                        <Col span={4}>Subtotal : </Col>
                        <Col span={4}>{this.props.subTotal} Credits</Col>
                    </Row>
                    {(deviceAction === "Edit") ?
                        <Row>
                            <Col span={12} />
                            <Col span={8}>Previous service refund credits : </Col>
                            <Col span={4}>{this.props.creditsToRefund} Credits</Col>
                        </Row>
                        : null}
                    {(this.props.invoiceType === "pay_now") ?
                        <Fragment>
                            <Row>
                                <Col span={12} />
                                <Col span={8}>Discount % : </Col>
                                <Col span={4}> 5 % </Col>
                            </Row>
                            <Row>
                                <Col span={12} />
                                <Col span={8}>Discount Credits : </Col>
                                <Col span={4}>{discount} Credits</Col>
                            </Row>
                            <Row>
                                <Col span={12} />
                                <Col span={8}>Total : </Col>
                                <Col span={4}>{total}&nbsp;Credits</Col>
                            </Row>
                        </Fragment>
                        : null}
                    <Row>
                        <Col span={16} />
                        <Col span={4}>Paid To Date : </Col>
                        <Col span={4}>{paid}&nbsp;Credits</Col>
                    </Row>
                    <Row>
                        <Col span={16} />
                        <Col span={4}>Balance Due : </Col>
                        <Col span={4}>{balanceDue}&nbsp;Credits</Col>
                    </Row>
                    <br />
                    <Row>
                        <Col span={14} />
                        <Col span={6}><b>Equivalent USD Price: </b></Col>
                        <Col span={4}><b>${balanceDue}.00</b></Col>
                    </Row>

                </div>
                <p style={{ textAlign: 'center', marginTop: 70 }}>Thank you for your business.</p>
                
            </div>
        )

    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ auth }) => {
    // console.log("invoice component ", auth.authUser);
    return {
        user: auth.authUser,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
