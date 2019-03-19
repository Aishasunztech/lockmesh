import React, { Component, Fragment } from 'react'
import { Table, Button, Card } from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus } from '../../utils/commonUtils'
import EditDevice from './editDevice';
import AddDevice from './AddDevice';

export default class DevicesList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            showMsg: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: 10
        };
        this.renderList = this.renderList.bind(this);
    }

    // renderList
    renderList(list) {


        return list.map((device) => {
            const device_status = (device.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            // const device_status =  "SUSPEND";
            const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
            var status = getStatus(device.status, device.account_status, device.unlink_status, device.device_status);
            // console.log("not avail", status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            // var icon = "edit";

            if ((status === 'new-device') || (device.unlink_status === 1)) {
                // console.log('device name', device.name, 'status', device.unlink_status)
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "Accept";
                // icon = 'add'
            }
           
            return {
                key: device.device_id ? `${device.device_id}` : "N/A",
                action: (device.activation_status === 0) ? "" :
                (<Fragment>
                    {(status==="new-device")?
                        <Fragment>
                            <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={()=>{ this.handleRejectDevice(device.device_id)}}>Reject</Button>
                            <Button 
                            type="primary" 
                            size="small" 
                            style={{ margin: '0 8px 0 8px' }} 
                            onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice)}}>
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
                            
                            {(device.device_status === 1 )?<Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button> : null}
                            {(status === 'active')?<Button type="default" size="small" style={style}><Link to={`connect-device/${device.device_id}`.trim()}> CONNECT</Link></Button>:null}
                        </Fragment>
                    
                    }
                    
                </Fragment>)
                ,
                device_id: device.device_id ? `${device.device_id}` : "N/A",
                name: device.name ? `${device.name}` : "N/A",
                account_email: device.email ? `${device.email}` : "N/A",
                pgp_email: device.pgp_email ? `${device.pgp_email}` : "N/A",
                activation_code: device.activation_code ? `${device.activation_code}` : "N/A",
                chat_id: device.chat_id ? `${device.chat_id}` : "N/A",
                client_id: device.client_id ? `${device.client_id}` : "N/A",
                dealer_id: device.dealer_id ? `${device.dealer_id}` : "N/A",
                dealer_pin: device.link_code ? `${device.link_code}` : "N/A",
                mac_address: device.mac_address ? `${device.mac_address}` : "N/A",
                sim_id: device.sim_id ? `${device.sim_id}` : "N/A",
                imei_1: device.imei ? `${device.imei}` : "N/A",
                sim_1: device.simno ? `${device.simno}` : "N/A",
                imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                sim_2: device.simno2 ? `${device.simno2}` : "N/A",
                serial_number: device.serial_number ? `${device.serial_number}` : "N/A",
                status: status,
                model: device.model ? `${device.model}` : "N/A",
                start_date: device.start_date ? `${device.start_date}` : "N/A",
                expiry_date: device.expiry_date ? `${device.expiry_date}` : "N/A",
                // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                dealer_name: device.dealer_name ? `${device.dealer_name}` : "N/A",
                online: device.online ? `${device.online}` : "N/A",
                s_dealer: device.s_dealer ? `${device.s_dealer}` : "N/A",
                s_dealer_name: device.s_dealer_name ? `${device.s_dealer_name}` : "N/A",
            }
        });

    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns
            })
        }
    }
    // componentWillReceiveProps() {
    //     this.setState({
    //         devices: this.props.devices,
    //         columns: this.props.columns
    //     })

    // }


    handlePagination = (value) => {
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    render() {

        const { activateDevice, suspendDevice } = this.props;

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
                        pagination={{ pageSize: this.state.pagination, size: "midddle" }}
                        rowKey="device_list"
                        scroll={{
                            x: 500,
                            // y: 600 
                        }}
                        expandedRowRender={(record) => {
                            let showRecord = [];
                            let showRecord2 = []
                            this.props.columns.map((column) => {
                                if (column.className === "row") {
                                } else if (column.className === "hide") {
                                    let title = column.children[0].title;
                                    if(title==="SIM ID" || title === "IMEI 1" || title === "SIM 1" || title === "IMEI 2" || title === "SIM 2"){
                                        showRecord2.push({
                                            name: title,
                                            values: record[column.dataIndex]
                                        });
                                    } else {
                                        if(title==="STATUS" || title === "DEALER NAME" || title ==="S-DEALER Name"){
                                            showRecord.push({
                                                name: title,
                                                values: record[column.dataIndex][0].toUpperCase() + record[column.dataIndex].substring(1,record[column.dataIndex].length).toLowerCase()
                                            });
                                        } else {

                                            showRecord.push({
                                                name: title,
                                                values: record[column.dataIndex]
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
    addDevice = (device) =>{
        // console.log(device);
        // this.props.addDevice(device);
    }

}
