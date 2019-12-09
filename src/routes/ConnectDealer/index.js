// libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// methods, constants and components
import AppFilter from '../../components/AppFilter';
import DealerAction from "./components/DealerActions";
import DealerNotFoundPage from '../InvalidPage/dealerNotFound';
import CircularProgress from "components/CircularProgress/index";

// helpers and actions
import RestService from "../../appRedux/services/RestServices";
import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
import {
    getDealerDetails,
    editDealer,
    updatePassword,
    suspendDealer,
    activateDealer,
    deleteDealer,
    undoDealer,
    getDealerPaymentHistory,
    setCreditLimit,
    getDealerSalesHistory,
    getDealerDomains,
    getAllDealers,
    changeDealerStatus,
    getDomains,
    connectDealerDomainPermission
} from '../../appRedux/actions'
import styles from './connect_dealer.css'

class ConnectDealer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dealer_id: isBase64(props.match.params.dealer_id),
            currency: 'USD',
            currency_sign: '$',
            currency_unit_price: 1
        }
        this.dealerInfoColumns1 = [
            {
                dataIndex: 'name',
                key: 'name',
                className: 'ac_pro_txt',
            },
            {
                dataIndex: 'value',
                key: 'value',
                className: 'ac_pro_val',
            },
        ]
        this.dealerInfoColumns = [
            {
                dataIndex: 'name',
                key: 'name',
                className: 'dealer_info',
                title: 'Status',
            },
            {
                dataIndex: 'value',
                key: 'value',
                className: '',
                title: '',

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
            // {
            //     title: 'C',
            //     dataIndex: 'c',
            //     key: 'c',
            //     className: '',
            // },
            // {
            //     title: 'D',
            //     dataIndex: 'd',
            //     key: 'd',
            //     className: '',
            // },
        ]
    }

    componentDidMount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
        if (dealer_id) {
            this.props.getDealerDetails(dealer_id);
            this.props.getAllDealers();
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
            this.setState({
                currency: 'usd',
                currency_price: null,
                currency_unit_price: 1,
            })
        } else {
            RestService.exchangeCurrency(e).then((response) => {
                if (response.data.status) {
                    if (this.props.dealer.credits > 0) {
                        this.setState({
                            currency: e,
                            currency_unit_price: response.data.currency_unit,
                            currency_price: this.props.dealer.credits * response.data.currency_unit
                        })
                    } else {
                        this.setState({
                            currency: e,
                            currency_unit_price: response.data.currency_unit,
                        })
                    }
                }
            })
        }
    }

    renderDealerInfo = () => {
        let dealer = this.props.dealer;
        if (dealer) {
            // const dealer_status = (dealer.unlink_status == 1) ? "Archived" : (dealer.account_status === "suspended") ? "Suspend" : "Active";
            return [
                // {
                //     key: '7',
                //     name: <a>Status</a>,
                //     value: dealer_status,
                // },
                {
                    key: '1',
                    name: <a>Dealer Name</a>,
                    value: (dealer.dealer_name) ? dealer.dealer_name : 'N/A',
                },
                {
                    key: '2',
                    name: <a>Dealer Pin</a>,
                    value: (dealer.link_code) ? dealer.link_code : 'N/A',
                },
                {
                    key: '3',
                    name: <a>Dealer ID</a>,
                    value: (dealer.dealer_id) ? dealer.dealer_id : 'N/A',
                },
                {
                    key: '4',
                    name: <a>Dealer Email</a>,
                    value: (dealer.dealer_email) ? dealer.dealer_email : 'N/A',
                },
                {
                    key: '5',
                    name: <a>Devices</a>,
                    value: (dealer.connected_devices) ? dealer.connected_devices : 'N/A',
                },
                {
                    key: '6',
                    name: <a>Demos</a>,
                    value: 'N/A',
                },
                {
                    key: '8',
                    name: <a>Parent Dealer</a>,
                    value: (dealer.parent_dealer) ? dealer.parent_dealer : 'N/A',
                },
                {
                    key: '10',
                    name: <a>Start Date</a>,
                    value: this.props.dealer.created,
                },
                {
                    key: '9',
                    name: <a>Last Login</a>,
                    value: (dealer.last_login) ? dealer.last_login : 'N/A',
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
                        <Select style={{ margin: '-8px 0', width: '100%' }} defaultValue="USD" onChange={(e) => { this.onChangeCurrency(e, 'currency') }} >
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
                    value: (this.state.currency_price) ? this.state.currency_price : dealer.credits,
                },
                {
                    key: '4',
                    name: 'Credit Limit (Credits):',
                    value: Math.abs(dealer.credits_limit),
                }
            ]
        } else {
            return []
        }
    }

    renderOverDue = () => {
        let dealer = this.props.dealer;
        if (dealer) {
            // console.log(dealer._0to21,
            //     dealer._0to21_dues,
            //     dealer._21to30,
            //     dealer._21to30_dues,
            //     dealer._30to60,
            //     dealer._30to60_dues,
            //     dealer._60toOnward,
            //     dealer._60toOnward_dues)
            // _0to21,
            // _0to21_dues,
            // _21to30,
            // _21to30_dues,
            return [
                {
                    key: '1',
                    a: <div><span className="overdue_txt">0-21:</span> <span className="overdue_values">{dealer._0to21_dues}</span></div>,
                    b: <div><span className="overdue_txt">21+:</span> <span className="overdue_values">{dealer._21to30_dues}</span></div>,
                    // c: <div><span className="overdue_txt">30+:</span> <span className="overdue_values">{dealer._30to60_dues}</span></div>,
                    // d: <div><span className="overdue_txt">60+:</span> <span className="overdue_values">{dealer._60toOnward_dues}</span></div>,
                },
                {
                    key: '2',
                    // a: <div><span className="overdue_txt">0-21:</span> <span className="overdue_values">{dealer._0to21_dues}</span></div>,
                    // b: <div><span className="overdue_txt">21+:</span> <span className="overdue_values">{dealer._21to30_dues}</span></div>,
                    a: <div><span className="overdue_txt">30+:</span> <span className="overdue_values">{dealer._30to60_dues}</span></div>,
                    b: <div><span className="overdue_txt">60+:</span> <span className="overdue_values">{dealer._60toOnward_dues}</span></div>,
                }
            ]
        } else {
            return []
        }
    }

    render() {
        let dealer = this.props.dealer;
        let dealer_status = '';
        if (dealer) {
            dealer_status = (dealer.unlink_status == 1) ? "Archived" : (dealer.account_status === "suspended") ? "Suspend" : "Active";
        }
        console.log("dealer_status ", dealer_status)
        this.dealerInfoColumns[1].title = dealer_status;
        return (

            <Fragment>
                {this.props.isLoading ? <CircularProgress /> : this.props.dealer ?
                    <Fragment>
                        <AppFilter
                            pageHeading="Dealer Profile Page"
                        />
                        {/* {this.props.dealer ? */}
                        <Row gutter={16} type="flex" align="top">

                            {/* Dealer Information */}
                            <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Card style={{ borderRadius: 12 }} className="height_auto">
                                    <h2 style={{ textAlign: "center" }}>Dealer Info</h2>
                                    <Divider className="mb-0" />
                                    <Table
                                        columns={this.dealerInfoColumns}
                                        bordered
                                        // showHeader={false}
                                        dataSource={this.renderDealerInfo()}
                                        pagination={false}
                                        className="ac_pro_table profile_table"
                                    />
                                </Card>
                            </Col>

                            {/* Dealer Account Information */}
                            <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Card className="" style={{ borderRadius: 12 }}>
                                    <h2 style={{ textAlign: "center" }}>Account Profile</h2>
                                    <Divider className="mb-0" />
                                    <Row>
                                        <Col span={24} className="text-center">
                                            <div className="text-left">
                                                <img src={require("assets/images/profile-image.png")} className="prof_pic" width="85px" />
                                                <div className="name_type">
                                                    <h1 className="mb-0 d_n_vh_vw">{(this.props.dealer) ? this.props.dealer.dealer_name : 'N/A'}</h1>
                                                    <p style={{ textTransform: 'capitalize', }}>({(this.props.dealer) ? this.props.dealer.dealer_type : 'N/A'})</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <Table
                                                columns={this.dealerInfoColumns1}
                                                bordered
                                                showHeader={false}
                                                dataSource={this.renderAccountData()}
                                                pagination={false}
                                                className="ac_pro_table"
                                            />
                                            <h4 className="mt-13 border_bottom">Overdue</h4>
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
                            {/* Dealer Action Buttons */}
                            <Col className="side_action right_bar" xs={24} sm={24} md={8} lg={8} xl={8} >
                                <DealerAction
                                    // translation
                                    translation={this.props.translation}

                                    // dealer information
                                    dealerList={this.props.dealerList}
                                    dealer={this.props.dealer}
                                    paymentHistory={this.props.paymentHistory}
                                    salesHistory={this.props.salesHistory}
                                    domains={this.props.domains}
                                    history={this.props.history}
                                    authUser={this.props.authUser}
                                    allDomainList={this.props.allDomainList}
                                    // dealer actions
                                    updatePassword={this.props.updatePassword}
                                    editDealer={this.props.editDealer}

                                    suspendDealer={this.props.suspendDealer}
                                    activateDealer={this.props.activateDealer}
                                    deleteDealer={this.props.deleteDealer}
                                    undoDealer={this.props.undoDealer}

                                    getDomains={this.props.getDomains}
                                    getDealerDomains={this.props.getDealerDomains}
                                    getDealerPaymentHistory={this.props.getDealerPaymentHistory}
                                    setCreditLimit={this.props.setCreditLimit}
                                    getDealerSalesHistory={this.props.getDealerSalesHistory}
                                    changeDealerStatus={this.props.changeDealerStatus}
                                    domainPermission={this.props.domainPermission}
                                />
                            </Col>
                        </Row>
                    </Fragment>
                    : <DealerNotFoundPage />
                }
            </Fragment >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDealerDetails: getDealerDetails,
        editDealer: editDealer,
        updatePassword: updatePassword,
        suspendDealer: suspendDealer,
        activateDealer: activateDealer,
        deleteDealer: deleteDealer,
        undoDealer: undoDealer,
        getDealerPaymentHistory: getDealerPaymentHistory,
        setCreditLimit: setCreditLimit,
        getDealerSalesHistory: getDealerSalesHistory,
        getDealerDomains: getDealerDomains,
        getAllDealers: getAllDealers,
        changeDealerStatus: changeDealerStatus,
        getDomains: getDomains,
        domainPermission: connectDealerDomainPermission
    }, dispatch);
}

var mapStateToProps = ({ dealer_details, dealers, settings, auth, account }) => {
    // console.log("test: ", account);
    return {
        translation: settings.translation,
        dealer: dealer_details.dealer,
        dealerList: dealers.dealers, // dealers.parent_dealers,
        domains: dealer_details.domains,
        allDomainList: account.domainList,
        paymentHistory: dealer_details.paymentHistory,
        salesHistory: dealer_details.salesHistory,
        isLoading: dealer_details.connectDealerLoading,
        authUser: auth.authUser,
        // dealers: dealers.textTransform
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDealer);