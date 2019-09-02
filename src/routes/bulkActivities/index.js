import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Col, Row, Card, Button, Input, Select, Table } from 'antd';
import { getAllDealers } from "../../appRedux/actions/Dealers";
import HistoryModal from "./components/bulkHistory";
import {
    getBulkDevicesList,
    bulkSuspendDevice,
    bulkActivateDevice,
    getbulkHistory
} from "../../appRedux/actions/BulkDevices";
import {

} from '../../appRedux/actions'

import CustomScrollbars from "../../util/CustomScrollbars";

// import {
//     convertToLang,
//     componentSearch
// } from '../utils/commonUtils'

import { getUserList } from "../../appRedux/actions/Users";
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays, componentSearch, titleCase, convertToLang, checkRemainTermDays } from '../utils/commonUtils'
// import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel, Button_Edit } from '../../constants/ButtonConstants';
import { devicesColumns } from '../utils/columnsUtils';

import FilterDeives from './components/filterDevices';

import {
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_SUSPENDED,
    DEVICE_ACTIVATED
} from '../../constants/Constants'

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
            { key: 'ACTIVATE DEVICES', value: "Activate Devices" },
            { key: 'SUSPEND DEVICES', value: "Suspend Devices" },
            { key: 'UNLINK DEVICES', value: "Unlink Devices" },
            { key: 'WIPE DEVICES', value: "Wipe Devices" }
        ];

        let columns = devicesColumns(props.translation, this.handleColumnSearch);
        this.state = {
            columns: columns,
            filteredDevices: [],
            selectedAction: "Null",
            selectedDealers: [],
            selectedUsers: [],
            dealerList: [],
            historyModalShow: false,
        }
    }

    componentDidMount() {
        this.props.getAllDealers();
        this.props.getUserList();

        this.setState({
            filteredDevices: this.props.devices,
            dealerList: this.props.dealerList
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.devices != nextProps.devices || this.props.dealerList != nextProps.dealerList) {
            this.setState({
                filteredDevices: nextProps.devices,
                dealerList: this.props.dealerList
            })
        }
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



    handleCancel = () => {
        this.handleMultipleSelect();
    }

    historyModal = () => {
        console.log('hi')
        this.setState({ historyModalShow: true });

        this.props.getbulkHistory();
    }

    handleHistoryCancel = () => {
        console.log('hi')
        this.setState({ historyModalShow: false });
    }

    renderList(list) {
        console.log('renderList ', list)
        return list.map((device, index) => {

            var status = device.finalStatus;
            console.log("status ", status)

            let color = getColor(status);
            var style = { margin: '0', width: 'auto', textTransform: 'uppercase' }
            var text = convertToLang(this.props.translation[Button_Edit], "EDIT");

            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                style = { margin: '0 8px 0 0', width: 'auto', display: 'none', textTransform: 'uppercase' }
                text = "ACTIVATE";
            }

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
                dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
                online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
                s_dealer: checkValue(device.s_dealer),
                s_dealer_name: checkValue(device.s_dealer_name),
                remainTermDays: device.remainTermDays,
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }

    render() {

        // let data = "NULL ";
        // if (this.state.selectedDealers.length) {
        //     data = this.state.selectedDealers.map((item) => { return `${item.label}, ` });
        // }
        // console.log('data is: ', ...data);
        // console.log('update data is: ', ...data.slice(0, ...data.length - 1));


        // let actionList = [];
        // console.log('this.state.selectedDealers ', this.state.selectedDealers)
        // if (this.props.location.state) {
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
                                onChange={(e) => this.setState({ selectedAction: e })}
                            >
                                <Select.Option value="Null">{convertToLang(this.props.translation[""], "Select any action")}</Select.Option>
                                {this.actionList.map((item, index) => {
                                    return (<Select.Option key={item.id} value={item.key}>{item.value}</Select.Option>)
                                })}
                            </Select>
                        </Col>
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
                                onDeselect={this.handleCancel}
                                onBlur={() => { this.handleMultipleSelect() }}
                            >
                                {this.props.dealerList.map((item, index) => {
                                    return (<Select.Option key={item.id} value={item.dealer_id}>{item.dealer_name}</Select.Option>)
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <br />

                    <p>Dealers Selected: <span className="font_26">{((this.state.selectedDealers.length) ? this.state.selectedDealers.map((item) => `${item.label}, `) : "NULL")}</span></p>
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
                                onDeselect={this.handleCancel}
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
                        bulkSuspendDevice={this.props.bulkSuspendDevice}
                        bulkActivateDevice={this.props.bulkActivateDevice}
                        renderList={this.renderList}
                        translation={this.props.translation}
                    />

                </Card>

                <HistoryModal
                    historyModalShow={this.state.historyModalShow}
                    handleHistoryCancel={this.handleHistoryCancel}
                    history={this.props.history}
                    renderList={this.renderList}
                    columns={this.state.columns}
                    translation={this.props.translation}
                />

                {/* Duplicate modal */}
                {/* <Modal
                    maskClosable={false}
                    title={<div><Icon type="question-circle" className='warning' /><span> WARNNING! Duplicate Data</span></div>}
                    visible={this.state.duplicate_modal_show}
                    onOk={this.InsertNewData}
                    onCancel={this.handleCancelDuplicate}
                    okText='Submit'
                    okButtonProps={{
                        disabled: this.state.newData.length ? false : true
                    }}
                >

                    <Table
                        bordered
                        size="middle"
                        pagination={false}
                        className="dup_table"
                        columns={JSON.parse(JSON.stringify(duplicateModalColumns))}
                        dataSource={
                            this.state.duplicate_ids.map(row => {
                                // console.log('single row for id:: ', row)
                                if (this.state.duplicate_data_type == 'chat_id') {
                                    return {
                                        key: row.chat_id,
                                        label: row.name,
                                        chat_id: row.chat_id
                                    }
                                } else if (this.state.duplicate_data_type == 'pgp_email') {
                                    return {
                                        key: row.pgp_email,
                                        label: row.name,
                                        pgp_email: row.pgp_email
                                    }
                                }
                                else if (this.state.duplicate_data_type == 'sim_id') {
                                    return {
                                        key: row.id,
                                        label: row.name,
                                        sim_id: row[this.state.duplicate_data_type],
                                        start_date: row.start_date,
                                        expiry_date: row.expiry_date
                                    }
                                }

                            })
                        }
                    />
                    <span className="warning_hr">
                        <hr />
                    </span>
                    <h2>New Data</h2>

                    <Table
                        size="middle"
                        pagination={false}
                        bordered
                        className="dup_table"
                        columns={duplicateModalColumns.splice(1, duplicateModalColumns.length)}
                        dataSource={
                            this.state.newData.map(row => {

                                if (this.state.duplicate_data_type == 'chat_id') {
                                    return {
                                        key: row.chat_id,
                                        chat_id: row.chat_id
                                    }
                                } else if (this.state.duplicate_data_type == 'pgp_email') {
                                    return {
                                        key: row.pgp_email,
                                        pgp_email: row.pgp_email
                                    }
                                }
                                else if (this.state.duplicate_data_type == 'sim_id') {
                                    return {
                                        key: row.id,
                                        sim_id: row[this.state.duplicate_data_type],
                                        start_date: row.start_date,
                                        expiry_date: row.expiry_date
                                    }
                                }
                            })
                        }
                    />
                </Modal> */}


            </Fragment >
        )
        // } else {
        //     return (
        //         <Redirect to={{
        //             pathname: '/app',
        //         }} />
        //     )
        // }
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getBulkDevicesList: getBulkDevicesList,
        getAllDealers: getAllDealers,
        getUserList: getUserList,
        bulkSuspendDevice: bulkSuspendDevice,
        bulkActivateDevice: bulkActivateDevice,
        getbulkHistory: getbulkHistory
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, settings, dealers, bulkDevices, users }) => {
    console.log(bulkDevices.bulkDevicesHistory, 'devices.bulkDevices ', bulkDevices.bulkDevices)
    return {
        devices: bulkDevices.bulkDevices,
        history: bulkDevices.bulkDevicesHistory,
        users_list: users.users_list,
        dealerList: dealers.dealers,
        user: auth.authUser,
        routing: routing,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkActivities);