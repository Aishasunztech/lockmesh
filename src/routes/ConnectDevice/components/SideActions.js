import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Card, Row, Col, Button, message, Icon, Modal, Input, Tooltip, Progress } from "antd";
import TableHistory from "./TableHistory";
import SuspendDevice from '../../devices/components/SuspendDevice';
import ActivateDevcie from '../../devices/components/ActivateDevice';

import { componentSearch } from '../../utils/commonUtils';
import EditDevice from '../../devices/components/editDevice';
import FlagDevice from '../../ConnectDevice/components/flagDevice';
import WipeDevice from '../../ConnectDevice/components/wipeDevice';
import ImeiView from '../../ConnectDevice/components/ImeiView';
import DealerApps from "./DealerApps";
import PasswordForm from './PasswordForm';
import DeviceSettings from './DeviceSettings';
import Activity from './Activity';


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
    showPullAppsModal,
    applyPushApps,
    applyPullApps,
    writeImei,
    getActivities,
    hidePolicyConfirm,
    applyPolicy,
    applySetting
} from "../../../appRedux/actions/ConnectDevice";

import {
    ADMIN, DEALER, SDEALER, SECURE_SETTING
} from "../../../constants/Constants";


import { PUSH_APPS, PULL_APPS, POLICY } from "../../../constants/ActionTypes"

const confirm = Modal.confirm;
var coppyList = [];
var status = true;


class PasswordModal extends Component {
    // console.log('object,', props.actionType)
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showPwdConfirmModal(false, this.props.actionType)
                    this.refs.pswdForm.resetFields()
                }
                }
                okText="Push Apps"
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    actionType={this.props.actionType}
                    handleCancel={this.props.showPwdConfirmModal}
                    ref='pswdForm'
                />
            </Modal >
        )
    }
}

class DealerAppModal extends Component {
    // const PullAppModal = (props) => {

    constructor(props) {
        super(props)
    }

    render() {
        // const DealerAppModal = (props) => {
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                style={{ top: 20 }}
                width="780px"
                title={
                    <div className="pp_popup">Select Apps
                <Input.Search
                            name="push_apps"
                            key="push_apps"
                            id="push_apps"
                            className="search_heading1"
                            onKeyUp={
                                (e) => {
                                    this.props.handleComponentSearch(e.target.value, 'push_apps')
                                }
                            }
                            autoComplete="new-password"
                            placeholder="Search Apps"
                        />
                        <br /> Device ID: {this.props.device.device_id}
                    </div>}
                visible={this.props.pushAppsModal}
                onOk={() => {
                    if (this.props.selectedApps.length) {
                        this.props.showPushAppsModal(false);
                        this.props.showSelectedAppsModal(true);
                    }
                }}
                onCancel={() => { this.props.showPushAppsModal(false); this.props.resetSeletedRows() }}
                okText="Push Apps"
            >
                <DealerApps
                    apk_list={this.props.apk_list}
                    onSelectChange={this.props.onSelectChange}
                    isSwitchable={true}
                    selectedApps={this.props.selectedApps}
                    selectedAppKeys={this.props.selectedAppKeys}
                    handleChecked={this.props.handleChecked}
                />
            </Modal>
        )
    }
}

class PullAppModal extends Component {
    // const PullAppModal = (props) => {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                style={{ top: 20 }}
                width="650px"
                title={
                    <div className="pp_popup">Select Apps
                    <Input.Search
                            name="pull_apps"
                            key="pull_apps"
                            id="pull_apps"
                            className="search_heading1"
                            onKeyUp={
                                (e) => {
                                    this.props.handleComponentSearch(e.target.value, 'pull_apps')
                                }
                            }
                            autoComplete="new-password"
                            placeholder="Search Apps"
                        />
                        <br /> Device ID: {this.props.device.device_id} </div>}
                visible={this.props.pullAppsModal}
                onOk={() => {
                    if (this.props.selectedApps.length) {
                        this.props.showPullAppsModal(false);
                        this.props.showSelectedAppsModal(true);
                    }
                }}
                onCancel={() => { this.props.showPullAppsModal(false); this.props.resetSeletedRows(); }}
                okText="Pull Apps"
            >
                <DealerApps
                    apk_list={this.props.apk_list}
                    onSelectChange={this.props.onSelectChange}
                    isSwitchable={true}
                    selectedApps={this.props.selectedApps}
                    selectedAppKeys={this.props.selectedAppKeys}
                    handleChecked={this.props.handleChecked}
                    type={this.props.actionType == PUSH_APPS ? "push" : 'pull'}
                />
            </Modal>
        )
    }
}


const SelectedApps = (props) => {
    console.log('selected app are', props.selectedApps)
    return (
        <Modal
            // closable={false}
            maskClosable={false}
            style={{ top: 20 }}
            width="650px"
            title={<div>Selected Apps <br /> Device ID: {props.device.device_id} </div>}
            visible={props.selectedAppsModal}
            onOk={() => {
                props.actionType == PUSH_APPS ? props.applyPushApps(props.apk_list) : props.applyPullApps(props.apk_list);
                props.showSelectedAppsModal(false);
                props.resetSeletedRows()
            }}
            onCancel={() => { props.showSelectedAppsModal(false); props.resetSeletedRows() }}
            okText={props.actionType == PUSH_APPS ? "Push Apps" : 'Pull Apps'}
            destroyOnClose={true}
        >
            <DealerApps
                apk_list={props.apk_list}
                isSwitchable={false}
                selectedApps={props.selectedApps}
                type={props.actionType == PUSH_APPS ? "push" : 'pull'}
                disabledSwitch={true}
            />
        </Modal>
    )
}




class SideActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pullAppsModal: false,
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
            actionType: PUSH_APPS,
            selectedApps: [],
            activities: [],
            apk_list: [],
            policyId: '',
            showChangesModal: false,
            applyPolicyConfirm: false,
            isSaveProfileBtn: false
        }
    }

    componentDidMount() {

        this.setState({
            historyModal: this.props.historyModal,
            applyPolicyConfirm: this.props.applyPolicyConfirm,
            saveProfileModal: this.props.saveProfileModal,
            historyType: this.props.historyType,
            saveProfileType: this.props.saveProfileType,
            profileName: this.props.profileName,
            activities: this.props.activities,
            changedCtrls: this.props.changedCtrls,
            isSaveProfileBtn: this.props.isSaveProfileBtn,
            apk_list: this.props.apk_list,
            // selectedApps: this.props.apk_list
        });


    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            //   console.log(nextProps.pullAppsModal, 'reciceve')
            this.setState({
                historyModal: nextProps.historyModal,
                applyPolicyConfirm: nextProps.applyPolicyConfirm,
                saveProfileModal: nextProps.saveProfileModal,
                historyType: nextProps.historyType,
                saveProfileType: nextProps.saveProfileType,
                profileName: nextProps.profileName,
                pullAppsModal: nextProps.pullAppsModal,
                activities: nextProps.activities,
                isSaveProfileBtn: nextProps.isSaveProfileBtn,
                apk_list: nextProps.apk_list,
                // selectedApps: nextProps.apk_list
            })
        }
        if (nextProps.applyPolicyConfirm) {
            showConfirmPolcy(this)
        }
    }

    showHistoryModal = (visible, type) => {
        if (((type !== undefined) || type === "" || type === null) && visible === false) {
            this.props.showHistoryModal(visible);
        } else {
            this.props.showHistoryModal(visible, type);
        }
    }

    showSaveProfileModal = (visible, profileType = '') => {
        this.props.showSaveProfileModal(visible, profileType);
    }

    showPwdConfirmModal = (visible, actionType = PUSH_APPS) => {
        // alert('hello');
        this.setState({
            pwdConfirmModal: visible,
            actionType: actionType,
            selectedApps: JSON.parse(JSON.stringify(this.state.apk_list)),
        })
    }

    showSelectedAppsModal = (visible) => {
        let dumyList = [];
        if (this.state.selectedAppKeys.length && this.state.selectedApps.length) {

            for (let app of this.state.selectedApps) {
                console.log(this.state.selectedAppKeys.includes(app.apk_id), 'checking')
                if (this.state.selectedAppKeys.includes(app.apk_id)) {
                    dumyList.push(app)
                }
            }
        }
        this.setState({
            selectedAppsModal: visible,
            selectedApps: dumyList
        })
    }

    handleChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onInputChange = (e) => {
        this.setState({
            profileName: e.target.value
        })

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

    handleComponentSearch = (value) => {
        // alert('its working', value)
        //    console.log('values sr', value)   
        try {
            console.log(value, 'value')
            if (value.length) {
                console.log(value, 'value')
                if (status) {
                    console.log('status')
                    coppyList = this.state.apk_list;
                    status = false;
                }
                console.log(this.state.apk_list, 'coppy de', coppyList)
                let foundList = componentSearch(coppyList, value);
                console.log('found devics', foundList)
                if (foundList.length) {
                    this.setState({
                        apk_list: foundList,
                    })
                } else {
                    this.setState({
                        apk_list: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    apk_list: coppyList,
                })
            }
        } catch (error) {
            console.log(error, 'error')
        }
    }


    showPushAppsModal = (visible) => {
        if (visible) {
            this.setState({
                pushAppsModal: visible,
                selectedApps: this.state.apk_list
            })
        } else {
            this.setState({
                pushAppsModal: visible
            })
        }
    }

    showPullAppsModal = (visible) => {
        this.setState({
            pullAppsModal: visible,
        })
    }

    onCancelModel = () => {
        this.setState({
            selectedApps: []
        })
    }


    pushApps = () => {

        if (this.state.selectedApps.length) {
            // console.log("save pushed apps", this.state.selectedApps);
        } else {
        }
    }


    onSelectChange = (selectedRowKeys, selectedRows) => {
        let selectedApps = selectedRows;


        // selectedApps.map(el => {
        //     if (typeof (el.guest) !== Boolean) {
        //         el.guest = false
        //     }

        //     if (typeof (el.encrypted) !== Boolean) {
        //         el.encrypted = false
        //     }

        //     if (typeof (el.enable) !== Boolean) {
        //         el.enable = false
        //     }
        // });


        this.setState({
            // selectedApps: selectedApps,
            selectedAppKeys: selectedRowKeys
        })

    }

    handleChecked = (e, key, app_id) => {
        console.log("handlechecked", e, key, app_id);
        this.state.selectedApps.map((el) => {
            if (el.apk_id === app_id) {
                el[key] = e;
            }
        })

        console.log('sate of selected app ', this.state.selectedApps)
    }

    handleFlag(flagged) {
        if (flagged == 'Unflag') {
            showConfirm(this.props.device, this.props.unflagged, this, "Do you really want to unflag the device ", 'flagged')
        } else {
            this.refs.flag_device.showModel(this.props.device, this.props.flagged, this.props.refreshDevice)
        }
    }


    applyHistory = (historyId, name = '', history) => {
        const historyType = this.state.historyType;
        if (historyType === 'history') {

        } else if (historyType === "profile") {
            showConfirmProfile(this, name, history)
        } else if (historyType === POLICY) {

            this.showPwdConfirmModal(true, POLICY)
            this.setState({
                policyId: historyId,
                policyName: name,
                historyModal: false
            })
        }
    }


    applyPushApps = () => {
        this.props.applyPushApps(this.state.selectedApps, this.props.device_id, this.props.usr_acc_id);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
    }


    applyPullApps = () => {
        this.props.applyPullApps(this.state.selectedApps, this.props.device_id, this.props.usr_acc_id);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
    }

    resetSeletedRows = () => {
        // console.log('table ref')
        this.setState({
            selectedAppKeys: [],
            selectedApps: [],
        })
    }

    render() {
        console.log(this.state.apk_list, 'list apk')
        const device_status = (this.props.device.account_status === "suspended") ? "Activate" : "Suspend";
        const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
        const flagged = (this.props.device.flagged !== 'Not flagged') ? 'Unflag' : 'Flag';
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
                                <Button
                                    type="default"
                                    placement="bottom"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showPwdConfirmModal(true, PUSH_APPS)}
                                    disabled={this.props.authUser.type == ADMIN ? false : true}
                                >
                                    <Icon type="lock" className="lock_icon" />
                                    <Icon type='upload' />
                                    Push
                                </Button>

                                <Button
                                    // disabled
                                    type="primary"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showHistoryModal(true, "profile")}
                                >
                                    <Icon type="select" />
                                    Load Profile
                                </Button>
                                <Button
                                    type="primary"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showHistoryModal(true, "policy")}
                                >
                                    <Icon type="select" />
                                    Load Policy
                                </Button>
                                <Button
                                    onClick={() => this.refs.imeiView.showModal(this.props.device)}
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16, background: "#eed9c4", color: "#555", border: "1px solid #eab886" }}
                                >
                                    {/* <Icon type="number" /> */}
                                    IMEI
                                </Button>
                            </Col>
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                {/* <Tooltip placement="bottom" title="Coming Soon"> */}
                                <Button
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showPwdConfirmModal(true, PULL_APPS)}
                                    disabled={this.props.authUser.type == ADMIN ? false : true}
                                >
                                    <Icon type="lock" className="lock_icon" />
                                    <Icon type='download' />
                                    Pull
                                </Button>
                                {/* </Tooltip> */}

                                {(this.props.authUser.type === ADMIN || this.props.authUser.type === DEALER) ?
                                    <Button type="primary " style={{ width: "100%", marginBottom: 15 }}
                                        // disabled={this.state.isSaveProfileBtn ? false : true}
                                        onClick={() => {
                                            // if (this.state.isSaveProfileBtn) {
                                            this.showSaveProfileModal(true, 'profile')
                                            // }
                                            // else {
                                            //     Modal.warning({
                                            //         title: "Please Change some setting to save Profile"
                                            //     })
                                            // }
                                            // this.setState({ showChangesModal: true })
                                        }} >
                                        <Icon type="save" style={{ fontSize: "14px" }} /> Save Profile
                                        </Button>
                                    : null}
                                <Button
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.refs.activity.showModal()}
                                >
                                    Activity
                                </Button>
                                <Tooltip placement="left" title="Coming Soon">
                                    <Button
                                        type="default"
                                        style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                    >
                                        <Icon type="file" />
                                        SIM
                                </Button>
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
                                <Button
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#1b1b1b', color: '#fff' }}
                                    onClick={() => this.handleFlag(flagged)}
                                >
                                    <Icon type="flag" />{flagged}
                                </Button>
                                <Button
                                    onClick={() => showConfirm(this.props.device, this.props.unlinkDevice, this, "Do you really want to unlink the device ", 'unlink')}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} >
                                    <Icon type='disconnect' />Unlink</Button>
                                <Button
                                    onClick={() => this.refs.edit_device.showModal(this.props.device, this.props.editDevice)}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                >
                                    <Icon type='edit' />
                                    Edit
                                </Button>
                            </Col>
                            <Tooltip title="Coming Soon" placement="bottom" >
                                <Button
                                    type="default"
                                    style={{ width: "46%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }}
                                >
                                    <Icon
                                        type="lock"
                                        className="lock_icon"
                                    />
                                    <Icon
                                        type="poweroff"
                                        style={{ color: 'yellow', fontSize: '16px', verticalAlign: 'text-top' }}
                                    />
                                </Button>
                            </Tooltip>
                        </Row>
                    </Card>
                </div>
                <Modal
                    title={<div>{this.state.historyType}  <br /> Device ID:  {this.props.device.device_id} </div>}
                    maskClosable={false}
                    style={{ top: 20 }}
                    visible={this.state.historyModal}
                    onOk={() => this.showHistoryModal(false, '')}
                    onCancel={() => this.showHistoryModal(false, '')}
                    className="load_policy_popup"
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

                <Modal
                    maskClosable={false}
                    title="Confirm new Settings to be sent to Device"
                    visible={this.state.showChangesModal}
                    onOk={() => {
                        this.showSaveProfileModal(true, 'profile')
                        this.setState({ showChangesModal: false })
                    }}
                    onCancel={() => this.setState({ showChangesModal: false })}
                    okText='Apply'
                >
                    <DeviceSettings
                        app_list={this.props.app_list}
                        extensions={this.props.extensions}
                        extensionUniqueName={SECURE_SETTING}
                        isAdminPwd={this.props.isAdminPwd}
                        isDuressPwd={this.props.isDuressPwd}
                        isEncryptedPwd={this.props.isEncryptedPwd}
                        isGuestPwd={this.props.isGuestPwd}
                        controls={{ 'controls': this.state.changedCtrls }}
                        showChangedControls={true}
                    />
                </Modal>
                {/* title={this.state.profileType[0] + this.state.profileType.substring(1,this.state.profileType.length).toLowerCase()} */}
                <Modal
                    closable={false}
                    maskClosable={false}
                    style={{ top: 20 }}

                    visible={this.state.saveProfileModal}
                    onOk={() => {
                        this.setState({ profileName: '' })
                        this.saveProfile();
                    }}
                    onCancel={() => { this.setState({ profileName: '' }); this.showSaveProfileModal(false) }}
                    okText='Save'
                >
                    <Input placeholder={`Enter ${this.state.saveProfileType} name`} required onChange={(e) => { this.onInputChange(e) }} value={this.state.profileName} />
                </Modal>

                <DealerAppModal
                    pushAppsModal={this.props.pushAppsModal}
                    showPushAppsModal={this.props.showPushAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    apk_list={this.state.apk_list}
                    onSelectChange={this.onSelectChange}
                    selectedAppKeys={this.state.selectedAppKeys}
                    showSelectedAppsModal={this.showSelectedAppsModal}
                    resetSeletedRows={this.resetSeletedRows}
                    selectedApps={this.state.selectedApps}
                    handleChecked={this.handleChecked}
                    device={this.props.device}
                />

                <PullAppModal
                    pullAppsModal={this.state.pullAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    apk_list={this.state.apk_list}
                    onSelectChange={this.onSelectChange}
                    showSelectedAppsModal={this.showSelectedAppsModal}
                    selectedApps={this.state.selectedApps}
                    selectedAppKeys={this.state.selectedAppKeys}
                    resetSeletedRows={this.resetSeletedRows}
                    handleChecked={this.handleChecked}
                    onCancelModel={this.onCancelModel}
                    device={this.props.device}
                />

                <PasswordModal
                    pwdConfirmModal={this.state.pwdConfirmModal}
                    showPwdConfirmModal={this.showPwdConfirmModal}
                    checkPass={this.props.checkPass}
                    actionType={this.state.actionType}
                />

                <SelectedApps
                    selectedAppsModal={this.state.selectedAppsModal}
                    showSelectedAppsModal={this.showSelectedAppsModal}
                    applyPushApps={this.applyPushApps}
                    apk_list={this.state.selectedApps}
                    selectedApps={this.state.selectedApps}
                    resetSeletedRows={this.resetSeletedRows}
                    applyPullApps={this.applyPullApps}
                    actionType={this.state.actionType}
                    device={this.props.device}
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
                    device={this.props.device}
                />
                <ImeiView
                    ref='imeiView'
                    device={this.props.device}
                    imei_list={this.props.imei_list}
                    writeImei={this.props.writeImei}
                />

                <Activity
                    ref='activity'
                    activities={this.state.activities}
                    device={this.props.device}

                />
            </div >
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
        showPullAppsModal: showPullAppsModal,
        applyPushApps: applyPushApps,
        applyPullApps: applyPullApps,
        savePolicy: savePolicy,
        writeImei: writeImei,
        getActivities: getActivities,
        hidePolicyConfirm: hidePolicyConfirm,
        applyPolicy: applyPolicy,
        applySetting: applySetting,
    }, dispatch);
}
var mapStateToProps = ({ device_details, auth }, otherProps) => {

    return {
        authUser: auth.authUser,
        historyModal: device_details.historyModal,
        applyPolicyConfirm: device_details.applyPolicyConfirm,
        saveProfileModal: device_details.saveProfileModal,
        historyType: device_details.historyType,
        pushAppsModal: device_details.pushAppsModal,
        pullAppsModal: device_details.pullAppsModal,
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
        changedCtrls: device_details.changedCtrls,
        extensions: device_details.extensions,
        activities: device_details.activities,
        isSaveProfileBtn: device_details.isSaveProfileBtn
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
function showConfirmPolcy(_this) {
    confirm({
        title: "Do you want to apply #" + _this.state.policyName + " policy on device?",
        onOk() {
            _this.props.applyPolicy(_this.props.device.device_id, _this.props.device.id, _this.state.policyId)
        },
        onCancel() {
            _this.props.hidePolicyConfirm()
        },
    });
}
function showConfirmProfile(_this, name, profile) {
    confirm({
        title: "Do you want to apply " + name + " profile on device?",
        onOk() {
            _this.props.applySetting(profile.app_list, profile.passwords, profile.secure_apps, profile.controls, _this.props.device.device_id, _this.props.device.id, 'profile', name)
            _this.props.refreshDevice(_this.props.device.device_id, true)
            _this.props.showHistoryModal(false);
        },
        onCancel() {
        },
    });
}