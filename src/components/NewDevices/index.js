import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, Form, Row, Col, Icon, Checkbox, Tabs } from 'antd';
import { withRouter, Link, Redirect } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import { ADMIN, ACTION, CREDITS, CREDITS_CASH_REQUESTS, ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST, ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST, WARNING, DEVICE_UNLINKED } from '../../constants/Constants';
import {
  checkValue, convertToLang, getDateFromTimestamp,
  getOnlyTimeFromTimestamp
} from '../../routes/utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm, Button_Decline, Button_ACCEPT, Button_Transfer, Button_Yes, Button_No } from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME, DEALER_ID, DEALER_PIN } from '../../constants/DealerConstants';
const moment = require('moment')
const confirm = Modal.confirm;
const { TabPane } = Tabs;

export default class NewDevices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: "#", dataIndex: 'counter', key: 'counter', align: "center", render: (text, record, index) => ++index },
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

        const cancelServiceColumns = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEVICE_ID], "DEVICE ID"), dataIndex: 'device_id', key: 'device_id', align: "center" },
            { title: convertToLang(props.translation[DEALER_PIN], "DEALER PIN"), dataIndex: 'dealer_pin', key: 'dealer_pin', align: "center" },
            { title: convertToLang(props.translation[""], "SERVICE TERM"), dataIndex: 'service_term', key: 'service_term', align: "center" },
            { title: convertToLang(props.translation[""], "SERVICE REMAINING DAYS"), dataIndex: 'service_remaining_days', key: 'service_remaining_days', align: "center" },
            { title: convertToLang(props.translation[""], "CREDITS TO REFUND"), dataIndex: 'credits_to_refund', key: 'credits_to_refund', align: "center" },
        ];
        const ticketNotificationColumns = [
            { title: <Button size="small" type="primary" onClick={() => {
              let tickets = this.state.selectedTicketNotifications;
              this.setState({selectedTicketNotifications: []});
              this.props.updateTicketNotifications({ticketIds: tickets});
            }}><Icon type="eye" /></Button>, dataIndex: 'selection', key: 'action', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET SUBJECT"), dataIndex: 'subject', width: 200, key: 'ticket_subject', align: "center" },
            { title: convertToLang(props.translation[""], "DEALER NAME"), dataIndex: 'dealer_name', key: 'dealer_name', align: "center" },
            { title: convertToLang(props.translation[""], "DEALER PIN"), dataIndex: 'dealer_pin', key: 'dealer_pin', align: "center" },
            { title: convertToLang(props.translation[""], "TYPE"), dataIndex: 'type', key: 'type', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET PRIORITY"), dataIndex: 'priority', key: 'priority', align: "center" },
            { title: convertToLang(props.translation[""], "TICKET CATEGORY"), dataIndex: 'category', key: 'category', align: "center" },
            { title: convertToLang(props.translation[""], "CREATED AT"), dataIndex: 'created_at', key: 'created_at', align: "center" },
        ];

        const supportSystemMessages = [
            {
                title: <Button size="small" type="primary" onClick={() => {
                    let selectedMessage = this.state.selectedSystemMessages;
                    this.setState({ selectedSystemMessages: [] });
                    this.props.updateSupportSystemMessageNotification({ systemMessageId: selectedMessage });
                }}><Icon type="eye" /></Button>, dataIndex: 'selection', key: 'action', align: "center"
            },
            { title: convertToLang(props.translation[""], "SUBJECT"), dataIndex: 'subject', key: 'subject', align: "center" },
            { title: convertToLang(props.translation[""], "SENDER"), dataIndex: 'sender', key: 'sender', align: "center" },
            { title: convertToLang(props.translation[""], "CREATED AT"), dataIndex: 'created_at', key: 'created_at', align: "center" },
        ];

        this.state = {
            columns: columns,
            columns1: columns1,
            cancelServiceColumns: cancelServiceColumns,
            ticketNotificationColumns: ticketNotificationColumns,
            supportSystemMessages: supportSystemMessages,
            visible: false,
            NewDevices: [],
            NewRequests: [],
            sectionVisible: true,
            flaggedDevicesModal: false,
            reqDevice: '',
            dealers: [],
            redirect: false,
            showLInkRequest: false,
            selectedSystemMessages: [],
            systemMessagesNotifications: [],
            selectedTicketNotifications: [],
            ticketNotifications: []
        }
    }

    updateSystemMessagesSelection = (e, val) => {
        let selectedMessages = this.state.selectedSystemMessages;
        if (e.target.checked) {
            this.setState({ selectedSystemMessages: [...selectedMessages, val] });
        } else {
            this.setState({ selectedSystemMessages: selectedMessages.filter(message => message !== val) });
        }
    }

    updateTicketsSelection = (e, val) => {
        let selectedTickets = this.state.selectedTicketNotifications;
        if (e.target.checked) {
            this.setState({ selectedTicketNotifications: [...selectedTickets, val] });
        } else {
            this.setState({ selectedTicketNotifications: selectedTickets.filter(ticket => ticket !== val) });
        }
    }



    showModal = (sectionVisible = true, showLInkRequest = false) => {
        this.setState({
            visible: true,
            sectionVisible,
            showLInkRequest: showLInkRequest
        });
    }

    setPageState(data) {
        this.setState({ redirect: data, visible: false });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    componentDidMount() {
        this.setState({
            NewDevices: this.props.devices,
            NewRequests: this.props.requests
        });

        if(this.props.dealers){
          this.setState({dealers: this.props.dealers});
        }
    }

    componentDidUpdate(prevProps){
      if(prevProps !== this.props){
        this.setState({systemMessagesNotifications: this.props.supportSystemMessagesNotifications});
        this.setState({ticketNotifications: this.props.ticketNotifications});

        if(this.props.dealers){
          this.setState({dealers: this.props.dealers});
        }
      }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.devices.length !== nextProps.devices.length || this.props.requests.length !== nextProps.requests.length) {
            this.setState({
                NewDevices: nextProps.devices,
                NewRequests: nextProps.requests
            });
        }

        if (nextProps.supportSystemMessagesNotifications) {
            this.setState({ systemMessagesNotifications: nextProps.supportSystemMessagesNotifications });
        }

        if (nextProps.ticketNotifications) {
            this.setState({ ticketNotifications: nextProps.ticketNotifications });
        }

        if(nextProps.dealers){
          this.setState({dealers: nextProps.dealers});
        }
    }

    handleTransferDeviceProfile = (obj) => {
        // console.log('at req transferDeviceProfile', obj)
        let _this = this;
        Modal.confirm({
            content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
            onOk() {
                // console.log('OK');
                _this.props.transferDeviceProfile(obj);
                _this.setState({ flaggedDevicesModal: false, visible: false });
            },
            onCancel() { },
            okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(this.props.translation[Button_No], 'No'),
        });
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
        this.handleTransferDeviceProfile({ flagged_device: device, reqDevice: DEVICE_REQUEST_IS });
        // this.setState({ flaggedDevicesModal: false, visible: false })
    }
    rejectRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectRequest, request)
    }

    rejectServiceRequest(request) {
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST], "Are you sure you want to decline this request ?"), this.props.rejectServiceRequest, request)
    }

    acceptServiceRequest(request) {
        console.log(this.props.acceptServiceRequest);
        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptServiceRequest, request)
    }

    acceptRequest(request) {

        showConfirm(this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST], "Are you sure you want to accept this request ?"), this.props.acceptRequest, request)
    }

    acceptDevice(device) {
        if (this.props.authUser.account_balance_status === 'suspended') {
            showSupendAccountWarning(this)
        } else {
            this.refs.add_device_modal.showModal(device, this.props.addDevice);
            this.setState({ visible: false })
        }
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
        if (list && Array.isArray(list) && list.length > 0) {
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
        } else {
            return []
        }

    }

    renderTicketNotifications(list) {
      let { setCurrentSupportTicketId, setSupportPage } = this.props;

        if (list && Array.isArray(list) && list.length > 0) {
          return list.map((notification) => {
            let dealer_name = 'N/A';
            let dealer_pin = 'N/A';
            let dealer = this.state.dealers.find(dealer => dealer.dealer_id == notification.user_id);
            if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('dealer_name')) {
              dealer_name = dealer.dealer_name;
            }
            if (typeof dealer !== 'undefined' && dealer.hasOwnProperty('dealer_type') && dealer.dealer_type !== 1 && dealer.hasOwnProperty('link_code')) {
              dealer_pin = dealer.link_code;
            }
            return {
                  selection: <Checkbox defaultChecked={false} checked={this.state.selectedTicketNotifications.some(item => item === notification._id)} onChange={(e) => this.updateTicketsSelection(e, notification._id)} />,
                  id: notification.id,
                  key: notification.id,
                  dealer_name: dealer_name,
                  dealer_pin: dealer_pin,
                  type: notification.type,
                  subject: <a href="javascript:void(0);" onClick={() => {
                    setCurrentSupportTicketId(notification.ticket);
                    setSupportPage('2');
                    this.setPageState(true);
                  }}>{notification.ticket.subject.length > 30 ? notification.ticket.subject.substr(0, 30) + '...' : notification.ticket.subject}</a>,
                  category: notification.ticket.category,
                  priority: notification.ticket.priority,
                  created_at: moment(notification.createdAt).format('YYYY/MM/DD hh:mm:ss'),
              }
          });
        } else {
            return [];
        }

    }

    renderSupportSystemMessagesNotifications(list) {
      let { setCurrentSystemMessageId, setSupportPage } = this.props;
        if (list && Array.isArray(list) && list.length > 0) {
            return list.map((notification) => {
                return {
                    selection: <Checkbox defaultChecked={false} checked={this.state.selectedSystemMessages.some(item => item === notification.system_message._id)} onChange={(e) => this.updateSystemMessagesSelection(e, notification.system_message._id)} />,
                    id: notification.id,
                    key: notification.id,
                    sender: <span className="text-capitalize">{notification.sender_user_type}</span>,
                    subject: <a href="javascript:void(0);" onClick={() => {
                      let sender = notification.system_message.sender_user_type.charAt(0).toUpperCase() + notification.system_message.sender_user_type.slice(1);
                      let data = {
                        id: notification.system_message._id,
                        key: notification.system_message._id,
                        rowKey: notification.system_message._id,
                        type: 'Received',
                        sender_user_type: notification.sender_user_type,
                        sender: sender,
                        subject: checkValue(notification.system_message.subject),
                        message: checkValue(notification.system_message.message),
                        createdAt: getDateFromTimestamp(notification.system_message.createdAt),
                        createdTime: getOnlyTimeFromTimestamp(notification.system_message.createdAt)
                      }
                      setCurrentSystemMessageId(data);
                      setSupportPage('1');
                      this.setPageState(true);
                  }}>{checkValue(notification.system_message.subject).length > 30 ? checkValue(notification.system_message.subject).substr(0, 30) + "..." : checkValue(notification.system_message.subject)}</a>,
                    created_at: moment(notification.createdAt).format('YYYY/MM/DD hh:mm:ss'),
                }
            });
        } else {
            return [];
        }
    }

    renderServiceRequestList(list) {
        if (list && Array.isArray(list) && list.length > 0) {
            return list.map((request) => {

                return {
                    key: request.id,
                    action: <div>
                        <Button
                            type="danger"
                            size="small"
                            style={{ margin: '0 8px 0 8px' }}
                            onClick={() => { this.rejectServiceRequest(request); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            style={{ margin: '0 8px 0 8px' }}
                            onClick={() => { this.acceptServiceRequest(request) }}>
                            {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}
                        </Button>
                    </div>,
                    device_id: request.device_id ? `${request.device_id}` : "PRE-ACTIVATION",
                    dealer_pin: request.dealer_pin ? `${request.dealer_pin}` : "N/A",
                    service_term: request.service_term + " Months",
                    service_remaining_days: request.service_remaining_days,
                    credits_to_refund: request.credits_to_refund,
                }
            });
        } else {
            return []
        }

    }

    renderList(list, flagged = false) {
        if (list && Array.isArray(list) && list.length > 0) {
            return list.map((device) => {

                let transferButton;
                if (this.state.sectionVisible || this.state.showLInkRequest) {
                    transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={(flagged) ? () => this.transferDevice(device) : () => this.flaggedDevices(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
                }
                else {
                    transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={() => this.transferDevice(this.props.device_details, device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>;
                }

                let declineButton = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.rejectDevice(device); }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>;
                let acceptButton = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => { this.acceptDevice(device) }}> {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")}</Button>;

                let actionButns;
                if (this.state.sectionVisible) {
                    if (this.props.allDevices !== undefined) {
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
        } else {
            return []
        }

    }



    render() {
        let flaggedDevices = this.filterList(this.props.allDevices)
        // console.log('check flaggedDevices ', flaggedDevices, 'requests', this.props.requests, 'NewDevices', this.props.devices)
        if (this.state.redirect) {
            let page = this.state.supportPage;
            this.setPageState(false);
            window.history.replaceState({}, null);
            return <Redirect to={{ pathname: '/support' }} />
        }
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
                    <Tabs tabPosition={'top'}>

                        {(this.props.authUser.type === ADMIN) ? null :
                            <TabPane tab={convertToLang(this.props.translation[DEVICE_REQUESTS], "DEVICE REQUESTS")} key="1">
                                <Fragment>
                                    {/* <h1>{convertToLang(this.props.translation[DEVICE_REQUESTS], "DEVICE REQUESTS")}</h1> */}
                                    <Table
                                        bordered
                                        columns={this.state.columns}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderList(this.state.NewDevices)}
                                        pagination={false}

                                    />
                                </Fragment>
                            </TabPane>
                        }
                        {(this.state.sectionVisible && this.props.authUser.type === ADMIN) ?
                            <TabPane tab={convertToLang(this.props.translation[""], "CANCEL SERVICES REQUESTS")} key="2">
                                <Fragment>
                                    {/* <h1>{convertToLang(this.props.translation[""], "CANCEL SERVICES REQUESTS")}</h1> */}
                                    <Table
                                        bordered
                                        columns={this.state.cancelServiceColumns}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderServiceRequestList(this.props.cancel_service_requests)}
                                        pagination={false}

                                    />
                                </Fragment>
                            </TabPane>
                            : null}
                        <TabPane tab={convertToLang(this.props.translation[""], "Ticket Notifications")} key="3">
                            <Fragment>
                                <Row className="width_100" style={{ display: "block", marginLeft: 0 }}>
                                    {/* <h1 style={{ display: "inline" }}>{convertToLang(this.props.translation[""], "Ticket Notifications")} */}
                                    <Button type="primary" size="small" style={{ float: "right", marginTop: '6px' }} onClick={() => {
                                        this.props.setSupportPage('2');
                                        if (window.location.pathname !== '/support') {
                                            this.setPageState(true);
                                        } else {
                                            this.setState({
                                                visible: false
                                            });
                                        }
                                    }}>View Tickets</Button>
                                    {/* </h1> */}

                                </Row>
                                <Table
                                    bordered
                                    columns={this.state.ticketNotificationColumns}
                                    style={{ marginTop: 20 }}
                                    dataSource={this.renderTicketNotifications(this.state.ticketNotifications)}
                                    pagination={false}

                                />
                            </Fragment>
                        </TabPane>
                        {this.props.authUser.type !== ADMIN ?
                            <TabPane tab={convertToLang(this.props.translation[""], "System Message Notifications")} key="4">
                                <Fragment>
                                    <Row className="width_100" style={{ display: "block", marginLeft: 0 }}>
                                        {/* <h1>{convertToLang(this.props.translation[""], "System Message Notifications")} */}

                                        <Button type="primary" size="small" style={{ float: "right", marginTop: '6px' }} onClick={() => {
                                            this.props.setSupportPage('1');
                                            if (window.location.pathname !== '/support') {
                                                this.setPageState(true);
                                            } else {
                                                this.setState({
                                                    visible: false
                                                });
                                            }
                                        }}>View System Messages</Button>
                                        {/* </h1> */}

                                    </Row>
                                    <Table
                                        bordered
                                        columns={this.state.supportSystemMessages}
                                        style={{ marginTop: 20 }}
                                        dataSource={this.renderSupportSystemMessagesNotifications(this.state.systemMessagesNotifications)}
                                        pagination={false}

                                    />
                                </Fragment>
                            </TabPane>
                            : ''}
                    </Tabs>
                </Modal>
                <AddDeviceModal ref='add_device_modal' translation={this.props.translation} />

                {
                    (this.state.sectionVisible || this.state.showLInkRequest) ?
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
                        : null
                }
            </div >
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
function showSupendAccountWarning(_this) {
    confirm({
        title: "Your account is past due, please make a payment of past due to bring your account up to date to use the ADD DEVICE feature.",
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}
