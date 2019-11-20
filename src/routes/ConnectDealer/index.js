// libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// methods, constants and components
import AppFilter from '../../components/AppFilter';
import EditDealer from '../dealers/components/editDealer';

// helpers
import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
import { getDealerDetails, editDealer } from '../../appRedux/actions'
import RestService from "../../appRedux/services/RestServices";
import styles from './connect_dealer.css'


class ConnectDealer extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dealer_id: isBase64(props.match.params.dealer_id),
            currency: 'USD',
            currency_sign: '$',
        }
        this.dealerInfoColumns = [
            {
                // title: 'Dealer Name',
                dataIndex: 'name',
                key: 'name',
                className: 'ac_pro_txt',
            },
            {
                // title: 'Age',
                dataIndex: 'value',
                key: 'value',
                className: 'ac_pro_val',
            },
        ]
        this.overDueColumns = [
            {
                title: 'A',
                dataIndex: 'a',
                key: 'a',
                className: '',
            },
            {
                title: 'B',
                dataIndex: 'b',
                key: 'b',
                className: '',
            },
            {
                title: 'C',
                dataIndex: 'c',
                key: 'c',
                className: '',
            },
            {
                title: 'D',
                dataIndex: 'd',
                key: 'd',
                className: '',
            },
        ]
    }


    componentDidMount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
        if (dealer_id) {
            this.props.getDealerDetails(dealer_id);
        }
    }


    componentDidUpdate(prevProps) {
        // console.log('hi')
        // const dealer_id = isBase64(this.props.match.params.dealer_id);

    }
    componentWillReceiveProps(nextProps) {
        // const dealer_id = isBase64(nextProps.match.params.dealer_id);

    }
    componentWillUnmount() {
        // const dealer_id = isBase64(this.props.match.params.dealer_id);
    }

    onChangeCurrency = (e, field) => {

        if (e === 'USD') {
            // this.setState({
            //     currency: 'usd',
            //     currency_price: this.props.user_credit,
            //     currency_unit_price: 1,
            // })
        } else {
            // RestService.exchangeCurrency(e).then((response) => {
            //     if (response.data.status) {
            //         if (this.props.user_credit > 0) {
            //             this.setState({
            //                 currency: e,
            //                 currency_unit_price: response.data.currency_unit,
            //                 currency_price: this.props.user_credit * response.data.currency_unit
            //             })
            //         } else {
            //             this.setState({
            //                 currency: e,
            //                 currency_unit_price: response.data.currency_unit,
            //             })
            //         }
            //     }
            // })
        }
    }

    renderDealerInfo = () => {
        console.log('dealer info:', this.props.dealer);
        let dealer = this.props.dealer;
        if (dealer) {
            const dealer_status = (dealer.account_status === "suspended") ? "Activate" : "Suspend";
            return [
                {
                    key: '1',
                    name: 'Dealer Name:',
                    value: (dealer.dealer_name) ? dealer.dealer_name : 'N/A',
                },
                {
                    key: '2',
                    name: 'Dealer Pin:',
                    value: (dealer.link_code) ? dealer.link_code : 'N/A',
                },
                {
                    key: '3',
                    name: 'Dealer ID:',
                    value: (dealer.dealer_id) ? dealer.dealer_id : 'N/A',
                },
                {
                    key: '4',
                    name: 'Dealer Email:',
                    value: (dealer.dealer_email) ? dealer.dealer_email : 'N/A',
                },
                {
                    key: '5',
                    name: 'Devices:',
                    value: (dealer.connected_devices) ? dealer.connected_devices : 'N/A',
                },
                {
                    key: '6',
                    name: 'Demos:',
                    value: 'N/A',
                },
                {
                    key: '7',
                    name: 'Status:',
                    value: dealer_status,
                },
                {
                    key: '8',
                    name: 'Parent Dealer:',
                    value: (dealer.parent_dealer) ? dealer.parent_dealer : 'N/A',
                },
                {
                    key: '9',
                    name: 'Last Login:',
                    value: (dealer.last_login) ? dealer.last_login : 'N/A',
                },
                {
                    key: '10',
                    name: 'Start Date:',
                    value: this.props.dealer.created,
                },
            ]
        } else {
            return []
        }
    }
    renderAccountData = () => {
        let dealer = this.props.dealer;
        if (dealer) {

            return [
                {
                    key: '1',
                    name: 'Balance (Credits):',
                    value: (dealer.credits) ? dealer.credits : 0,
                },
                {
                    key: '2',
                    name: 'Currency:',
                    value: (
                        <Select defaultValue="USD"
                            onChange={(e) => { this.onChangeCurrency(e, 'currency') }}
                        >
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="CAD">CAD</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                            <Select.Option value="VND">VND</Select.Option>
                            <Select.Option value="CNY">CNY</Select.Option>
                        </Select>
                    ),
                },
                {
                    key: '3',
                    name: 'USD equivalent:',
                    value: '-5214$',
                },
                {
                    key: '4',
                    name: 'Credit Limit (Credits):',
                    value: 'N/A',
                }
            ]
        } else {
            return []
        }
    }
    renderOverDue = () => {
        console.log('dealer info overdue:', this.props.dealer);
        let dealer = this.props.dealer;
        if (dealer) {
            console.log(dealer._0to21,
                dealer._0to21_dues,
                dealer._21to30,
                dealer._21to30_dues,
                dealer._30to60,
                dealer._30to60_dues,
                dealer._60toOnward,
                dealer._60toOnward_dues)
            // _0to21,
            // _0to21_dues,
            // _21to30,
            // _21to30_dues,




            return [
                {
                    key: '1',
                    a: <div><span className="overdue_txt">0-21:</span> <span className="overdue_values">{dealer._0to21_dues}</span></div>,
                    b: <div><span className="overdue_txt">21+:</span> <span className="overdue_values">{dealer._21to30_dues}</span></div>,
                    c: <div><span className="overdue_txt">30+:</span> <span className="overdue_values">{dealer._30to60_dues}</span></div>,
                    d: <div><span className="overdue_txt">60+:</span> <span className="overdue_values">{dealer._60toOnward_dues}</span></div>,
                }
            ]
        } else {
            return []
        }
    }

    render() {

        return (
            <Fragment>
                <AppFilter
                    pageHeading="Dealer Profile Page"
                />
                <Row gutter={16} type="flex" align="top">
                    <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card>
                            <h3>Dealer Info</h3>
                            <Table
                                columns={this.dealerInfoColumns}
                                bordered
                                showHeader={false}
                                dataSource={this.renderDealerInfo()}
                                pagination={false}
                                className="ac_pro_table"
                            />
                        </Card>
                    </Col>
                    <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card className="" style={{ borderRadius: 12 }}>
                            <h2 style={{ textAlign: "center" }}>Account Profile</h2>
                            <Divider className="mb-0" />
                            <Row>
                                <Col span={8} className="text-center ">
                                    <img src={require("assets/images/profile-image.png")} className="mb-8 mt-16"></img>
                                    <h1 className="mb-0" style={{ fontSize: '3vh', textTransform: 'capitalize' }}>{(this.props.dealer) ? this.props.dealer.dealer_name : 'N/A'}</h1>
                                    <p style={{ textTransform: 'capitalize' }}>({(this.props.dealer) ? this.props.dealer.dealer_type : 'N/A'})</p>
                                </Col>
                                <Col span={16} style={{ padding: '0px 15px 0 0', }}>
                                    <Table
                                        columns={this.dealerInfoColumns}
                                        bordered
                                        showHeader={false}
                                        dataSource={this.renderAccountData()}
                                        pagination={false}
                                        className="ac_pro_table"
                                    />
                                    <h4 className="mt-8 border_bottom">Overdue</h4>
                                    <Table
                                        columns={this.overDueColumns}
                                        bordered
                                        showHeader={false}
                                        dataSource={this.renderOverDue()}
                                        pagination={false}
                                        className="ovd_table"
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col className="side_action right_bar" xs={24} sm={24} md={8} lg={8} xl={8} >
                        <Card>
                            <Row gutter={16} type="flex" justify="center" align="top">
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button style={{ width: "100%", marginBottom: 16, }} >
                                        <h6 className="mb-0">Activity</h6>
                                    </Button>
                                </Col>
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        <h6 className="mb-0">Domains</h6>
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        <h6 className="mb-0">Credit Limit</h6>
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        <h6 className="mb-0">DEMO</h6>
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        <h6 className="mb-0">Payment History</h6>
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        <h6 className="mb-0">Sales History</h6>
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row gutter={16} type="flex" justify="center" align="top">
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button disabled style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} >
                                        Pass Reset
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button
                                    disabled
                                        style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                        onClick={() => this.refs.editDealer.showModal(this.props.dealer, this.props.editDealer)}
                                    >
                                        <Icon type='edit' />
                                        Edit
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button disabled style={{ width: "100%", marginBottom: 16, }}>
                                        Suspend/Restrict
                                    </Button>
                                </Col>
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button disabled className="btn_break_line" style={{ width: "100%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }}>
                                        <Icon type="lock" className="lock_icon" />
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                        <EditDealer
                            ref='editDealer'
                            // getDealerList={this.props.getDealerList} 
                            translation={this.props.translation}
                        />

                    </Col>
                </Row>
            </Fragment >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDealerDetails: getDealerDetails,
        editDealer: editDealer
    }, dispatch);
}
var mapStateToProps = ({ dealer_details, settings }, ownProps) => {
    // console.log(dealer_details);
    return {
        dealer: dealer_details.dealer,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDealer);