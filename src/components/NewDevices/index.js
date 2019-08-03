import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, } from 'antd';
import { Link } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import { ADMIN, ACTION, CREDITS, CREDITS_CASH_REQUESTS, ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST, ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST, WARNING, DEVICE_UNLINKED } from '../../constants/Constants';
import { convertToLang } from '../../routes/utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm, Button_Decline, Button_ACCEPT, Button_Transfer } from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME } from '../../constants/DealerConstants';
const confirm = Modal.confirm;

export default class NewDevices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEVICE_ID], "DEVICE ID"), dataIndex: 'device_id', key: 'device_id', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"), dataIndex: 'serial_number', key: 'serial_number', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_1], "SIM 1"), dataIndex: 'sim_1', key: 'sim_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI 1"), dataIndex: 'imei_1', key: 'imei_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_2], "SIM 2"), dataIndex: 'sim_2', key: 'sim_2', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI 2"), dataIndex: 'imei_2', key: 'imei_2', align: "center" },
        ];
        const columns1 = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEALER_NAME], "DEALER NAME"), dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
            { title: convertToLang(props.translation[CREDITS], "CREDITS"), dataIndex: 'credits', key: 'credits', align: "center" },
        ];

        this.state = {
            columns: columns,
            columns1: columns1,
            visible: false,
            NewDevices: [],
            NewRequests: [],
            sectionVisible: true,
            flaggedDevicesModal: false
        }
    }



    showModal = (sectionVisible = true) => {
        this.setState({
            visible: true,
            sectionVisible
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

    flaggedDevices = () => {
        // console.log('flaggedDevices ');
        this.setState({
            flaggedDevicesModal: true
        })
    }

    transferDevice(device) {
        // console.log('transferDevice ')
        this.props.transferDeviceProfile(device);
        // this.setState({ visible: false })
    }
    rejectRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectRequest, request)

        // this.setState({ visible: false })
    }
    acceptRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptRequest, request)
        // this.props.rejectRequest(request);
        // this.setState({ visible: false })
    }


    renderList1(list) {
        // console.log(list);
        return list.map((request) => {
            return {
                key: request.id ? `${request.id}` : "N/A",
                action: <div>  <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectRequest(request); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>
                    <Button
                        type="primary"
                        size="small"
                        style={{ margin: '0 8px 0 8px' }}
                        onClick={() => { this.acceptRequest(request) }}>
                        {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}
                    </Button>
                </div>,
                dealer_name: request.dealer_name ? `${request.dealer_name}` : "N/A",
                label: request.label ? `${request.label}` : "N/A",
                credits: request.credits ? `${request.credits}` : "N/A",
            }
        });

    }
    renderList(list, flagged = false) {

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

            let transferButton;
            if (this.state.sectionVisible) {
                transferButton = transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px' }} onClick={this.flaggedDevices}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
            } else {
                transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.transferDevice(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
            }

            let declineButton = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectDevice(device); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>;
            let acceptButton = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.refs.add_device_modal.showModal(device, this.props.addDevice); this.setState({ visible: false }) }}> {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}</Button>;

            let actionButns;
            if (this.state.sectionVisible) {
                if (this.props.flaggedDevices !== undefined) {
                    if (flagged) {
                        actionButns = (<Fragment>{transferButton}</Fragment>);
                    } else {
                        actionButns = (<Fragment>
                            <Fragment>{declineButton}</Fragment>
                            <Fragment>{acceptButton}</Fragment>
                            <Fragment>{transferButton}</Fragment>
                        </Fragment>);
                    }
                } else {
                    actionButns = (<Fragment>
                        <Fragment>{declineButton}</Fragment>
                        <Fragment>{acceptButton}</Fragment>
                    </Fragment>);
                }

            } else {
                actionButns = (<Fragment>{transferButton}</Fragment>);
            }

            return {
                key: device.device_id ? `${device.device_id}` : "N/A",
                action: actionButns,
                device_id: device.device_id ? `${device.device_id}` : "N/A",
                imei_1: device.imei ? `${device.imei}` : "N/A",
                sim_1: device.simno ? `${device.simno}` : "N/A",
                imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                sim_2: device.simno2 ? `${device.simno2}` : "N/A",
                serial_number: device.serial_number ? `${device.serial_number}` : "N/A",

            }
        });

    }

    filterList = (devices) => {
        let dumyDevices = [];
        // console.log('check Devices at filterList ', devices)
        if (devices !== undefined) {
            devices.filter(function (device) {
                if (device.finalStatus !== DEVICE_UNLINKED) {
                    // let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
                    let deviceStatus = device.flagged;
                    // console.log('22222 flagged', device.flagged)
                    if ((deviceStatus === 'Defective' || deviceStatus === 'Lost' || deviceStatus === 'Stolen' || deviceStatus === 'Other') && (device.finalStatus === "Flagged")) {
                        dumyDevices.push(device);
                    }
                }
            });
        }
        return dumyDevices;
    }

    render() {
        let flaggedDevices = this.filterList(this.props.flaggedDevices)
        // console.log('check flaggedDevices ', flaggedDevices)
        return (
            <div>
                <Modal
                    width={1000}
                    maskClosable={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    {(this.props.authUser.type === ADMIN) ? null :
                        <Fragment>
                            <h1>{convertToLang(this.props.translation[DEVICE_REQUESTS], "DEVICE REQUESTS")}</h1>
                            <Table
                                bordered
                                columns={this.state.columns}
                                style={{ marginTop: 20 }}
                                dataSource={this.renderList(this.state.NewDevices)}
                                pagination={false}

                            />
                        </Fragment>
                    }
                    {(this.state.sectionVisible) ?
                        <Fragment>
                            <h1>{convertToLang(this.props.translation[CREDITS_CASH_REQUESTS], "CREDITS CASH REQUESTS")}</h1>
                            <Table
                                bordered
                                columns={this.state.columns1}
                                style={{ marginTop: 20 }}
                                dataSource={this.renderList1(this.state.NewRequests)}
                                pagination={false}

                            />
                        </Fragment>
                        : null}
                </Modal>
                <AddDeviceModal ref='add_device_modal' translation={this.props.translation} />

                {(this.state.sectionVisible) ?
                    <Modal
                        width={1000}
                        maskClosable={false}
                        visible={this.state.flaggedDevicesModal}
                        onOk={this.handleOk}
                        onCancel={() => this.setState({ flaggedDevicesModal: false })}
                        okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    >
                        <Fragment>
                            <h1>{convertToLang(this.props.translation["FLAGGED DEVICES"], "FLAGGED DEVICES")}</h1>
                            <Table
                                bordered
                                columns={this.state.columns}
                                style={{ marginTop: 20 }}
                                dataSource={this.renderList(flaggedDevices, true)}
                                pagination={false}

                            />
                        </Fragment>

                    </Modal>
                    : null}
            </div>
        )
    }
}


function showConfirm(_this, msg, action, request) {
    confirm({
        title: convertToLang(this.props.translation[WARNING], "WARNING!"),
        content: msg,
        okText: convertToLang(this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            action(request);
        },
        onCancel() { },
    });
}