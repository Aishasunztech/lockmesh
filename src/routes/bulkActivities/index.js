import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Col, Row, Card, Button, Input, Select, Table } from 'antd';
import { getAllDealers } from "../../appRedux/actions/Dealers";
import {
    getBulkDevicesList,
    suspendDevice
} from "../../appRedux/actions/Devices";
// import SuspendDevice from '../devices/components/SuspendDevice';
import { Redirect } from 'react-router-dom'
import {

} from '../../appRedux/actions'

import CustomScrollbars from "../../util/CustomScrollbars";

import AppFilter from '../../components/AppFilter';

import {
    convertToLang, componentSearch
} from '../utils/commonUtils'

import { getUserList } from "../../appRedux/actions/Users";

import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel } from '../../constants/ButtonConstants';
import { devicesColumns } from '../utils/columnsUtils';

import FilterDeives from './components/filterDevices';

var copyDealerAgents = [];
var status = true;
var copy_status = true;
const confirm = Modal.confirm;

class BulkActivities extends Component {
    constructor(props) {
        super(props);

        this.actionList = [
            { key: 'PUSH APPS', value: "Push Apps" },
            { key: 'PULL APPS', value: "Pull Apps" },
            { key: 'PUSH POLICY', value: "Push Policy" },
            { key: 'SET PERMISSIONS', value: "Set Permissions" },
            { key: 'SUSPEND DEVICES', value: "Suspend Devices" },
            { key: 'UNLINK DEVICES', value: "Unlink Devices" },
            { key: 'WIPE DEVICES', value: "Wipe Devices" }
        ];

        let columns = devicesColumns(props.translation, this.handleColumnSearch);
        this.state = {
            columns: columns,
            filteredDevices: [],
            selectedAction: 'Null',
            selectedDealers: [],
            selectedUsers: [],
            dealerList: []
        }
    }

    componentDidMount() {
        this.props.getAllDealers();
        this.props.getUserList();
        // this.props.getBulkDevicesList();

        this.setState({
            filteredDevices: this.props.devices,
            dealerList: this.props.dealerList
        })
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.devices != nextProps.devices) {
        this.setState({
            filteredDevices: nextProps.devices,
            dealerList: this.props.dealerList
        })
        // }
    }


    handleColumnSearch = (e) => {

        let demoDealerAgents = [];
        if (copy_status) {
            copyDealerAgents = this.state.dealerAgents;
            copy_status = false;
        }


        if (e.target.value.length) {

            copyDealerAgents.forEach((agent) => {

                if (agent[e.target.name] !== undefined) {
                    if ((typeof agent[e.target.name]) === 'string') {

                        if (agent[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else if (agent[e.target.name] !== null) {

                        if (agent[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else {

                    }
                } else {
                }
            });
            this.setState({
                dealerAgents: demoDealerAgents
            })
        } else {
            this.setState({
                dealerAgents: copyDealerAgents
            })
        }
    }

    handleComponentSearch = (value) => {

        if (value.length) {

            // console.log('length')

            if (status) {
                copyDealerAgents = this.state.dealerAgents;
                status = false;
            }

            let foundDealerAgents = componentSearch(copyDealerAgents, value);
            // console.log('found devics', foundUsers)
            if (foundDealerAgents.length) {
                this.setState({
                    dealerAgents: foundDealerAgents,
                })
            } else {
                this.setState({
                    dealerAgents: []
                })
            }
        } else {
            // status = true;

            this.setState({
                dealerAgents: copyDealerAgents,
            })
        }

    }

    handleMultipleSelect = () => {
        // console.log('value is: ', e);
        let data = {}
        console.log(" this.state.selectedDealers ", this.state.selectedDealers)
        console.log(" this.state.selectedUsers ", this.state.selectedUsers)


        if (this.state.selectedDealers.length || this.state.selectedUsers.length) {
            console.log('hi')
            data = {
                dealers: this.state.selectedDealers,
                users: this.state.selectedUsers
            }

            // console.log('handle change data is: ', data)
            this.props.getBulkDevicesList(data);
            this.props.getAllDealers();

        } else {
            this.setState({ filteredDevices: [] });
        }
    }

    applyAction = () => {
        console.log('action apply')
    }

    handleCancel = (value, lable) => {
        // // console.log('value ', value)
        // // console.log('lable ', lable)


        // let selectedDealers = this.state.selectedDealers;
        // let selectedUsers = this.state.selectedUsers;

        // if (lable == "dealer") {
        //     selectedDealers = selectedDealers.filter(e => e.key !== value.key)
        // }
        // else if (lable == "user") {
        //     selectedUsers = selectedUsers.filter(e => e.key !== value.key)
        // }
        // this.setState({
        //     selectedDealers,
        //     selectedUsers
        // })

        this.handleMultipleSelect();
    }

    handleAction = (e) => {
        this.setState({ selectedAction: e });
        console.log('e is ', e)

        // if (e !== "NULL") {
        //     if (e === "SUSPEND DEVICES") {
        //         this.refs.suspend.handleSuspendDevice(this.props.devices, "bulk");
        //     }
        // }
    }

    render() {
        // let actionList = [];
        // console.log('this.state.selectedDealers ', this.state.selectedDealers)
        if (this.props.location.state) {
            return (
                <Fragment>
                    <Card >
                        <Row gutter={16} className="filter_top">
                            <Col className="col-md-6 col-sm-6 col-xs-6 vertical_center">
                                <span className="font_26"> {convertToLang(this.props.translation[""], "BULK ACTIVITIES")} </span>
                            </Col>
                        </Row>
                        <div>
                            <h2>
                                {convertToLang(this.props.translation[""], ` Please select from fields bellow to perform a task on ALL or Selected Devices. You can Track your activities in the "HISTORY" button bellow.`)}
                            </h2>
                        </div>
                        <div>
                            <Button type="primary">
                                {convertToLang(this.props.translation[""], "History")}
                            </Button>
                        </div>

                    </Card>

                    <Card >
                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Action to be performed:")} </span>
                            </Col>
                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    style={{ width: '100%' }}
                                    className="pos_rel"
                                    // onChange={(e) => this.handleMultipleSelect(e, "action")}
                                    placeholder={convertToLang(this.props.translation[""], "Select any action")}
                                    onChange={this.handleAction}
                                >
                                    <Select.Option value="Null">{convertToLang(this.props.translation[""], "Select any action")}</Select.Option>
                                    {this.actionList.map((item, index) => {
                                        return (<Select.Option key={item.id} value={item.key}>{item.value}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                            {/* <Col className="col-md-2 col-sm-2 col-xs-2">
                                <Button type="primary" onClick={this.applyAction} >Apply Action</Button>
                            </Col> */}
                        </Row>
                        <p>Selected: <span className="font_26">{this.state.selectedAction.toUpperCase()}</span></p>

                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Dealers:")} </span>
                            </Col>

                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    mode="multiple"
                                    labelInValue
                                    maxTagCount="2"
                                    style={{ width: '100%' }}
                                    placeholder={convertToLang(this.props.translation[""], "Select Dealers")}
                                    onChange={(e) => { console.log(e); this.setState({ selectedDealers: e }) }}
                                    onDeselect={(e) => this.handleCancel(e, "dealer")}
                                    onBlur={() => { this.handleMultipleSelect() }}
                                >
                                    {this.props.dealerList.map((item, index) => {
                                        return (<Select.Option key={item.id} value={item.dealer_id}>{item.dealer_name}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <br />
                        <p>Dealers Selected: <span className="font_26">{(this.state.selectedDealers.length) ? this.state.selectedDealers.map((item) => `${item.label}, `) : "NULL"}</span></p>
                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Users:")} </span>
                            </Col>

                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    mode="multiple"
                                    labelInValue
                                    maxTagCount="2"
                                    style={{ width: '100%' }}
                                    onBlur={this.handleMultipleSelect}
                                    onDeselect={(e) => this.handleCancel(e, "user")}
                                    placeholder={convertToLang(this.props.translation[""], "Select Users")}
                                    onChange={(e) => this.setState({ selectedUsers: e })}
                                >
                                    {this.props.users_list.map((item, index) => {
                                        return (<Select.Option key={item.id} value={item.user_id}>{item.user_name}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <br />
                        <p>Users Selected: <span className="font_26">{(this.state.selectedUsers.length) ? this.state.selectedUsers.map((item) => `${item.label}, `) : "NULL"}</span></p>

                        <FilterDeives
                            devices={this.state.filteredDevices}
                            selectedDealers={this.state.selectedDealers}
                            selectedUsers={this.state.selectedUsers}
                            handleActionValue={this.state.selectedAction}
                            suspendDevice={this.props.suspendDevice}
                        />

                    </Card>

                    {/* <SuspendDevice
                        ref="suspend"
                        suspendDevice={this.props.suspendDevice}
                        translation={this.props.translation}
                    /> */}

                </Fragment>

            )
        } else {
            return (
                <Redirect to={{
                    pathname: '/app',
                }} />
            )
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getBulkDevicesList: getBulkDevicesList,
        getAllDealers: getAllDealers,
        getUserList: getUserList,
        suspendDevice: suspendDevice,
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, settings, dealers, devices, users }) => {
    console.log('devices.bulkDevices ', devices.bulkDevices)
    return {
        devices: devices.bulkDevices,
        users_list: users.users_list,
        dealerList: dealers.dealers,
        user: auth.authUser,
        routing: routing,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkActivities);