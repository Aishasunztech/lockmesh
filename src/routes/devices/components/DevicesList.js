import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty, Icon } from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays } from '../../utils/commonUtils'
import EditDevice from './editDevice';
import AddDevice from './AddDevice';
import { Tabs, Modal } from 'antd';
import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    DEVICE_TRIAL,
    ADMIN
} from '../../../constants/Constants'
import { Redirect } from 'react-router-dom';
import { isNull } from 'util';
import { unlink } from 'fs';

const TabPane = Tabs.TabPane;
class DevicesList extends Component {

    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;

        this.state = {
            searchText: '',
            showMsg: false,
            editing: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: this.props.pagination,
            selectedRows: [],
            selectedRowKeys: [],
            self: this,
            redirect: false,
            user_id: ''
        };
        this.renderList = this.renderList.bind(this);
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    deleteUnlinkedDevice = (action, device) => {
        let arr = [];
        arr.push(device);
        let title = ' Are you sure, you want to delete the device';
        this.confirmDelete(action, arr, title);
    }
    handleUserId = (user_id) => {
        if (user_id != 'null' && user_id != null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    }
    // renderList
    renderList(list) {
        // console.log('list of dec', list)
        return list.map((device, index) => {
            // console.log('tab Select is: ', this.props.tabselect)

            // var remainDays = checkRemainDays(device.created_at, device.validity)
            // console.log('Remain Days are: ', remainDays);   

            //  console.log(this.props.user.type, 'lkslkdflk');
            // const device_status = (device.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            // const device_status =  "SUSPEND";

            var status = device.finalStatus;
            const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";
            const flagged = device.flagged;
            // console.log("not avail", status);
            var order = getSortOrder(status)
            let color = getColor(status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            // var icon = "edit";

            // if ((status === 'pending activation') || (device.unlink_status === 1)) {
            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                // console.log('device name', device.name, 'status', device.unlink_status)
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "ACTIVATE";
                // icon = 'add'
            }

            let SuspendBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleSuspendDevice(device)} > SUSPEND</Button>;
            let ActiveBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleActivateDevice(device)}  >SUSPEND</Button>;
            let DeleteBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteUnlinkedDevice('unlink', device)} >DELETE</Button>
            let ConnectBtn = <Button type="default" size="small" style={style}><Link to={`connect-device/${btoa(device.device_id)}`.trim()}> CONNECT</Link></Button>
            let EditBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
            let EditBtnPreActive = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
            let AcceptBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice) }}> ACCEPT </Button>;
            let DeclineBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.handleRejectDevice(device) }}>DECLINE</Button>
            let DeleteBtnPreActive = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteUnlinkedDevice('pre-active', device)}>DELETE</Button>

            // console.log(device.usr_device_id,'key', device.device_id)
            // console.log('end', device)
            // console.log(device.id, 'ids')
            return {
                // sortOrder: <span style={{ display: 'none' }}>{order}</span>,
                // sortOrder: (<span id="order">{order}</span>),
                // sortOrder: {order},
                rowKey: index,
                // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id}` : device.id,
                counter: ++index,
                action: ((status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ?
                    (<Fragment><Fragment>{SuspendBtn}</Fragment><Fragment>{EditBtn}</Fragment><Fragment>{ConnectBtn}</Fragment></Fragment>)
                    : (status === DEVICE_PRE_ACTIVATION) ?
                        (<Fragment><Fragment>{DeleteBtnPreActive}</Fragment><Fragment>{EditBtnPreActive}</Fragment></Fragment>)
                        : (status === DEVICE_SUSPENDED) ?
                            (<Fragment><Fragment>{EditBtn}</Fragment><Fragment>{ConnectBtn}</Fragment></Fragment>)
                            : (status === DEVICE_EXPIRED) ?
                                (<Fragment><Fragment>{EditBtn}</Fragment><Fragment>{ConnectBtn}</Fragment></Fragment>)
                                : (status === DEVICE_UNLINKED && this.props.user.type !== ADMIN) ?
                                    (<Fragment>{DeleteBtn}</Fragment>)
                                    : (status === DEVICE_PENDING_ACTIVATION) ?
                                        (<Fragment><Fragment>{DeclineBtn}</Fragment><Fragment>{AcceptBtn}</Fragment></Fragment>)
                                        : (device.status === DEVICE_PRE_ACTIVATION) ?
                                            false
                                            : (status === DEVICE_EXPIRED) ?
                                                (<Fragment><Fragment>{(status === DEVICE_ACTIVATED) ? SuspendBtn : ActiveBtn}</Fragment><Fragment>{ConnectBtn}</Fragment><Fragment>{EditBtn}</Fragment></Fragment>)
                                                : false


                ),
                status: (<span style={color} > {status}</span >),
                flagged: (device.flagged !== '') ? device.flagged : 'Not Flagged',
                device_id: ((status != DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
                // device_id: ((status != DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
                user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
                validity: checkValue(device.validity),
                name: checkValue(device.name),
                account_email: checkValue(device.account_email),
                pgp_email: checkValue(device.pgp_email),
                activation_code: checkValue(device.activation_code),
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
                dealer_name: checkValue(device.dealer_name),
                online: device.online ? (device.online == "On") ? (<span style={{ color: "green" }}>Online</span>) : (<span style={{ color: "red" }}>Offline</span>) : "N/A",
                s_dealer: checkValue(device.s_dealer),
                s_dealer_name: checkValue(device.s_dealer_name),
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,

            })
        }
        // console.log('did update', )
    }

    deleteAllUnlinkedDevice = (type) => {
        console.log(this.state.selectedRows, 'selected keys', this.state.selectedRowKeys)
        console.log(type);
        if (this.state.selectedRowKeys.length) {
            let title = ' Are you sure, you want to delete All these devices';
            let arr = [];
            // console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                for (let device of this.props.devices) {
                    if (type != 'unlink') {
                        if (id == device.id) {
                            arr.push(device)
                        }
                    }
                    else {
                        if (id == device.user_acc_id) {
                            arr.push(device)
                        }
                    }
                }
            }
            // console.log('object of ', arr);
            this.confirmDelete(type, arr, title);
        }
        //  console.log('DELETE ALL 1', this.state.selectedRows);

    }

    confirmDelete = (action, devices, title) => {

        // console.log(action);
        // console.log(devices);
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {

                this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                this.resetSeletedRows();
                if (this.refs.tablelist.props.rowSelection !== null) {
                    this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                }
            }),
            onCancel() { },
        });
    }


    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    resetSeletedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    // componentWillReceiveProps() {
    //     this.setState({
    //         devices: this.props.devices,
    //         columns: this.props.columns
    //     })

    // }

    render() {

        // console.log(this.state.selectedRows, 'selected keys', this.state.selectedRowKeys)

        const { activateDevice, suspendDevice } = this.props;
        const { redirect } = this.state
        if (redirect) {
            return <Redirect to={{
                pathname: '/users',
                state: { id: this.state.user_id }
            }} />
        }

        let rowSelection;
        if (this.props.tabselect == '5' && this.props.user.type !== ADMIN) {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                    // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
            };
        }
        else if (this.props.tabselect == '3') {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                    // console.log(`selectedRowKeys 3: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

                    //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                selectedRowKeys: this.state.selectedRowKeys,
                //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
            };

        } else {
            // console.log('asdkjadl')
            rowSelection = null
        }

        // console.log(rowSelection);
        return (
            <div className="dev_table">
                <ActivateDevcie ref="activate"
                    activateDevice={activateDevice} />
                <SuspendDevice ref="suspend"
                    suspendDevice={suspendDevice} />

                <Card>

                    <Table
                        ref='tablelist'
                        className="devices"
                        rowSelection={rowSelection}
                        rowClassName={() => 'editable-row'}
                        size="middle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.devices)}
                        pagination={{ 
                            pageSize: Number(this.state.pagination), 
                            size: "midddle", 
                            // showSizeChanger:true 
                        }}
                        
                        scroll={{
                            x: 500,
                            // y: 600 
                        }}

                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            let showRecord = [];
                            let showRecord2 = [];

                            this.props.columns.map((column, index) => {
                                if (column.className === "row") {
                                } else if (column.className === "hide") {
                                    let title = column.children[0].title;
                                    if (title === "SIM ID" || title === "IMEI 1" || title === "SIM 1" || title === "IMEI 2" || title === "SIM 2") {
                                        showRecord2.push({
                                            name: title,
                                            values: record[column.dataIndex],
                                            rowKey: title
                                        });
                                    } else {
                                        if (title === "STATUS" || title === "DEALER NAME" || title === "S-DEALER Name") {
                                            if (record[column.dataIndex][0]) {
                                                showRecord.push({
                                                    name: title,
                                                    values: record[column.dataIndex][0].toUpperCase() + record[column.dataIndex].substring(1, record[column.dataIndex].length).toLowerCase(),
                                                    rowKey: title
                                                });
                                            }

                                        } else {

                                            showRecord.push({
                                                name: title,
                                                values: record[column.dataIndex],
                                                rowKey: title
                                            });
                                        }
                                    }
                                }
                            });
                            // console.log("cols",this.props.columns);
                            // console.log("toShow", showRecord);
                            return (
                                <Fragment>
                                    <div className="col-md-4 expand_table">
                                        <Table
                                            pagination={false}
                                            columns={
                                                [
                                                    {
                                                        title: "Name",
                                                        dataIndex: 'name',
                                                        key: "name",
                                                        align: "center",
                                                        className: "bold"
                                                    }, {
                                                        title: "Value",
                                                        dataIndex: "values",
                                                        key: "value",
                                                        align: "center"
                                                    }
                                                ]
                                            }
                                            dataSource={showRecord}
                                        />
                                    </div>
                                    <div className="col-md-4 expand_table">
                                        <Table
                                            pagination={false}
                                            columns={
                                                [
                                                    {
                                                        title: "Name",
                                                        dataIndex: 'name',
                                                        key: "name",
                                                        align: "center",
                                                        className: "bold"
                                                    }, {
                                                        title: "Value",
                                                        dataIndex: "values",
                                                        key: "value",
                                                        align: "center"
                                                    }
                                                ]
                                            }
                                            dataSource={showRecord2}
                                        />
                                    </div>
                                </Fragment>)
                        }
                        }
                    />
                </Card>

                <EditDevice ref='edit_device'

                />
                <AddDevice ref="add_device"
                />
            </div>

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleRejectDevice = (device) => {

        this.props.rejectDevice(device)
    }
    addDevice = (device) => {
        // console.log(device);
        // this.props.addDevice(device);
    }

}

export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devices: this.props.devices,
            tabselect: this.props.tabselect,
            selectedOptions: this.props.selectedOptions
        }
    }

    callback = (key) => {
        this.props.handleChangetab(key);
    }

    deleteAllUnlinkedDevice = (type) => {
        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }
    deleteAllPreActivedDevice = (type) => {

        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }

    handlePagination = (value) => {
        this.refs.devciesList.handlePagination(value);
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,
                tabselect: this.props.tabselect,
                selectedOptions: this.props.selectedOptions
            })
            // this.refs.devciesList.handlePagination(this.state.tabselect);
        }
    }

    render() {
        //  console.log('columsns', this.state.tabselect)
        return (
            <Fragment>
                <Tabs type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                    <TabPane tab="All" key="1" >
                    </TabPane>
                    <TabPane tab={<span className="green">Active</span>} key="4" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="red">Expired</span>} key="6" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="green">Trial</span>} key="9" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="yellow">Suspended</span>} key="7" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="blue">Pre Activated</span>} key="3" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="gray">Pending Activation</span>} key="2" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="purple">Transfer</span>} key="8" forceRender={true}>
                        <h2 className="coming_s">Coming Soon</h2>
                    </TabPane>
                    <TabPane tab={<span className="orange">Unlinked</span>} key="5" forceRender={true}>
                    </TabPane>

                </Tabs>
                <DevicesList
                    devices={this.state.devices}
                    suspendDevice={this.props.suspendDevice}
                    activateDevice={this.props.activateDevice}
                    columns={this.props.columns}
                    rejectDevice={this.props.rejectDevice}
                    selectedOptions={this.state.selectedOptions}
                    ref="devciesList"
                    pagination={this.props.pagination}
                    addDevice={this.props.addDevice}
                    editDevice={this.props.editDevice}
                    tabselect={this.state.tabselect}
                    deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                    resetTabSelected={this.resetTabSelected}
                    user={this.props.user}
                    history={this.props.history}
                />
            </Fragment>
        )
    }
}



