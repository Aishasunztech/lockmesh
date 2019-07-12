import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, } from 'antd';
import { Link } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import { ADMIN } from '../../constants/Constants';
import { convertToLang } from '../../routes/utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../constants/ButtonConstants';
const confirm = Modal.confirm;

export default class NewDevices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            NewDevices: [],
            NewRequests: []
        }
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    componentDidMount() {
        this.setState({
            NewDevices: this.props.devices,
            NewRequests: this.props.requests

        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.devices.length !== nextProps.devices.length || this.props.requests.length !== nextProps.requests.length) {
            this.setState({
                NewDevices: nextProps.devices,
                NewRequests: nextProps.requests
            });
        }
    }
    rejectDevice(device) {

        this.props.rejectDevice(device);
    }
    rejectRequest(request) {
        showConfirm(this, "Are you sure you want to decline this request ?", this.props.rejectRequest, request)

        // this.setState({ visible: false })
    }
    acceptRequest(request) {
        showConfirm(this, "Are you sure you want to accept this request ?", this.props.acceptRequest, request)
        // this.props.rejectRequest(request);
        // this.setState({ visible: false })
    }


    renderList1(list) {
        // console.log(list);
        return list.map((request) => {
            return {
                key: request.id ? `${request.id}` : "N/A",
                action: <div>  <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectRequest(request); }}>DECLINE</Button>
                    <Button
                        type="primary"
                        size="small"
                        style={{ margin: '0 8px 0 8px' }}
                        onClick={() => { this.acceptRequest(request) }}>
                        ACCEPT
                    </Button>
                </div>,
                dealer_name: request.dealer_name ? `${request.dealer_name}` : "N/A",
                label: request.label ? `${request.label}` : "N/A",
                credits: request.credits ? `${request.credits}` : "N/A",
            }
        });

    }
    renderList(list) {

        return list.map((device) => {
            const device_status = (device.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            // const device_status =  "SUSPEND";
            const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
            // var status = getStatus(device.status, device.account_status, device.unlink_status, device.device_status);
            var status = 'new-device';
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
                action: <div>  <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectDevice(device); }}>DECLINE</Button>
                    <Button
                        type="primary"
                        size="small"
                        style={{ margin: '0 8px 0 8px' }}
                        onClick={() => { this.refs.add_device_modal.showModal(device, this.props.addDevice); this.setState({ visible: false }) }}>
                        ACCEPT
                    </Button></div>,
                device_id: device.device_id ? `${device.device_id}` : "N/A",
                imei_1: device.imei ? `${device.imei}` : "N/A",
                sim_1: device.simno ? `${device.simno}` : "N/A",
                imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                sim_2: device.simno2 ? `${device.simno2}` : "N/A",
                serial_number: device.serial_number ? `${device.serial_number}` : "N/A",

            }
        });

    }

    render() {

        return (
            <div>
                <Modal
                    width={1000}
                    maskClosable={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    {(this.props.authUser.type === ADMIN) ? null :
                        <Fragment>
                            <h1>DEVICE REQUESTS</h1>
                            <Table
                                bordered
                                columns={columns}
                                style={{ marginTop: 20 }}
                                dataSource={this.renderList(this.state.NewDevices)}
                                pagination={false}

                            />
                        </Fragment>
                    }
                    <h1>CREDITS CASH REQUESTS</h1>
                    <Table
                        bordered
                        columns={columns1}
                        style={{ marginTop: 20 }}
                        dataSource={this.renderList1(this.state.NewRequests)}
                        pagination={false}

                    />
                </Modal>
                <AddDeviceModal ref='add_device_modal' translation={this.props.translation} />
            </div>
        )
    }
}

const columns = [
    { title: 'Action', dataIndex: 'action', key: 'action', align: "center" },
    { title: 'DEVICE ID', dataIndex: 'device_id', key: 'device_id', align: "center" },
    { title: 'SERIAL NUMBER', dataIndex: 'serial_number', key: 'serial_number', align: "center" },
    { title: 'SIM 1 ', dataIndex: 'sim_1', key: 'sim_1', align: "center" },
    { title: 'IMEI 1', dataIndex: 'imei_1', key: 'imei_1', align: "center" },
    { title: 'SIM 2', dataIndex: 'sim_2', key: 'sim_2', align: "center" },
    { title: 'IMEI 2 ', dataIndex: 'imei_2', key: 'imei_2', align: "center" },
];
const columns1 = [
    { title: 'Action', dataIndex: 'action', key: 'action', align: "center" },
    { title: 'DEALER NAME', dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
    { title: 'CREDITS', dataIndex: 'credits', key: 'credits', align: "center" },
];
function showConfirm(_this, msg, action, request) {
    confirm({
        title: 'WARNNING!',
        content: msg,
        okText: "Confirm",
        onOk() {
            action(request);
        },
        onCancel() { },
    });
}