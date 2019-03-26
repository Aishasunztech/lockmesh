import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag } from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus, getColor, checkValue } from '../../utils/commonUtils'
import EditDevice from './editDevice';
import AddDevice from './AddDevice';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

class DevicesList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            showMsg: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: this.props.pagination
        };
        this.renderList = this.renderList.bind(this);
    }

    // renderList
    renderList(list) {

        return list.map((device, index) => {
            const device_status = (device.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            // const device_status =  "SUSPEND";
            const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
            // console.log("status", device.status);
            // console.log("account status", device.account_status);
            // console.log("unlink status", device.unlink_status);
            // console.log("device status", device_status);
            // console.log("activation status", device.activation_status);

            var status = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
            // console.log("not avail", status);
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

            return {
                rowKey: index,
                key: device.device_id ? `${device.device_id}` : "N/A",
                action: (device.activation_status === 0) ? "" :
                    (<Fragment>
                        {(status === "pending activation" || status === "Pending activation" || status === "Pending Activation") ?
                            <Fragment>
                                <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.handleRejectDevice(device.device_id) }}>Decline</Button>
                                <Button
                                    type="primary"
                                    size="small"
                                    style={{ margin: '0 8px 0 8px' }}
                                    onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice) }}>
                                    Accept
                        </Button>
                            </Fragment>
                            :
                            <Fragment>
                                <Button
                                    type={button_type}
                                    size="small"
                                    style={style}
                                    onClick={() => (device_status === "ACTIVATE") ? this.handleActivateDevice(device) : this.handleSuspendDevice(device)}
                                >
                                    {(device.account_status === '') ? <Fragment> {device_status}</Fragment> : <Fragment> {device_status}</Fragment>}
                                </Button>

                                {(device.device_status === 1) ? <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button> : null}
                                {(status === 'activated' || status === 'Activated') ? <Button type="default" size="small" style={style}><Link to={`connect-device/${btoa(device.device_id)}`.trim()}> CONNECT</Link></Button> : null}
                            </Fragment>

                        }

                    </Fragment>)
                ,
                device_id: (device.device_id !== undefined && device.device_id !== '' && device.device_id !== null && device.device_id !== 'null' && (status != 'pre-activated' && status != "Pre-activated")) ? `${device.device_id}` : "N/A",
                name: device.name ? `${device.name}` : "N/A",
                account_email: checkValue(device.email),
                pgp_email: checkValue(device.pgp_email),
                activation_code: device.activation_code ? `${device.activation_code}` : "N/A",
                chat_id: checkValue(device.chat_id),
                client_id: device.client_id ? `${device.client_id}` : "N/A",
                dealer_id: device.dealer_id ? `${device.dealer_id}` : "N/A",
                dealer_pin: device.link_code ? `${device.link_code}` : "N/A",
                mac_address: device.mac_address ? `${device.mac_address}` : "N/A",
                sim_id: device.sim_id ? `${device.sim_id}` : "N/A",
                imei_1: device.imei ? `${device.imei}` : "N/A",
                sim_1: checkValue(device.simno),
                imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                sim_2: checkValue(device.simno2),
                serial_number: device.serial_number ? `${device.serial_number}` : "N/A",
                status: (<span style={color} > {status}</span >),
                model: checkValue(device.model),

                // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                dealer_name: device.dealer_name ? `${device.dealer_name}` : "N/A",
                online: device.online ? `${device.online}` : "N/A",
                s_dealer: device.s_dealer ? `${device.s_dealer}` : "N/A",
                s_dealer_name: device.s_dealer_name ? `${device.s_dealer_name}` : "N/A",
                start_date: device.start_date ? `${device.start_date}` : "N/A",
                expiry_date: device.expiry_date ? `${device.expiry_date}` : "N/A",
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
        //  console.log('columns r', this.state.columns)

        return (
            <div className="dev_table">
                <ActivateDevcie ref="activate"
                    activateDevice={activateDevice} />
                <SuspendDevice ref="suspend"
                    suspendDevice={suspendDevice} />

                <Card>
                    <Table className="devices"
                        size="middle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.devices)}
                        pagination={{ pageSize: Number(this.state.pagination), size: "midddle" }}
                        rowKey="device_list"
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

                <EditDevice ref='edit_device' />
                <AddDevice ref="add_device" />
            </div>

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleRejectDevice = (device_id) => {

        this.props.rejectDevice(device_id)
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
                    />
                </TabPane>

                <TabPane tab={<span className="yellow">Pending Activation</span>} key="2" forceRender={true}>
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
                    />
                </TabPane>
                <TabPane tab={<span className="green">Activated</span>} key="4" forceRender={true}>
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
                        //   ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        handlePagination={this.props.handlePagination}
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
                    />
                </TabPane>
                <TabPane tab={<span className="grey">Suspended</span>} key="7" forceRender={true}>
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
                    />
                </TabPane>
            </Tabs>

        )
    }
}



