import React, { Component, Fragment } from "react";
import { Col, Row, Icon, Card, Avatar, Badge } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Auxiliary from "util/Auxiliary";
import { Link } from 'react-router-dom'
import AppFilter from '../../components/AppFilter';
import { getStatus, componentSearch, titleCase, convertToLang } from '../utils/commonUtils';
import {
    ADMIN,
    DEALER,
    SDEALER,
} from '../../constants/Constants'
import styles from './dashboard.css'



import {
    getDashboardData
} from "../../appRedux/actions/Dashboard";


class Dashboard extends Component {
    constructor(props) {
        super(props)
    }


    componentDidMount() {
        this.props.getDashboardData();
    }

    render() {
        return (
            <div>
                <AppFilter
                    // searchPlaceholder={convertToLang(this.props.translation[''], "Search")}
                    // defaultPagingValue={this.state.defaultPagingValue}
                    // addButtonText={convertToLang(this.props.translation[Button_Add_User], "Add User")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    // isAddButton={this.props.user.type !== ADMIN}
                    // isAddUserButton={true}
                    // AddPolicyModel={true}
                    // handleUserModal={this.handleUserModal}
                    // handleCheckChange={this.handleCheckChange}
                    // handlePagination={this.handlePagination}
                    // handleComponentSearch={this.handleComponentSearch}
                    // translation={this.props.translation}
                    // pageHeading={convertToLang(this.props.translation[''], "Dashboard")}
                    pageHeading="Dashboard"
                />

                <Auxiliary>

                    <Row>
                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'><Link to='devices'>
                                <Card className='dashboard-card'>
                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                    <Avatar
                                        src={require("../../assets/images/dashboard/active_device.png")}
                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                        alt=""
                                    />
                                </Card>
                                <div className="dash_btm_txt">
                                    <span className='db-span-qnty'>{this.props.items.activeDevices}</span>
                                    <span className='db-span-text'>Active Devices</span>
                                </div>
                            </Link>
                            </div>
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'>
                                <Link to='devices' className="">

                                    <Card className='dashboard-card'>
                                        <Avatar
                                            src={require("../../assets/images/dashboard/online_device.png")}
                                            // className="gx-size-40 gx-pointer gx-mr-3"
                                            alt=""
                                        />
                                    </Card>
                                    <div className="dash_btm_txt">
                                        <span className='db-span-qnty'>{this.props.items.onlineDevices}</span>
                                        <span className='db-span-text'>Online Devices</span>
                                    </div>
                                </Link>
                            </div>
                        </Col>
                        {
                            this.props.authUser.type == DEALER || this.props.authUser.type == SDEALER ?

                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                    <div className='dashboard-item-div'>
                                        <Link to='devices'>
                                            <Badge count={1} >
                                                <Card className='dashboard-card head-example'>
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/link_device.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                            </Badge>
                                            <div className="dash_btm_txt">
                                                <span className='db-span-qnty'>{this.props.items.link_requests}</span>
                                                <span className='db-span-text'>Link Request</span>
                                            </div>
                                        </Link>
                                    </div>
                                </Col> : null
                        }

                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'>
                                <Link to='users'>
                                    <Card className='dashboard-card'>
                                        {/* <i className="icon icon-user dashboard-icon " aria-hidden="true" /> */}
                                        <Avatar
                                            src={require("../../assets/images/dashboard/users.png")}
                                            // className="gx-size-40 gx-pointer gx-mr-3"
                                            alt=""
                                        />
                                    </Card>
                                    <div className="dash_btm_txt">
                                        <span className='db-span-qnty'>{this.props.items.users}</span>
                                        <span className='db-span-text'>Users</span>
                                    </div>
                                </Link>
                            </div>
                        </Col>

                        {
                            this.props.authUser.type == ADMIN ?

                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                    <div className='dashboard-item-div'>
                                        <Link to='dealer/dealer'>
                                            <Card className='dashboard-card'>
                                                {/* <i className="icon icon-avatar dashboard-icon " aria-hidden="true" /> */}
                                                <Avatar
                                                    src={require("../../assets/images/dashboard/dealers.png")}
                                                    // className="gx-size-40 gx-pointer gx-mr-3"
                                                    alt=""
                                                />
                                            </Card>
                                            <div className="dash_btm_txt">
                                                <span className='db-span-qnty'>{this.props.items.dealers}</span>
                                                <span className='db-span-text'>Dealers</span>
                                            </div>
                                        </Link>
                                    </div>
                                </Col> : null
                        }


                        {
                            this.props.authUser.type == ADMIN || this.props.authUser.type == DEALER ?
                                <Fragment>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='dealer/sdealer'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="icon icon-avatar dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/sdealers.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.sdealers}</span>
                                                    <span className='db-span-text'>S-Dealers</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>

                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='policy'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/policy.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.policies}</span>
                                                    <span className='db-span-text'>Manage Policy</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='apk-list'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="icon icon-apps dashboard-icon " aria-hidden="true" /> */}

                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/manageApks.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.apks}</span>
                                                    <span className='db-span-text'>Manage APK's</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='app-market'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/secure_market.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>Secure Market</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                </Fragment> : null
                        }

                        {
                            this.props.authUser.type == ADMIN ?
                                <Fragment>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='set-prices'>
                                                <Card className='dashboard-card'>
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/package.png")}
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>Packages & ID</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='account/managedata'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/managedata.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>Manage Data</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            {/* <Link to='devices'> */}
                                            <Card className='dashboard-card'>
                                                {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                <Avatar
                                                    src={require("../../assets/images/dashboard/credits.png")}
                                                    // className="gx-size-40 gx-pointer gx-mr-3"
                                                    alt=""
                                                />
                                            </Card>
                                            <div className="dash_btm_txt">
                                                {/* <span className='db-span-qnty'>12</span> */}
                                                <span className='db-span-text'>Credits</span>
                                            </div>
                                            {/* </Link> */}
                                        </div>
                                    </Col>
                                </Fragment> : null
                        }

                    </Row>


                </Auxiliary>
            </div>

        );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDashboardData: getDashboardData
    }, dispatch);
}
var mapStateToProps = ({ dashboard, auth }) => {
    console.log("dashboard::", auth.authUser);
    return {
        items: dashboard.dashboard_items,
        authUser: auth.authUser
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);