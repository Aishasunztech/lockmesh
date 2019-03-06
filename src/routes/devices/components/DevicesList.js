import React, { Component } from 'react'
import { Table, Button, Card} from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus } from '../../utils/commonUtils'
import EditDevice from './editDevice';

export default class DevicesList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            showMsg: false,
            msg: "",
            columns: this.props.columns,
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
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            // var icon = "edit";
            
            if (status === 'new-device') {
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "ADD";
                // icon = 'add'
            }

            return {
                key: device.device_id ? `${device.device_id}` : "N/A",
                action:
                    (<div>
                        <Button type={button_type} size="small" style={style} onClick={() => (device_status === "ACTIVATE") ? this.handleActivateDevice(device) : this.handleSuspendDevice(device)}  >
                            {(device.account_status === '') ? <div> {device_status}</div> : <div> {device_status}</div>}</Button>
                        <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
                        <Button type="default" size="small" style={style}><Link to={`connect-device/${device.device_id}`.trim()}> CONNECT</Link></Button>
                    </div>)
                ,
                device_id: device.device_id ? `${device.device_id}` : "N/A",
                name: device.name ? `${device.name}` : "N/A",
                account_email: device.email ? `${device.email}` : "N/A",
                pgp_email: device.pgp_email ? `${device.pgp_email}` : "N/A",
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
                status: device.status ? `${getStatus(device.status, device.account_status, device.unlink_status)}` : "N/A",
                model: device.model ? `${device.model}` : "N/A",
                start_date: device.start_date ? `${device.start_date}` : "N/A",
                expiry_date: device.expiry_date ? `${device.expiry_date}` : "N/A",
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
            <div id="style-9">
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
                        scroll={{ x: 500 }}

                    />
                </Card>
                <EditDevice ref='edit_device' />
            </div>

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

}
