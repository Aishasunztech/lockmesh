import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Col, Row, Card, Button, Input, Select, Table, Icon, Tag } from 'antd';
import { getAllDealers } from "../../appRedux/actions/Dealers";
import HistoryModal from "./components/bulkHistory";
import TableHistory from "./components/TableHistory";
import {
    getBulkDevicesList,
    bulkSuspendDevice,
    bulkActivateDevice,
    getbulkHistory,
    // getUsersOfDealers,

    applyBulkPushApps,
    applyBulkPullApps,
    setBulkPushApps,
    setBulkPullApps,
    setSelectedBulkDevices,
    unlinkBulkDevices,
    wipeBulkDevices,
    closeResponseModal,
    applyBulkPolicy
} from "../../appRedux/actions/BulkDevices";

import { getPolicies } from "../../appRedux/actions/ConnectDevice";

// import {
//     connectSocket,
//     ackFinishedBulkPushApps,
//     ackFinishedPullApps,
//     ackFinishedPolicy,
//     ackFinishedWipe,
//     actionInProcess,
//     ackImeiChanged,
//     getAppJobQueue,
//     ackSinglePushApp,
//     ackSinglePullApp,
//     ackFinishedPolicyStep,
//     receiveSim,
//     hello_web,
//     closeConnectPageSocketEvents,
//     ackInstalledApps,
//     ackUninstalledApps,
//     ackSettingApplied,
//     sendOnlineOfflineStatus,
//     deviceSynced
// } from "../../appRedux/actions/Socket";

import {
    showHistoryModal,
    showSaveProfileModal,
    saveProfile,
    savePolicy,
    hanldeProfileInput,
    transferDeviceProfile,
    getDealerApps,
    loadDeviceProfile,
    showPushAppsModal,
    showPullAppsModal,
    // applyPushApps,
    // applyPullApps,
    writeImei,
    getActivities,
    hidePolicyConfirm,
    // applyPolicy,
    applySetting,
    getProfiles,
    wipe,
    simHistory
} from "../../appRedux/actions/ConnectDevice";

import CustomScrollbars from "../../util/CustomScrollbars";

// import {
//     convertToLang,
//     componentSearch
// } from '../utils/commonUtils'

import { getUserList } from "../../appRedux/actions/Users";
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays, componentSearch, titleCase, convertToLang, checkRemainTermDays } from '../utils/commonUtils'
// import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel, Button_Edit, Button_Ok } from '../../constants/ButtonConstants';
import { devicesColumns, userDevicesListColumns } from '../utils/columnsUtils';

import FilterDevices from './components/filterDevices';
import PushPullApps from './components/pushPullApps';

import {
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_SUSPENDED,
    DEVICE_ACTIVATED
} from '../../constants/Constants'
import { DO_YOU_WANT_TO_APPLY } from '../../constants/DeviceConstants';

var copyDealerAgents = [];
var status = true;
var copy_status = true;
const confirm = Modal.confirm;

class BulkActivities extends Component {
    constructor(props) {
        super(props);
        this.pushAppsModalColumns = [
            {
                title: "#",
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                render: (text, record, index) => ++index,
            },
            {
                title: 'DEVICE ID',
                align: "center",
                dataIndex: 'device_id',
                key: "device_id",
                // sortDirections: ['ascend', 'descend'],

            }
        ]

        this.actionList = [
            { key: 'PUSH APPS', value: "Push Apps" },
            { key: 'PULL APPS', value: "Pull Apps" },
            { key: 'PUSH POLICY', value: "Push Policy" },
            // { key: 'SET PERMISSIONS', value: "Set Permissions" },
            { key: 'ACTIVATE DEVICES', value: "Activate Devices" },
            { key: 'SUSPEND DEVICES', value: "Suspend Devices" },
            { key: 'UNLINK DEVICES', value: "Unlink Devices" },
            { key: 'WIPE DEVICES', value: "Wipe Devices" }
        ];

        // let columns = devicesColumns(props.translation, this.handleColumnSearch);



        let columns = userDevicesListColumns(props.translation, this.handleSearch);

        this.state = {
            columns: columns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
            filteredDevices: [],
            selectedAction: "NOT SELECTED",
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            historyModalShow: false,
            allUsers: [],
            allDealers: [],

            pushAppsModal: false,
            pullAppsModal: false,
            apk_list: [],
            bulkResponseModal: false,
            handleModalBtn: false,
            checkAllSelectedDealers: false,
            checkAllSelectedUsers: false,
            selectedPolicy: '',
        }
    }


    // Start Action Related
    onPushAppsSelection = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedPushApps: selectedRows,
            selectedPushAppKeys: selectedRowKeys
        })

    }

    onPullAppsSelection = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedPullApps: selectedRows,
            selectedPullAppKeys: selectedRowKeys
        })
    }



    showPushAppsModal = (visible) => {
        this.setState({
            pushAppsModal: visible,
        })
    }

    showPullAppsModal = (visible) => {
        this.setState({
            pullAppsModal: visible,
        })
    }

    onCancelModel = () => {
        this.setState({
            selectedPushAppKeys: [],
            selectedPullAppKeys: [],
            pushApps: [],
            pullApps: []
        })
    }




    onPullAppsSelection = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedPullApps: selectedRows,
            selectedPullAppKeys: selectedRowKeys
        })
    }


    // End Action related

    handleTableChange = (pagination, query, sorter) => {
        // console.log('check sorter func: ', sorter)
        let columns = this.state.columns;

        columns.forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }




    componentDidMount() {
        this.props.getAllDealers();
        this.props.getUserList();
        this.props.getDealerApps();
        this.props.getPolicies();


        this.setState({
            filteredDevices: this.props.devices,
            dealerList: this.props.dealerList,
        })
    }


    componentWillReceiveProps(nextProps) {
        // console.log('hi')
        if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
            // console.log('componentWillReceiveProps ', nextProps.devices)
            this.setState({
                filteredDevices: nextProps.devices,
                dealerList: this.props.dealerList
            })
        }

        // if (nextProps.socket) {
        //     // if (this.props.socket === null && nextProps.socket !== null) {

        //     console.log("socket connected component: ", nextProps.socket.connected)
        //     if (nextProps.socket.connected) {
        //         nextProps.ackFinishedBulkPushApps(nextProps.socket, nextProps.queue_device_ids);
        //         // nextProps.ackFinishedPullApps(nextProps.socket, queue_device_ids);
        //         // nextProps.ackFinishedPolicy(nextProps.socket, queue_device_ids);
        //         // nextProps.ackFinishedWipe(nextProps.socket, queue_device_ids);
        //     }
        // }


        let allDealers = nextProps.dealerList.map((item) => {
            return ({ key: item.dealer_id, label: item.dealer_name })
        });

        let allUsers = nextProps.users_list.map((item) => {
            return ({ key: item.user_id, label: item.user_name })
        });
        this.setState({ allUsers, allDealers })
    }

    componentDidUpdate(prevProps) {
        // console.log("this.props.bulkResponseModal !== prevProps.bulkResponseModal ", this.props.bulkResponseModal, prevProps.bulkResponseModal)
        if (this.props.bulkResponseModal !== prevProps.bulkResponseModal) {
            // console.log("hi")
            this.setState({
                bulkResponseModal: this.props.bulkResponseModal
            })
        }
        //  else {
        //     this.state.bulkResponseModal = false;
        // }
    }

    handleCancelResponseModal = () => {
        this.setState({
            bulkResponseModal: false
        })
        this.props.closeResponseModal();
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
            this.setState({
                dealerAgents: copyDealerAgents,
            })
        }

    }

    handleMultipleSelect = () => {
        // console.log('value is: ', e);
        let data = {}

        if (this.state.selectedDealers.length || this.state.selectedUsers.length) {
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



    handleCancel = (e, dealerOrUser = '') => {

        if (dealerOrUser == "dealers") {
            let updateDealers = this.state.selectedDealers.filter(item => item.key != e.key);
            this.state.selectedDealers = updateDealers;
            this.state.checkAllSelectedDealers = false;
        } else if (dealerOrUser == "users") {
            let updateUsers = this.state.selectedUsers.filter(item => item.key != e.key);
            this.state.selectedUsers = updateUsers;
            this.state.checkAllSelectedUsers = false;
        }

    }

    historyModal = () => {
        // console.log('hi')
        this.setState({ historyModalShow: true });

        this.props.getbulkHistory();
    }

    handleHistoryCancel = () => {
        // console.log('hi')
        this.setState({ historyModalShow: false });
    }

    renderResponseList(list) {
        // console.log("list: ", list);
        return list.map(item => {
            return {
                device_id: item
            }
        })
    }

    renderList(list) {
        // console.log('renderList ', list)
        return list.map((device, index) => {

            var status = device.finalStatus;
            // console.log("status ", status)

            let color = getColor(status);
            var style = { margin: '0', width: 'auto', textTransform: 'uppercase' }
            // var text = convertToLang(this.props.translation[Button_Edit], "EDIT");

            // if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
            //     style = { margin: '0 8px 0 0', width: 'auto', display: 'none', textTransform: 'uppercase' }
            //     text = "ACTIVATE";
            // }

            return {
                rowKey: index,
                // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
                counter: ++index,

                status: (<span style={color} > {status}</span>),
                lastOnline: checkValue(device.lastOnline),
                flagged: device.flagged,
                type: checkValue(device.type),
                version: checkValue(device.version),
                device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
                // device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
                user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
                validity: checkValue(device.validity),
                transfered_to: checkValue((device.finalStatus == "Transfered") ? device.transfered_to : null),
                name: checkValue(device.name),
                activation_code: checkValue(device.activation_code),
                account_email: checkValue(device.account_email),
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                client_id: checkValue(device.client_id),
                dealer_id: checkValue(device.dealer_id),
                dealer_pin: checkValue(device.link_code),
                mac_address: checkValue(device.mac_address),
                sim_id: checkValue(device.sim_id),
                imei_1: checkValue(device.imei),
                sim_1: checkValue(device.simno),
                imei_2: checkValue(device.imei2),
                sim_2: checkValue(device.simno2),
                serial_number: checkValue(device.serial_number),
                model: checkValue(device.model),
                // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                dealer_name: <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a>,
                // dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
                online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
                s_dealer: checkValue(device.s_dealer),
                s_dealer_name: checkValue(device.s_dealer_name),
                remainTermDays: device.remainTermDays,
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }

    handleChangeUser = (values) => {
        console.log("values ", values);
        // console.log("handleChangeUser values ", values, this.state.selectedUsers, this.props.users_list, this.state.allUsers);
        let checkAllUsers = this.state.checkAllSelectedUsers

        let selectAll = values.filter(e => e.key === "all");
        let selectedUsers = values.filter(e => e.key !== "all");


        if (selectAll.length > 0) {
            checkAllUsers = !this.state.checkAllSelectedUsers;
            if (this.state.checkAllSelectedUsers) {
                selectedUsers = [];
            } else {
                selectedUsers = this.state.allUsers; // [...this.state.allUsers, {key: "all", label: "Select All"}];
            }
        }
        else if (values.length === this.props.users_list.length) {
            selectedUsers = this.state.allUsers
            checkAllUsers = true;
        }
        else {
            selectedUsers = values.filter(e => e.key !== "all");
        }

        let data = {
            dealers: this.state.selectedDealers,
            users: selectedUsers
        }
        // console.log("users data is: ", data)
        this.props.getBulkDevicesList(data);
        this.setState({ selectedUsers, checkAllSelectedUsers: checkAllUsers })
    }

    handleChangeDealer = (values) => {
        // console.log("handleChangeDealer values ", values, this.state.selectedDealers.length, this.state.dealerList.length);
        let checkAllDealers = this.state.checkAllSelectedDealers
        let selectAll = values.filter(e => e.key === "all");
        let selectedDealers = [];

        if (selectAll.length > 0) {
            checkAllDealers = !this.state.checkAllSelectedDealers;
            if (this.state.checkAllSelectedDealers) {
                selectedDealers = [];
            } else {
                selectedDealers = this.state.allDealers // [...this.state.allDealers, {key: "all", label: "Select All"}];
            }
        }
        else if (values.length === this.props.dealerList.length) {
            selectedDealers = this.state.allDealers
            checkAllDealers = true;
        }
        else {
            selectedDealers = values.filter(e => e.key !== "all");
        }


        let data = {
            dealers: selectedDealers, //.filter(e => e.key !== "all"),
            users: this.state.selectedUsers
        }

        // console.log('handle change data is: ', data)
        this.props.getBulkDevicesList(data);
        this.setState({ selectedDealers, checkAllSelectedDealers: checkAllDealers });

    }

    handleChangeAction = (e) => {

        if (e === "PUSH APPS" || e === "PULL APPS" || e === "PUSH POLICY") {
            if (e === "PUSH APPS") {
                this.setState({ pushAppsModal: true, handleModalBtn: true });
            }
            else if (e === "PULL APPS") {
                this.setState({ pullAppsModal: true, handleModalBtn: true });
            } else if (e === "PUSH POLICY") {
                this.setState({ pushPolicyModal: true, handleModalBtn: true })
            }
        } else {
            this.setState({ handleModalBtn: false });
        }

        this.setState({ selectedAction: e });

    }

    handleViewChangePushPullApps = () => {
        let actionName = this.state.selectedAction;
        console.log("actionName handleViewChangePushPullApps ", actionName)

        if (actionName === "PUSH APPS") {
            this.setState({ pushAppsModal: true });
        }
        else if (actionName === "PULL APPS") {
            this.setState({ pullAppsModal: true });
        }
        else if (actionName === "PUSH POLICY") {
            this.setState({ pushPolicyModal: true });
        }
    }

    hanldeTags = (e) => {
        console.log("hanldeTags ", e);
    }

    setPolicy = (policy, remove = false) => {
        console.log("called apply policy function ", policy)

        let updatePolicies = this.state.selectedPolicy;

        if (remove) {
            updatePolicies = '';
        } else {
            updatePolicies = policy;
        }

        this.setState({
            selectedPolicy: updatePolicies
        })
    }




    render() {
        const {
            response_modal_action,
            failed_device_ids,
            expire_device_ids,
            queue_device_ids,
            pushed_device_ids,
        } = this.props;

        let failedTitle = '';
        let offlineTitle = '';
        let onlineTitle = '';
        let content = '';

        // if (((failed_device_ids && failed_device_ids.length) || (expire_device_ids && expire_device_ids.length) || (queue_device_ids && queue_device_ids.length) || (pushed_device_ids && pushed_device_ids.length)) && response_modal_action !== '') {

        // this.state.bulkResponseModal = true;

        if (response_modal_action === "pull") {
            failedTitle = "Failed to Pull apps from these Devices";
            offlineTitle = "(Apps will be Pulled soon from these devices. Action will be performed when devices back online)"
            onlineTitle = "Apps will be Pulled soon from these Devices";
        }
        else if (response_modal_action === "push") {
            failedTitle = "Failed to Push apps on these Devices"
            offlineTitle = "(Apps will be Pushed soon to these devices. Action will be performed when devices back online)"
            onlineTitle = "Apps will be Pushed soon on these Devices";
        }
        else if (response_modal_action === "active") {
            failedTitle = "Failed to Push apps on these Devices";
            offlineTitle = "(These Devices will be Activated Soon when back online)"
            onlineTitle = "These Devices are Activate Successfully";
        }
        else if (response_modal_action === "suspend") {
            failedTitle = "Failed to Push apps on these Devices";
            offlineTitle = "(These Devices will be Suspended Soon when back online)"
            onlineTitle = "These Devices are Suspended Successfully";
        }
        else if (response_modal_action === "unlink") {
            failedTitle = "Failed to Unlink these Devices";
            offlineTitle = "(These Devices will be Unlinked Soon when back online)"
            onlineTitle = "These Devices are Unlinked Successfully";
        }
        else if (response_modal_action === "wipe") {
            failedTitle = "Failed to Wipe these Devices";
            offlineTitle = "(These Devices will be Wiped Soon when back online)"
            onlineTitle = "These Devices are Wiped Successfully";
        }
        else if (response_modal_action === "policy") {
            failedTitle = "Failed to apply policy on these Devices";
            offlineTitle = "(Policy will be applied Soon on these Devices when back online)"
            onlineTitle = "Policy Successfully applied on these Devices";
        }

        // } 
        // else {
        //     this.state.bulkResponseModal = false;
        // }

        // console.log("this.state.bulkResponseModal ", this.state.bulkResponseModal)
        console.log("this.state.allDealers ", this.state.allDealers)
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
                        <Button type="primary" onClick={this.historyModal}>
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
                                placeholder={convertToLang(this.props.translation[""], "Select any action")}
                                onChange={this.handleChangeAction}
                            >
                                <Select.Option value="NOT SELECTED">{convertToLang(this.props.translation[""], "Select any action")}</Select.Option>
                                {this.actionList.map((item, index) => {
                                    return (<Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>)
                                })}
                            </Select>
                        </Col>
                        <Col className="col-md-4 col-sm-4 col-xs-4">
                            {this.state.handleModalBtn ?
                                <Button onClick={this.handleViewChangePushPullApps}>View/Change</Button>
                                : null}
                        </Col>
                    </Row>
                    <p>Selected: <span className="font_26">{this.state.selectedAction.toUpperCase()}</span></p>


                    <Row gutter={24} className="">
                        <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                            <span className=""> {convertToLang(this.props.translation[""], "Select Dealers/S-Dealers:")} </span>
                        </Col>

                        <Col className="col-md-4 col-sm-4 col-xs-4">
                            <Select
                                value={this.state.selectedDealers}
                                mode="multiple"
                                labelInValue
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                maxTagCount={this.state.checkAllSelectedDealers ? 0 : 2}
                                maxTagTextLength={10}
                                maxTagPlaceholder={this.state.checkAllSelectedDealers ? "All Selected" : `${this.state.selectedDealers.length - 2} more`}
                                style={{ width: '100%' }}
                                placeholder={convertToLang(this.props.translation[""], "Select Dealers/S-Dealers")}
                                onChange={this.handleChangeDealer}
                                onDeselect={(e) => this.handleCancel(e, "dealers")}
                            >
                                <Select.Option key="allDealers" value="all">Select All</Select.Option>
                                {this.state.allDealers.map(item => <Select.Option key={item.key} value={item.key}>{item.label}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <br />

                    <p>Dealers/S-Dealers Selected: <span className="font_26">{((this.state.selectedDealers.length) ? this.state.selectedDealers.map(item => <Tag>{item.label}</Tag>) : "NOT SELECTED")}</span></p>
                    <Row gutter={24} className="">
                        <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                            <span className=""> {convertToLang(this.props.translation[""], "Select Users:")} </span>
                        </Col>

                        <Col className="col-md-4 col-sm-4 col-xs-4">
                            <Select
                                value={this.state.selectedUsers}
                                showSearch
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}// showSearch={false}
                                mode="multiple"
                                labelInValue
                                maxTagCount={this.state.checkAllSelectedUsers ? 0 : 2}
                                maxTagTextLength={10}
                                maxTagPlaceholder={this.state.checkAllSelectedUsers ? "All Selected" : `${this.state.selectedUsers.length - 2} more`}
                                style={{ width: '100%' }}
                                onDeselect={(e) => this.handleCancel(e, "users")}
                                placeholder={convertToLang(this.props.translation[""], "Select Users")}
                                onChange={this.handleChangeUser}
                            >
                                <Select.Option key="allUsers" value="all">Select All</Select.Option>
                                {this.props.users_list.map(item => <Select.Option key={item.user_id} value={item.user_id} >{item.user_name}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <br />
                    <p>Users Selected: <span className="font_26">{(this.state.selectedUsers.length) ? this.state.selectedUsers.map(item => <Tag>{item.label}</Tag>) : "NOT SELECTED"}</span></p>

                    <FilterDevices
                        devices={this.state.filteredDevices}
                        selectedDealers={this.state.selectedDealers}
                        selectedUsers={this.state.selectedUsers}
                        handleActionValue={this.state.selectedAction}
                        bulkSuspendDevice={this.props.bulkSuspendDevice}
                        bulkActivateDevice={this.props.bulkActivateDevice}
                        selectedPushAppsList={this.props.selectedPushAppsList}
                        selectedPullAppsList={this.props.selectedPullAppsList}
                        applyPushApps={this.props.applyPushApps}
                        applyPullApps={this.props.applyPullApps}
                        renderList={this.renderList}
                        translation={this.props.translation}
                        onChangeTableSorting={this.handleTableChange}
                        selectedDevices={this.props.selectedDevices}
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        unlinkBulkDevices={this.props.unlinkBulkDevices}
                        wipeBulkDevices={this.props.wipeBulkDevices}
                        bulkApplyPolicy={this.props.applyBulkPolicy}
                        selectedPolicy={this.state.selectedPolicy}
                    />

                </Card>

                <HistoryModal
                    historyModalShow={this.state.historyModalShow}
                    handleHistoryCancel={this.handleHistoryCancel}
                    history={this.props.history}
                    renderList={this.renderList}
                    columns={this.state.columns.filter(e => e.dataIndex != "status")}
                    // onChangeTableSorting={this.handleTableChange}
                    translation={this.props.translation}
                />

                {/* Push Apps responses handle through modal */}
                <Modal
                    maskClosable={false}
                    title={<div><Icon type="question-circle" className='warning' /><span> WARNING! </span></div>}
                    visible={this.state.bulkResponseModal}
                    onCancel={this.handleCancelResponseModal}
                    footer={false}
                >
                    {failed_device_ids && failed_device_ids.length ?
                        <Fragment>
                            <h2>{failedTitle}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.failed_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {expire_device_ids && expire_device_ids.length ?
                        <Fragment>
                            <h2>{`Already Expired Devices`}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.expire_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {queue_device_ids && queue_device_ids.length ?
                        <Fragment>
                            <h2>Offline Devices</h2>
                            <p><small>{offlineTitle}</small></p>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.queue_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {pushed_device_ids && pushed_device_ids.length ?
                        <Fragment>
                            <h2>{onlineTitle}</h2>
                            <Table
                                size="middle"
                                pagination={false}
                                bordered
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.pushed_device_ids)}
                            />
                        </Fragment>
                        : null}
                </Modal>


                <PushPullApps
                    showPushAppsModal={this.showPushAppsModal}
                    pushAppsModal={this.state.pushAppsModal}
                    showPullAppsModal={this.showPullAppsModal}
                    pullAppsModal={this.state.pullAppsModal}
                    apk_list={this.props.apk_list}
                    app_list={this.props.app_list}
                    // onPushAppsSelection={this.onPushAppsSelection}
                    setBulkPushApps={this.props.setBulkPushApps}
                    setBulkPullApps={this.props.setBulkPullApps}
                    translation={this.props.translation}
                />


                {/* Push Policy modal */}
                <Modal
                    title={convertToLang(this.props.translation["Policy"], "Policy")}
                    maskClosable={false}
                    style={{ top: 20 }}
                    visible={this.state.pushPolicyModal}
                    onOk={() => this.setState({ pushPolicyModal: false })}
                    onCancel={() => this.setState({ pushPolicyModal: false })}
                    className="load_policy_popup"
                    footer={false}
                // okText={convertToLang(this.props.translation["Button_Ok"], "Add Policy")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    {
                        <TableHistory
                            histories={this.props.policies}
                            type={"policy"}
                            setPolicy={this.setPolicy}
                            selectedPolicy={this.state.selectedPolicy}
                            translation={this.props.translation}
                            auth={this.props.user}
                        />
                    }

                </Modal>

            </Fragment >
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getBulkDevicesList: getBulkDevicesList,
        getAllDealers: getAllDealers,
        getUserList: getUserList,
        bulkSuspendDevice: bulkSuspendDevice,
        bulkActivateDevice: bulkActivateDevice,
        getbulkHistory: getbulkHistory,
        // getUsersOfDealers: getUsersOfDealers,

        showPushAppsModal: showPushAppsModal,
        getDealerApps: getDealerApps,
        applyPushApps: applyBulkPushApps,
        applyPullApps: applyBulkPullApps,
        setBulkPushApps: setBulkPushApps,
        setBulkPullApps: setBulkPullApps,
        setSelectedBulkDevices: setSelectedBulkDevices,
        unlinkBulkDevices: unlinkBulkDevices,
        wipeBulkDevices: wipeBulkDevices,
        closeResponseModal: closeResponseModal,
        applyBulkPolicy: applyBulkPolicy,
        getPolicies: getPolicies,

        // ackFinishedPullApps: ackFinishedPullApps,
        // ackFinishedBulkPushApps: ackFinishedBulkPushApps,
        // ackFinishedPolicy: ackFinishedPolicy,
        // ackFinishedWipe: ackFinishedWipe,
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, settings, dealers, bulkDevices, users, device_details, socket }, otherProps) => {
    // console.log(bulkDevices.usersOfDealers, 'usersOfDealers ,devices.bulkDevices ', bulkDevices.bulkDevices);
    // console.log("bulkDevices.selectedDevices", bulkDevices.selectedDevices, "bulkDevices.bulkSelectedPushApps ", bulkDevices.bulkSelectedPushApps, "bulkDevices.bulkSelectedPullApps ", bulkDevices.bulkSelectedPullApps);
    // console.log("bulkDevices.bulkResponseModal ", bulkDevices.bulkResponseModal)
    return {
        socket: socket.socket,
        user: auth.authUser,
        routing: routing,
        translation: settings.translation,
        selectedPushAppsList: bulkDevices.bulkSelectedPushApps,
        selectedPullAppsList: bulkDevices.bulkSelectedPullApps,
        devices: bulkDevices.bulkDevices,
        history: bulkDevices.bulkDevicesHistory,
        users_list: bulkDevices.usersOfDealers, // users.users_list,
        dealerList: dealers.dealers,
        pushAppsModal: device_details.pushAppsModal,
        apk_list: device_details.apk_list,
        app_list: device_details.app_list,
        bulkResponseModal: bulkDevices.bulkResponseModal,
        failed_device_ids: bulkDevices.failed_device_ids,
        queue_device_ids: bulkDevices.queue_device_ids,
        pushed_device_ids: bulkDevices.pushed_device_ids,
        response_modal_action: bulkDevices.response_modal_action,
        expire_device_ids: bulkDevices.expire_device_ids,
        selectedDevices: bulkDevices.selectedDevices,
        policies: device_details.policies,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkActivities);