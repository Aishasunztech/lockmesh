import React, { Component, Fragment } from 'react';
import { Modal, message, Col, Row, Table } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';

class Invoice extends Component {

    constructor(props) {
        super(props);

        const invoiceColumns = [
            {
                dataIndex: 'counter',
                className: '',
                title: '#',
                align: "center",
                key: 'counter',
                sorter: (a, b) => { return a.counter - b.counter },
                sortDirections: ['ascend', 'descend'],

            },
            {
                dataIndex: 'item',
                className: '',
                title: convertToLang(this.props.translation["ITEM"], "ITEM"),
                align: "center",
                key: 'item',
                sorter: (a, b) => { return a.item.localeCompare(b.item) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "DESCRPTION"),
                dataIndex: 'description',
                className: '',
                align: "center",
                className: '',
                key: 'description',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.description.localeCompare(b.description) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICE TERM"),
                dataIndex: 'term',
                className: '',
                align: "center",
                className: '',
                key: 'term',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.term.localeCompare(b.term) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "UNIT PRICE (CREDITS)"),
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.unit_price - b.unit_price },

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "QUANTITY"),
                dataIndex: 'quantity',
                className: '',
                align: "center",
                className: '',
                key: 'quantity',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.quantity - b.quantity },

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "LINE TOTAL"),
                dataIndex: 'line_total',
                className: '',
                align: "center",
                className: '',
                key: 'line_total',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.line_total - b.line_total },
                sortDirections: ['ascend', 'descend'],

            },
        ];

        this.state = {
            invoiceColumns: invoiceColumns,
            visible: true,
        }
    }

    componentDidUpdate() {
        // this.setState({
        //     visible: this.props.invoiceVisible
        // })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            visible: nextProps.invoiceVisible
        })
    }

    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width="600px"
                    visible={visible}
                    maskClosable={false}
                    title={convertToLang(this.props.translation[""], "MDM PANEL SERVICES")}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    // className="edit_form"
                    destroyOnClose={true}
                    bodyStyle={{ height: 500, overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    <div>
                        <p>FLAT/RM H 15/F  SIU KING BLDG 6 ON WAH ST <br /> NGAU TAU KOK KLN, HONG KONG</p>
                        <h2>INVOICE</h2>
                        <Row>
                            <Col span={5}>Invoice Number:</Col>
                            <Col span={7}>PI000018 </Col>
                            <Col span={5}>Dealer Name:</Col>
                            <Col span={7}>HAMZA DAWOOD (LockMesh)</Col>
                        </Row>
                        <Row>
                            <Col span={5}>Invoice Date:</Col>
                            <Col span={7}>2019/10/9  </Col>
                            <Col span={5}>Dealer ID:</Col>
                            <Col span={7}>225</Col>
                        </Row>
                        <Row>
                            <Col span={5}>Balance Due:</Col>
                            <Col span={7}>$1500.00</Col>
                            <Col span={5}>Dealer PIN:</Col>
                            <Col span={7}>123456</Col>
                        </Row>

                        <Fragment>
                            <div style={{ marginTop: 20 }}>
                                <Table
                                    // id=''
                                    // className={"devices mb-20"}
                                    size="middle"
                                    columns={this.state.invoiceColumns}
                                    dataSource={[]}
                                    pagination={false}
                                />
                            </div >
                        </Fragment>

                    </div>
                </Modal>

            </div>
        )

    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details, users, settings, sidebar }) => {
    // console.log("sdfsaf", users.users_list);
    return {
        // routing: routing,
        // sim_ids: devices.sim_ids,
        // chat_ids: devices.chat_ids,
        // pgp_emails: devices.pgp_emails,
        // policies: device_details.policies,
        // users_list: users.users_list,
        // isloading: users.addUserFlag,
        // translation: settings.translation,
        // parent_packages: devices.parent_packages,
        // product_prices: devices.product_prices,
        // user_credit: sidebar.user_credit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);