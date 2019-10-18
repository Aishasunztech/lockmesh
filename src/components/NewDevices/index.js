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
            flaggedDevicesModal: false,
            reqDevice: '',
            showLInkRequest: false
        }
    }



    showModal = (sectionVisible = true, showLInkRequest = false) => {
        this.setState({
            visible: true,
            sectionVisible,
            showLInkRequest: showLInkRequest
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

    flaggedDevices = (reqDevice) => {
        this.setState({
            flaggedDevicesModal: true,
            reqDevice,
        })
    }

    transferDevice = (device, requestedDevice = false) => {
        let DEVICE_REQUEST_IS = (requestedDevice) ? requestedDevice : this.state.reqDevice;
        this.props.transferDeviceProfile({ flagged_device: device, reqDevice: DEVICE_REQUEST_IS });
        this.setState({ flaggedDevicesModal: false, visible: false })
    }
    rejectRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectRequest, request)
    }

    acceptRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptRequest, request)
    }


    filterList = (devices) => {
        let dumyDevices = [];
        if (devices !== undefined) {
            devices.filter(function (device) {
                if (device.finalStatus !== DEVICE_UNLINKED) {
                    let deviceStatus = device.flagged;
                    if ((deviceStatus === 'Defective' || deviceStatus === 'Lost' || deviceStatus === 'Stolen' || deviceStatus === 'Other') && (device.finalStatus === "Flagged")) {
                        dumyDevices.push(device);
                    }
                }
            });
        }
        return dumyDevices;
    }


    renderList1(list) {
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

            let transferButton;
            if (this.state.sectionVisible || this.state.showLInkRequest) {
                transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={(flagged) ? () => this.transferDevice(device) : () => this.flaggedDevices(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
            }
            else {
                transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={() => this.transferDevice(this.props.device_details, device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
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
                if (this.state.showLInkRequest) {
                    if (flagged) {
                        actionButns = (<Fragment>{transferButton}</Fragment>);
                    }
                    else {
                        actionButns = (<Fragment>
                            <Fragment>{declineButton}</Fragment>
                            <Fragment>{acceptButton}</Fragment>
                            <Fragment>{transferButton}</Fragment>
                        </Fragment>);
                    }
                } else {
                    actionButns = (<Fragment>{transferButton}</Fragment>);
                }
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



    render() {
        let flaggedDevices = this.filterList(this.props.flaggedDevices)
        // console.log('check flaggedDevices ', flaggedDevices, 'requests', this.props.requests, 'NewDevices', this.props.devices)
        return (
            <div>
                <Modal
                    width={1000}
                    maskClosable={false}
                    visible={this.state.visible}
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                // okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
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
                    {/* {(this.state.sectionVisible) ?
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
                        : null} */}
                </Modal>
                <AddDeviceModal ref='add_device_modal' translation={this.props.translation} />

                {(this.state.sectionVisible || this.state.showLInkRequest) ?
                    <Modal
                        width={1000}
                        maskClosable={false}
                        visible={this.state.flaggedDevicesModal}
                        // onOk={this.handleOk}
                        footer={null}
                        onCancel={() => this.setState({ flaggedDevicesModal: false })}
                    // okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    >
                        <Fragment>
                            <h1>{convertToLang(this.props.translation["FLAGGED DEVICES"], "FLAGGED DEVICES")}</h1>
                            <Table
                                bordered
                                columns={this.state.columns}
                                style={{ marginTop: 20 }}
                                dataSource={this.renderList(flaggedDevices, true)}
                                pagination={false}
                                scroll={{ x: true }}
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
        title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
        content: msg,
        okText: convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            action(request);
        },
        onCancel() {


        },
    });
}