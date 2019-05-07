import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Card, Row, Col, Button, message, Icon, Modal, Input, Tooltip, Progress } from "antd";
import TableHistory from "./TableHistory";
import SuspendDevice from '../../devices/components/SuspendDevice';
import ActivateDevcie from '../../devices/components/ActivateDevice';
import EditDevice from '../../devices/components/editDevice';
import FlagDevice from '../../ConnectDevice/components/flagDevice';
import WipeDevice from '../../ConnectDevice/components/wipeDevice';
import ImeiView from '../../ConnectDevice/components/ImeiView';
import DealerApps from "./DealerApps";
import PasswordForm from './PasswordForm';

import {
    showHistoryModal,
    showSaveProfileModal,
    saveProfile,
    savePolicy,
    hanldeProfileInput,
    transferDeviceProfile,
    getDealerApps,
    loadDeviceProfile,
    showPushAppsModal,
    applyPushApps
} from "../../../appRedux/actions/ConnectDevice";

import {
    ADMIN, DEALER, SDEALER
} from "../../../constants/Constants";


import { PUSH_APPS } from "../../../constants/ActionTypes"

const confirm = Modal.confirm;

const PasswordModal = (props) => {
    return (
        <Modal
            // closable={false}
            style={{ top: 20 }}
            width="330px"
            className="push_app"
            title=""
            visible={props.pwdConfirmModal}
            footer={false}
            onOk={() => {

            }}
            onCancel={() => props.showPwdConfirmModal(false)}
            okText="Push Apps"
        >
            <PasswordForm
                checkPass={props.checkPass}
                actionType={PUSH_APPS}
                handleCancel={props.showPwdConfirmModal}
            />
        </Modal>
    )
}


const DealerAppModal = (props) => {
    return (
        <Modal
            // closable={false}
            style={{ top: 20 }}
            width="650px"
            title="Select Apps"
            visible={props.pushAppsModal}
            onOk={() => {
                props.showPushAppsModal(false);
                props.showSelectedAppsModal(true);
            }}
            onCancel={() => props.showPushAppsModal(false)}
            okText="Push Apps"
        >
            <DealerApps
                apk_list={props.apk_list}
                onSelectChange={props.onSelectChange}
                isSwitchable={true}
                selectedApps={props.selectedApps}
                handleChecked={props.handleChecked}
            />
        </Modal>
    )
}

const SelectedApps = (props) => {
    return (
        <Modal
            // closable={false}
            style={{ top: 20 }}
            width="650px"
            title="Selected Apps"
            visible={props.selectedAppsModal}
            onOk={() => {
                props.applyPushApps(props.apk_list);
                props.showSelectedAppsModal(false);
            }}
            onCancel={() => props.showSelectedAppsModal(false)}
            okText="Push Apps"
        >
            <DealerApps
                apk_list={props.apk_list}
                isSwitchable={false}
                selectedApps={props.selectedApps}
            />
        </Modal>
    )
}




class SideActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pushAppsModal: false,
            historyModal: false,
            saveProfileModal: false,
            pwdConfirmModal: false,
            selectedAppsModal: false,
            historyType: "history",
            saveProfileType: '',
            profileName: '',
            policyName: '',
            disabled: false,
            selectedApps: []
        }
    }

    componentDidMount() {
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

    showHistoryModal = (visible, type) => {
        if (((type !== undefined) || type === "" || type === null) && visible === false) {
            this.props.showHistoryModal(visible);
        } else {
            // console.log('else')
            this.props.showHistoryModal(visible, type);
        }
    }

    showSaveProfileModal = (visible, profileType = '') => {
        this.props.showSaveProfileModal(visible, profileType);
    }

    showPwdConfirmModal = (visible) => {
        // alert('hello');
        this.setState({
            pwdConfirmModal: visible
        })
    }

    showSelectedAppsModal = (visible) => {
        this.setState({
            selectedAppsModal: visible
        })
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
            }, this.state.profileName, this.props.usr_acc_id, this.props.controls.controls, this.props.extensions);
        } else if (this.state.saveProfileType === "policy" && this.state.policyName !== '') {
            this.props.savePolicy(this.props.app_list,
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
        if (this.state.selectedApps.length) {
            console.log("save pushed apps", this.state.selectedApps);
        } else {

        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let selectedApps = selectedRows;
        selectedApps.map(el=>{
            if(typeof (el.guest) !== Boolean){
                el.guest = false
            }

            if(typeof (el.encrypted) !== Boolean){
                el.encrypted = false
            }

            if(typeof (el.enable) !== Boolean){
                el.enable = false
            }
        });
        this.setState({
            selectedApps: selectedApps
        })
    }
    handleChecked = (e, key, app_id) => {
        // console.log("handlechecked", e, key, app_id);
        this.state.selectedApps.map((el) => {
            if (el.apk_id === app_id) {
                el[key] = e;
            }
        })
    }
    handleFlag(flagged) {
        if (flagged == 'Unflag') {
            showConfirm(this.props.device, this.props.unflagged, this, "Do you really want to unflag the device ", 'flagged')
        } else {
            this.refs.flag_device.showModel(this.props.device, this.props.flagged, this.props.refreshDevice)
        }
    }

    applyHistory = (historyId) => {
        const historyType = this.state.historyType;
        if (historyType === 'history') {

        } else if (historyType === "profile") {

        } else if (historyType === "policy") {
            alert(historyId);
        }
    }
    applyPushApps = () => {
        this.props.applyPushApps(this.state.selectedApps, this.props.device_id, this.props.usr_acc_id);
    }
    render() {
        // console.log(this.props.device);
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
                                <Button type="default" placement="bottom" style={{ width: "100%", marginBottom: 16, paddingRight: 30 }} onClick={() => this.showPwdConfirmModal(true)}   > <Icon type="lock"  className="lock_icon" /> <Icon type='upload' /> Push</Button>
                                
                                <Button disabled type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={() => this.showHistoryModal(true, "profile")} ><Icon type="file" />Load Profile</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={() => this.showHistoryModal(true, "policy")} ><Icon type="file" />Load Policy</Button>
                                <Tooltip title="Coming Soon" placement="left">
                                    <Button onClick={() => this.refs.imeiView.showModal(this.props.device)} type="default" style={{ width: "100%", marginBottom: 16 }} >IMEI</Button>
                                </Tooltip>

                            </Col>
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                <Tooltip placement="bottom" title="Coming Soon">
                                    <Button type="default " style={{ width: "100%", marginBottom: 16, paddingRight: 30 }} > <Icon type="lock" /> <Icon type='download' />Pull</Button>
                                </Tooltip>
                                {(this.props.authUser.type === ADMIN || this.props.authUser.type === DEALER) ? <Button type="primary " style={{ width: "100%", marginBottom: 15 }} onClick={() => { this.showSaveProfileModal(true, 'profile') }} >
                                    <Icon type="save" style={{ fontSize: "14px" }} /> Save Profile</Button> : null}

                                    <Button type="primary" style={{ width: "100%", marginBottom: 16 }} onClick={() => this.showHistoryModal(true, "history")} ><Icon type="file" />Load History</Button>

                                <Tooltip placement="left" title="Coming Soon">
                                    <Button type="default " style={{ width: "100%", marginBottom: 16 }} >Activity</Button>
                                </Tooltip>

                            </Col>

                        </Row>
                    </Card>
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={12} className="gutter-row" justify="center" >
                                <Tooltip title="Coming Soon">
                                    <Button type="default" style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} ><Icon type="swap" /> Transfer</Button>
                                    {/* <Button type="default" onClick={() => { if (flagged === "Unflag") { this.transferDeviceProfile(this.props.device_id) } else { message.error('Plaese Flag the device first to Transfer'); } }} style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} ><Icon type="swap" /> Transfer</Button> */}
                                </Tooltip>
                                <Button type={button_type}
                                    onClick={() => (device_status === "Activate") ? this.handleActivateDevice(this.props.device) : this.handleSuspendDevice(this.props.device, this)}
                                    style={{ width: "100%", marginBottom: 16, fontSize: "12px" }}
                                    disabled={(flagged === 'Unflag') ? 'disabled' : ''}
                                >

                                    {(this.props.device.account_status === '') ? <div><Icon type="user-delete" /> {device_status}</div> : <div><Icon type="user-add" /> {device_status}</div>}
                                </Button>

                                <Button type="default" style={{ width: "100%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }} onClick={() => this.refs.wipe_device.showModel(this.props.device, this.props.wipe)}><Icon type="lock" className="lock_icon" /> Wipe Device</Button>
                            </Col>
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button style={{ width: "100%", marginBottom: 16, backgroundColor: '#1b1b1b', color: '#fff' }} onClick={() => this.handleFlag(flagged)} ><Icon type="flag" />{flagged}</Button>
                                <Button onClick={() => showConfirm(this.props.device, this.props.unlinkDevice, this, "Do you really want to unlink the device ", 'unlink')} style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} ><Icon type='disconnect' />Unlink</Button>
                                <Button onClick={() => this.refs.edit_device.showModal(this.props.device, this.props.editDevice)} style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}><Icon type='edit' />Edit</Button>

                            </Col>
                            <Tooltip title="Coming Soon" placement="bottom" >
                                <Button type="default" style={{ width: "46%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }} ><Icon type="lock" className="lock_icon" /><Icon type="poweroff" style={{ color: 'yellow', fontSize: '16px', verticalAlign: 'text-top', margin: '0px 30px 0 15px' }} /></Button>
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
                        <TableHistory
                            histories={this.props.histories}
                            type={this.state.historyType}
                            applyHistory={this.applyHistory}
                        />
                        :
                        (this.state.historyType === "profile") ?
                            <TableHistory
                                histories={this.props.profiles}
                                type={this.state.historyType}
                                applyHistory={this.applyHistory}
                            />
                            :
                            (this.state.historyType === "policy") ?
                                <TableHistory
                                    histories={this.props.policies}
                                    type={this.state.historyType}
                                    applyHistory={this.applyHistory}
                                />
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

                <DealerAppModal
                    pushAppsModal={this.props.pushAppsModal}
                    showPushAppsModal={this.props.showPushAppsModal}
                    apk_list={this.props.apk_list}
                    onSelectChange={this.onSelectChange}
                    showSelectedAppsModal={this.showSelectedAppsModal}
                    selectedApps={this.state.selectedApps}
                    handleChecked={this.handleChecked}
                />

                <PasswordModal
                    pwdConfirmModal={this.state.pwdConfirmModal}
                    showPwdConfirmModal={this.showPwdConfirmModal}
                    checkPass={this.props.checkPass}
                />

                <SelectedApps
                    selectedAppsModal={this.state.selectedAppsModal}
                    showSelectedAppsModal={this.showSelectedAppsModal}
                    applyPushApps = {this.applyPushApps}
                    apk_list={this.state.selectedApps}
                    selectedApps={[]}
                />

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
                />
                <ImeiView
                    ref='imeiView'
                    device={this.props.device}
                    imei_list={this.props.imei_list}
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
        loadDeviceProfile: loadDeviceProfile,
        showPushAppsModal: showPushAppsModal,
        applyPushApps: applyPushApps,
        savePolicy: savePolicy
    }, dispatch);
}
var mapStateToProps = ({ device_details, auth }, otherProps) => {
    console.log('device_details.controls', device_details.extensions)

    return {
        authUser: auth.authUser,
        historyModal: device_details.historyModal,
        saveProfileModal: device_details.saveProfileModal,
        historyType: device_details.historyType,
        pushAppsModal: device_details.pushAppsModal,
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
        apk_list: otherProps.apk_list,
        controls: device_details.controls,
        extensions: device_details.extensions,
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