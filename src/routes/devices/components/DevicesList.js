import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty } from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus, getColor, checkValue, getSortOrder } from '../../utils/commonUtils'
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
    ADMIN
} from '../../../constants/Constants'

const TabPane = Tabs.TabPane;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,

    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    save = (e) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <Form.Item style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                onBlur={this.save}
                                            />
                                        )}
                                    </Form.Item>
                                ) : (
                                        <div
                                            className="editable-cell-value-wrap"
                                            style={{ paddingRight: 24 }}
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

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
            self: this
        };
        this.renderList = this.renderList.bind(this);
    }
    deleteUnlinkedDevice = (device) => {
        let arr = [];
        arr.push(device);
        let title = ' Are you sure, you want to delete the device';
        this.confirmDelete(arr, title);
    }

    // renderList
    renderList(list) {

        return list.map((device, index) => {
            //  console.log(this.props.user.type, 'lkslkdflk');
            const device_status = (device.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            // const device_status =  "SUSPEND";
            const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
            const flagged = device.flagged;

            var status = device.finalStatus;
            // console.log("not avail", status);
            var order = getSortOrder(status)
            let color = getColor(status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            // var icon = "edit";

            if ((status === 'pending activation') || (device.unlink_status === 1)) {
                // console.log('device name', device.name, 'status', device.unlink_status)
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "Activate";
                // icon = 'add'
            }

            let SuspendBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleSuspendDevice(device)} > Suspend</Button>;
            let ActiveBtn = <Button type={button_type} size="small" style={style} onClick={() =>  this.handleActivateDevice(device)}  >Suspend</Button>;
            let DeleteBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteUnlinkedDevice(device)} >Delete</Button>
            let ConnectBtn = <Button type="default" size="small" style={style}><Link to={`connect-device/${btoa(device.device_id)}`.trim()}> CONNECT</Link></Button>
            let EditBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
            let AcceptBtn = <Button type="primary"  size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice) }}> Accept </Button>;
            let DeclineBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.handleRejectDevice(device) }}>Decline</Button>
            
            
            return {
                // sortOrder: <span style={{ display: 'none' }}>{order}</span>,
                // sortOrder: (<span id="order">{order}</span>),
                // sortOrder: {order},
                rowKey: index,
                key: device.device_id ? `${device.device_id}` : "N/A",
                action: ((status === DEVICE_ACTIVATED) ? 
                        (<Fragment><Fragment>{SuspendBtn}</Fragment><Fragment>{EditBtn}</Fragment><Fragment>{ConnectBtn}</Fragment></Fragment>)
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
                // action: (device.activation_status === 0 || device.activation_status === null ) ?
                //     ((status === DEVICE_UNLINKED && this.props.user.type !== 'admin') ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteUnlinkedDevice(device)} >Delete</Button> : false)
                //     :

                //     (<Fragment>
                //         {(status === DEVICE_PENDING_ACTIVATION) ?
                //             <Fragment>
                //                 <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.handleRejectDevice(device) }}>Decline</Button>
                //                 <Button
                //                     type="primary"
                //                     size="small"
                //                     style={{ margin: '0 8px 0 8px' }}
                //                     onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice) }}>
                //                     Accept
                //         </Button>
                //             </Fragment>
                //             :
                //             <Fragment>
                //                 {((device.flagged === '' || device.flagged === null || device.flagged === 'null') && (status !== DEVICE_SUSPENDED)) ?
                //                     <Button
                //                         type={button_type}
                //                         size="small"
                //                         style={style}
                //                         onClick={() => (device_status === "ACTIVATE") ? this.handleActivateDevice(device) : this.handleSuspendDevice(device)}
                //                     >
                //                         {(device.account_status === '') ? <Fragment> {device_status}</Fragment> : <Fragment> {device_status}</Fragment>}
                //                     </Button>
                //                     : ''
                //                 }

                //                 {(device.device_status === 1) ? <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button> : null}
                //                 {(status !== DEVICE_UNLINKED) ? <Button type="default" size="small" style={style}><Link to={`connect-device/${btoa(device.device_id)}`.trim()}> CONNECT</Link></Button>
                //                     : ''}
                //             </Fragment>

                //         }

                //     </Fragment>)

                status: (<span style={color} > {status}</span >),
                flagged: (device.flagged !== '') ? device.flagged : 'Not Flagged',
                device_id: (device.device_id !== undefined && device.device_id !== '' && device.device_id !== null && device.device_id !== 'null' && (status != DEVICE_PRE_ACTIVATION)) ? `${device.device_id}` : "N/A",

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

    deleteAllUnlinkedDevice = () => {
        if (this.state.selectedRows.length) {
            let title = ' Are you sure, you want to delete All these devices';
            let arr = [];
            //  console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                for (let device of this.props.devices) {
                    if (id == device.device_id) {
                        arr.push(device)
                    }
                }
            }
            // console.log('object of ', arr);
            this.confirmDelete(arr, title);
        }

        //  console.log('DELETE ALL 1', this.state.selectedRows);

    }

    confirmDelete = (devices, title) => {
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {
                this.props.deleteUnlinkDevice(devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();

                //  this.props.resetTabSelected()

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

    // componentWillReceiveProps() {
    //     this.setState({
    //         devices: this.props.devices,
    //         columns: this.props.columns
    //     })

    // }





    render() {


        const { activateDevice, suspendDevice } = this.props;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        let rowSelection;
        if (this.props.tabselect == '5' && this.props.user.type !== 'admin') {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                    //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
            };
        }
        else {
            rowSelection = null;
        }

        return (
            <div className="dev_table">
                <ActivateDevcie ref="activate"
                    activateDevice={activateDevice} />
                <SuspendDevice ref="suspend"
                    suspendDevice={suspendDevice} />

                <Card>

                    <Table
                        className="devices"
                        components={components}
                        rowSelection={rowSelection}
                        rowClassName={() => 'editable-row'}
                        size="middle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.devices)}
                        pagination={{ pageSize: Number(this.state.pagination), size: "midddle" }}

                        scroll={{
                            x: 500,
                            // y: 600 
                        }}
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
                {/* <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal> */}
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
        // alert('callback');
        // console.log(key);
        this.props.handleChangetab(key);
    }

    deleteAllUnlinkedDevice = () => {
        this.refs.devciesList1.deleteAllUnlinkedDevice()
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
            <Tabs type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                <TabPane tab="All" key="1" >
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
                    />
                </TabPane>
                <TabPane tab={<span className="green">Active</span>} key="4" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.props.selectedOptions}
                        //   ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>
                <TabPane tab={<span className="yellow">Suspended</span>} key="7" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.props.selectedOptions}
                        //  ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>
                <TabPane tab={<span className="red">Expired</span>} key="6" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.props.selectedOptions}
                        // ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>

                <TabPane tab={<span className="blue">Pre Activated</span>} key="3" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.state.selectedOptions}
                        //   ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>
                <TabPane tab={<span className="gray">Pending Activation</span>} key="2" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.props.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.state.selectedOptions}
                        //   ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>
                <TabPane tab={<span className="purple">Transfer</span>} key="8" forceRender={true}>
                    <h2 className="coming_s">Coming Soon</h2>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.props.selectedOptions}
                        //   ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        user={this.props.user}
                    />
                </TabPane>
                <TabPane tab={<span className="orange">Unlinked</span>} key="5" forceRender={true}>
                    <DevicesList
                        devices={this.state.devices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.state.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.props.selectedOptions}
                        ref="devciesList1"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
                        tabselect={this.state.tabselect}
                        deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                        user={this.props.user}
                    //  getDevicesList={this.props.getDevicesList}
                    //    refreshComponent={this.props.refreshComponent}
                    // resetTabSelected={this.resetTabSelected}
                    />
                </TabPane>
            </Tabs>

        )
    }
}



