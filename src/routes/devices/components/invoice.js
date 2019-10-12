import React, { Component, Fragment } from 'react';
import { Modal, message, Col, Row, Table } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { inventorySales } from '../../utils/columnsUtils';
import moment from 'moment';


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
        console.log("invoice showModal ", visible);
        this.setState({
            visible: visible
        });
    }

    componentDidUpdate() {
        // this.setState({
        //     visible: this.props.invoiceVisible
        // })
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     visible: nextProps.invoiceVisible
        // })
    }

    // renderInvoiceList(invoiceList) {

    //     console.log("invoiceList ", invoiceList)
    //     return invoiceList.map((item, index) => {
    //         return {
    //             id: item.id,
    //             rowKey: item.rowKey,
    //             item: item.item,
    //             description: item.description,
    //             term: "0", // (this.state.term === '0') ? "TRIAL" : this.state.term + " Month",
    //             unit_price: `$ ${item.unit_price}.00`,
    //             quantity: (item.quantity > 0) ? 1 * item.quantity : 1,
    //             line_total: (item.quantity > 0) ? item.unit_price * item.quantity : item.unit_price
    //         }
    //     })
    // }

    handleOk = () => {
        console.log("handleOk for invoice")
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { visible, loading } = this.state;
        const { user } = this.props;

        let discount = Math.ceil(Number(this.props.subTotal) * 0.05);
        let total = this.props.subTotal - discount;
        let balanceDue = this.props.subTotal;
        let paid = 0;
        if (this.props.invoiceType === "pay_now") {
            balanceDue = 0;
            paid = total;
        }

        return (
            // <div>
            //     <Modal
            //         width="850px"
            //         visible={this.state.visible}
            //         maskClosable={false}
            //         title={convertToLang(this.props.translation[""], "MDM PANEL SERVICES")}
            //         onOk={this.handleOk}
            //         onCancel={this.handleCancel}
            //         className="edit_form"
            //         bodyStyle={{ overflow: "overlay" }}
            //         okText={convertToLang(this.props.translation[""], "CHECKOUT")}
            //         cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
            //     >
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
                        <Col span={5}>Invoice Number:</Col>
                        <Col span={7}>{this.props.invoiceID}</Col>
                        <Col span={5}>Dealer Name:</Col>
                        <Col span={7}>{user.name}</Col>
                    </Row>
                    <Row>
                        <Col span={5}>Invoice Date:</Col>
                        <Col span={7}>{moment().format("YYYY/MM/DD")} </Col>
                        <Col span={5}>User ID:</Col>
                        <Col span={7}>{this.props.user_id}</Col>
                    </Row>
                    <Row>
                        <Col span={5}>Balance Due:</Col>
                        <Col span={7}>$ {balanceDue}.00</Col>
                        <Col span={5}>Dealer PIN:</Col>
                        <Col span={7}>{user.dealer_pin}</Col>
                    </Row>
                    <Row>
                        <Col span={12} />
                        <Col span={5}>Device ID:</Col>
                        <Col span={7}>{(this.props.deviceAction === "Add") ? "Pre-Activation" : "ASDF123456"}</Col>
                    </Row>
                </div>

                <Fragment>
                    <div style={{ marginTop: 20 }}>
                        <Table
                            width='850px'
                            columns={this.state.invoiceColumns}
                            dataSource={this.props.renderInvoiceList(this.props.PkgSelectedRows, this.props.proSelectedRows, this.props.term, this.props.duplicate)}
                            pagination={false}
                        />
                    </div >
                </Fragment>

                <div style={{ marginTop: 20, marginBottom: 70 }}>
                    <Row>
                        <Col span={16} />
                        <Col span={5}>Subtotal</Col>
                        <Col span={3}>$ {this.props.subTotal}</Col>
                    </Row>
                    {(this.props.invoiceType === "pay_now") ?
                        <Fragment>
                            <Row>
                                <Col span={16} />
                                <Col span={5}>Discount</Col>
                                <Col span={3}>$ {discount}</Col>
                            </Row>
                            <Row>
                                <Col span={16} />
                                <Col span={5}>Total</Col>
                                <Col span={3}>$ {total}.00</Col>
                            </Row>
                        </Fragment>
                        : null}
                    <Row>
                        <Col span={16} />
                        <Col span={5}>Paid To Date</Col>
                        <Col span={3}>{`$ ${paid}.00`}</Col>
                    </Row>
                    <Row>
                        <Col span={16} />
                        <Col span={5}><b>Balance Due</b></Col>
                        <Col span={3}><b>{`$ ${balanceDue}`}</b></Col>
                    </Row>
                </div>
                <p style={{ textAlign: 'center' }}>Thank you for your business.</p>

            </div>
            //     </Modal>

            // </div>
        )

    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ auth }) => {
    console.log("invoice component ", auth.authUser);
    return {
        user: auth.authUser,
        // routing: routing,
        // user_credit: sidebar.user_credit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
