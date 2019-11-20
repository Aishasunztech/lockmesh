// libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table } from "antd";

// methods, constants and components
import AppFilter from '../../components/AppFilter';

import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
import { Edit_Profile } from "../../constants/Constants";
import styles from './connect_dealer.css'

const success = Modal.success
const error = Modal.error
const TabPane = Tabs.TabPane;
const dataSource_ac_pro = [
    {
        key: '1',
        name: 'Balance (Credits):',
        age: '-5144',
    },
    {
        key: '2',
        name: 'Currency:',
        age: 'USD',
    },
    {
        key: '3',
        name: 'USD equivalent:',
        age: '-5214$',
    },
    {
        key: '4',
        name: 'Credit Limit (Credits):',
        age: '15000',
    },
];
const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        className: 'ac_pro_txt',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        className: 'ac_pro_val',
    },
];
const dataSource_overdue = [
    {
        key: '1',
        a: <div><span className="overdue_txt">0-21:</span> <span className="overdue_values">0</span></div>,
        b: <div><span className="overdue_txt">21+:</span> <span className="overdue_values">2</span></div>,
        c: <div><span className="overdue_txt">30+:</span> <span className="overdue_values">1</span></div>,
        d: <div><span className="overdue_txt">60+:</span> <span className="overdue_values">0</span></div>,
    },
];
const columns_overdue = [
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
];


class ConnectDealer extends Component {
    constructor(props) {
        super(props);
        this.state = {

            dealer_id: isBase64(props.match.params.dealer_id),
        }
        // console.log("hello every body", this.props);
    }
    // componentDidMount() {
    //     const dealer_id = isBase64(this.props.match.params.dealer_id);
    //     alert(dealer_id);
    // }
    componentDidUpdate(prevProps) {
        // console.log('hi')
        const dealer_id = isBase64(this.props.match.params.dealer_id);

    }
    componentWillReceiveProps(nextProps) {
        const dealer_id = isBase64(nextProps.match.params.dealer_id);

    }
    componentWillUnmount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
    }

    render() {

        return (
            <Fragment>
                <AppFilter
                    pageHeading="Dealer Profile Page"
                />
                <Row gutter={16} type="flex" align="top">
                    <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                        <h3>Dealer Info</h3>
                    </Col>
                    <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card className="" style={{ borderRadius: 12 }}>
                            <h2 style={{ textAlign: "center" }}>Account Profile</h2>
                            <Divider className="mb-0" />
                            <Row>
                                <Col span={8} className="text-center ">
                                    <img src={require("assets/images/profile-image.png")} className="mb-8 mt-16"></img>
                                    <h1 className="mb-0" style={{ fontSize: '3vh' }}>Barry</h1>
                                    <p>(Dealer)</p>
                                </Col>
                                <Col span={16} style={{ padding: '0px 15px 0 0', }}>
                                    <Table
                                        columns={columns}
                                        bordered
                                        showHeader={false}
                                        dataSource={dataSource_ac_pro}
                                        pagination={false}
                                        className="ac_pro_table"
                                    />
                                    <h4 className="mt-8 border_bottom">Overdue</h4>
                                    <Table
                                        columns={columns_overdue}
                                        bordered
                                        showHeader={false}
                                        dataSource={dataSource_overdue}
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
                                    <Button style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} >
                                        Pass Reset
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}>
                                        <Icon type='edit' />
                                        Edit
                                    </Button>
                                </Col>
                                <Col className="gutter-row" justify="center" span={12} >
                                    <Button style={{ width: "100%", marginBottom: 16, }}>
                                        Suspend/Restrict
                                    </Button>
                                </Col>
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button className="btn_break_line" style={{ width: "100%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }}>
                                        <Icon type="lock" className="lock_icon" />
                                        Delete
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Fragment >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ routing, device_details, auth, socket, settings }, ownProps) => {


    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDealer);