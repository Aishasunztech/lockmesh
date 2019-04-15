import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    showHistoryModal,
    showSaveProfileModal,
    saveProfile,
    hanldeProfileInput,
    transferDeviceProfile,
    getDealerApps
} from "../../../appRedux/actions/ConnectDevice";

import { Card, Row, Col, Button, message, Icon, Modal, Input, Tooltip } from "antd";
import TableHistory from "./TableHistory";
import SuspendDevice from '../../devices/components/SuspendDevice';
import ActivateDevcie from '../../devices/components/ActivateDevice';
import EditDevice from '../../devices/components/editDevice';
import FlagDevice from '../../ConnectDevice/components/flagDevice';
import WipeDevice from '../../ConnectDevice/components/wipeDevice';
import DealerApps from "./DealerApps";


const confirm = Modal.confirm;

class SideActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pushAppsModal: false,
            historyModal: false,
            saveProfileModal: false,
            historyType: "history",
            saveProfileType: '',
            profileName: '',
            policyName: '',
            disabled: false,
            selectedApps: []
        }
    }

    componentDidMount() {
        // console.log(this.props.historyType, 'did')
        this.props.getDealerApps();
        this.setState({
            historyModal: this.props.historyModal,
            saveProfileModal: this.props.saveProfileModal,
            historyType: this.props.historyType,
            saveProfileType: this.props.saveProfileType,
            profileName: this.props.profileName,
            policyName: this.props.policyName
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            //  console.log(nextProps.historyType, 'reciceve')
            this.setState({
                historyModal: nextProps.historyModal,
                saveProfileModal: nextProps.saveProfileModal,
                historyType: nextProps.historyType,
                saveProfileType: nextProps.saveProfileType,
                profileName: nextProps.profileName,
                policyName: nextProps.policyName
            })
        }
    }

    showHistoryModal(visible, type) {
        if (((type !== undefined) || type === "" || type === null) && visible === false) {
            this.props.showHistoryModal(visible);
        } else {
            // console.log('else')
            this.props.showHistoryModal(visible, type);
        }
    }

    showSaveProfileModal(visible, profileType = '') {
        this.props.showSaveProfileModal(visible, profileType);
    }

    handleChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onInputChange = (e) => {
        this.props.hanldeProfileInput(this.state.saveProfileType, e.target.value);

    }
    saveProfile = () => {

        if (this.state.saveProfileType === "profile" && this.state.profileName !== '') {
            this.props.saveProfile(this.props.app_list, {
                adminPwd: this.props.adminPwd,
                guestPwd: this.props.guestPwd,
                encryptedPwd: this.props.encryptedPwd,
                duressPwd: this.props.duressPwd,
            }, this.state.saveProfileType, this.state.profileName, this.props.usr_acc_id);
        } else if (this.state.saveProfileType === "policy" && this.state.policyName !== '') {
            this.props.saveProfile(this.props.app_list,
                {
                    adminPwd: this.props.adminPwd,
                    guestPwd: this.props.guestPwd,
                    encryptedPwd: this.props.encryptedPwd,
                    duressPwd: this.props.duressPwd,
                }, this.state.saveProfileType, this.state.policyName, this.props.usr_acc_id);
        }
        this.showSaveProfileModal(false)
    }
    transferDeviceProfile = (device_id) => {
        let _this = this;
        confirm({
            content: (
                <h2>
                    Are You Sure, You want to Transfer this Device
            </h2>
            ),
            onOk() {
                // console.log('OK');
                _this.props.transferDeviceProfile(device_id);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    showPushAppsModal = (visible) => {
        this.setState({
            pushAppsModal: visible
        })
    }

    pushApps = () => {
        if (this.selectedApps.length) {
            console.log("save pushed apps", this.selectedApps);
        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log("on selection", selectedRows)
        this.setState({
            selectedApps: selectedRows
        })
    }

    handleFlag(flagged) {
        if (flagged == 'Unflag') {
            showConfirm(this.props.device, this.props.unflagged, this, "Do you really want to unflag the device ", 'flagged')
        }
        else {
            this.refs.flag_device.showModel(this.props.device, this.props.flagged, this.props.refreshDevice)
        }
    }
    render() {
        // console.log(this.props.authUser);
        const device_status = (this.props.device.account_status === "suspended") ? "Activate" : "Suspend";
        const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
        const flagged = (this.props.device.flagged !== '') ? 'Unflag' : 'Flag';
        // console.log(flagged);
        return (
            <div className="gutter-box bordered">
                <div className="gutter-example side_action">
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                <Button type="default" placement="bottom" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showPushAppsModal(true)} ><Icon type='upload' /> Push</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "policy")} ><Icon type="file" />Load Policy</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "profile")} ><Icon type="file" />Load Profile</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "history")} ><Icon type="file" />Load History</Button>

                                {/* <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button> */}

                            </Col>
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                <Tooltip placement="bottom" title="Coming Soon">
                                    <Button type="default " style={{ width: "100%", marginBottom: 15 }} > <Icon type='download' /> Pull</Button>
                                </Tooltip>
                                {(localStorage.getItem("type") === "admin") ? <Button type="primary " style={{ width: "100%", marginBottom: 15 }} onClick={() => { this.showSaveProfileModal(true, 'policy') }} ><Icon type="save" style={{ fontSize: "14px" }} /> Save Policy</Button> : null}
                                {(localStorage.getItem("type") === "admin" || localStorage.getItem("type") === "dealer") ? <Button type="primary " style={{ width: "100%", marginBottom: 15 }} onClick={() => { this.showSaveProfileModal(true, 'profile') }} >
                                    <Icon type="save" style={{ fontSize: "14px" }} /> Save Profile</Button> : null}

                                {/* <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button> */}
                                <Tooltip title="Coming Soon" placement="left">
                                    <Button type="default" style={{ width: "100%", marginBottom: 15 }} >IMEI</Button>
                                </Tooltip>
                            </Col>

                        </Row>
                    </Card>
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={12} className="gutter-row" justify="center" >
                                <Tooltip title="Coming Soon">
                                    <Button type="default" style={{ width: "100%", marginBottom: 15, backgroundColor: '#00336C', color: '#fff' }} ><Icon type="swap" /> Transfer</Button>
                                    {/* <Button type="default" onClick={() => { if (flagged === "Unflag") { this.transferDeviceProfile(this.props.device_id) } else { message.error('Plaese Flag the device first to Transfer'); } }} style={{ width: "100%", marginBottom: 15, backgroundColor: '#00336C', color: '#fff' }} ><Icon type="swap" /> Transfer</Button> */}
                                </Tooltip>
                                <Button type={button_type}
                                    onClick={() => (device_status === "Activate") ? this.handleActivateDevice(this.props.device) : this.handleSuspendDevice(this.props.device, this)}
                                    style={{ width: "100%", marginBottom: 15, fontSize: "12px" }}
                                    disabled={(flagged === 'Unflag') ? 'disabled' : ''}
                                >

                                    {(this.props.device.account_status === '') ? <div><Icon type="user-delete" /> {device_status}</div> : <div><Icon type="user-add" /> {device_status}</div>}
                                </Button>

                                <Button type="default" style={{ width: "100%", marginBottom: 15, backgroundColor: '#f31517', color: '#fff' }} onClick={() => this.refs.wipe_device.showModel(this.props.device, this.props.wipe)}><Icon type="lock" /> Wipe Device</Button>
                            </Col>
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button style={{ width: "100%", marginBottom: 15, backgroundColor: '#1b1b1b', color: '#fff' }} onClick={() => this.handleFlag(flagged)} ><Icon type="flag" />{flagged}</Button>
                                <Button onClick={() => showConfirm(this.props.device, this.props.unlinkDevice, this, "Do you really want to unlink the device ", 'unlink')} style={{ width: "100%", marginBottom: 15, backgroundColor: '#00336C', color: '#fff' }} ><Icon type='disconnect' />Unlink</Button>
                                <Button onClick={() => this.refs.edit_device.showModal(this.props.device, this.props.editDevice)} style={{ width: "100%", marginBottom: 15, backgroundColor: '#FF861C', color: '#fff' }}><Icon type='edit' />Edit</Button>

                            </Col>
                            <Tooltip title="Coming Soon" placement="bottom" >
                                <Button type="default" style={{ width: "46%", marginBottom: 15, backgroundColor: '#f31517', color: '#fff' }} ><Icon type="lock" /><Icon type="poweroff" style={{ color: 'yellow', fontSize: '16px', verticalAlign: 'text-top', margin: '0px 30px 0 15px' }} /></Button>
                            </Tooltip>
                        </Row>
                    </Card>
                </div>
                <Modal
                    title={this.state.historyType}
                    style={{ top: 20 }}
                    visible={this.state.historyModal}
                    onOk={() => this.showHistoryModal(false, '')}
                    onCancel={() => this.showHistoryModal(false, '')}
                >
                    {(this.state.historyType === "history") ?
                        <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.histories} type={this.state.historyType} />
                        :
                        (this.state.historyType === "profile") ?
                            <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.profiles} type={this.state.historyType} />
                            :
                            (this.state.historyType === "policy") ?
                                <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.policies} type={this.state.historyType} />
                                :
                                (this.state.historyType === undefined) ?
                                    <p>{this.state.historyType}</p> : null
                    }

                </Modal>
                {/* title={this.state.profileType[0] + this.state.profileType.substring(1,this.state.profileType.length).toLowerCase()} */}
                <Modal
                    closable={false}
                    style={{ top: 20 }}

                    visible={this.state.saveProfileModal}
                    onOk={() => {
                        this.saveProfile();
                    }}
                    onCancel={() => this.showSaveProfileModal(false)}

                >
                    <Input placeholder={`Enter ${this.state.saveProfileType} name`} required onChange={(e) => { this.onInputChange(e) }} value={(this.state.saveProfileType === "policy") ? this.state.policyName : this.state.profileName} />
                </Modal>

                <Modal
                    // closable={false}
                    style={{ top: 20 }}
                    title="Select Apps"
                    visible={this.state.pushAppsModal}
                    onOk={() => {
                        this.pushApps();

                        this.showPushAppsModal(false)
                    }}
                    onCancel={() => this.showPushAppsModal(false)}
                    okText="Push Apps"
                >
                    <DealerApps
                        apk_list={this.props.apk_list}
                        onSelectChange={this.onSelectChange}
                    />
                </Modal>

                <ActivateDevcie
                    ref="activate"
                    activateDevice={this.props.activateDevice}
                />

                <SuspendDevice
                    ref="suspend"
                    suspendDevice={this.props.suspendDevice}
                // go_back={this.props.history.goBack}
                // getDevice={this.props.getDevicesList}
                />

                <EditDevice
                    ref='edit_device'
                />
                <WipeDevice
                    ref='wipe_device'
                    device={this.props.device}
                    authUser={this.props.authUser}
                    checkPass={this.props.checkPass}
                />
                <FlagDevice
                    ref='flag_device'
                // go_back={this.props.history.goBack}
                // getDevice={this.props.getDevicesList}
                />
            </div>
        )
    }
    handleSuspendDevice = (device, _this) => {
        this.refs.suspend.handleSuspendDevice(device, this.props.refreshDevice);

    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device, this.props.refreshDevice);

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        showHistoryModal: showHistoryModal,
        showSaveProfileModal: showSaveProfileModal,
        saveProfile: saveProfile,
        hanldeProfileInput: hanldeProfileInput,
        transferDeviceProfile: transferDeviceProfile,
        getDealerApps: getDealerApps
    }, dispatch);
}
var mapStateToProps = ({ device_details, auth }) => {
    const { authUser } = auth;
    return {
        authUser,
        historyModal: device_details.historyModal,
        saveProfileModal: device_details.saveProfileModal,
        historyType: device_details.historyType,
        saveProfileType: device_details.saveProfileType,
        profileName: device_details.profileName,
        policyName: device_details.policyName,
        app_list: device_details.app_list,
        guestPwd: device_details.guestPwd,
        guestCPwd: device_details.guestCPwd,
        encryptedPwd: device_details.encryptedPwd,
        encryptedCPwd: device_details.encryptedCPwd,
        duressPwd: device_details.duressPwd,
        duressCPwd: device_details.duressCPwd,
        adminPwd: device_details.adminPwd,
        adminCPwd: device_details.adminCPwd,
        device_id: device_details.device.device_id,
        usr_acc_id: device_details.device.id,
        apk_list: device_details.apk_list
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SideActions);
function showConfirm(device, action, _this, msg, type) {
    confirm({
        title: msg + device.device_id,
        onOk() {
            _this.setState({ disabled: true })
            // console.log('go back func', _this.props);
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);
                if (type === 'wipe') {
                    action(device)
                } else if (type === 'unlink') {
                    action(device);
                }
                if (type === 'flagged') {
                    action(device.device_id)
                    _this.props.activateDevice(device)
                }
                if (type === 'unlink') {
                    _this.props.history.goBack();
                    _this.props.getDevicesList();
                } else {
                    _this.props.refreshDevice(device.device_id);
                }
                //  message.success('Action Done Susscefully ');

            }).catch(() => console.log(''));
        },
        onCancel() { },
    });
}