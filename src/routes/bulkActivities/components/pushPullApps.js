import React, { Component, Fragment } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, Button, message, Icon, Modal, Input, Tooltip, Progress } from "antd";
// import TableHistory from "./TableHistory";
// import SuspendDevice from '../../devices/components/SuspendDevice';
// import ActivateDevcie from '../../devices/components/ActivateDevice';

import { componentSearch, convertToLang } from '../../utils/commonUtils';
// import EditDevice from '../../devices/components/editDevice';
// import FlagDevice from '../../ConnectDevice/components/flagDevice';
// import WipeDevice from '../../ConnectDevice/components/wipeDevice';
// import ImeiView from '../../ConnectDevice/components/ImeiView';
import DealerApps from "./DealerApps";
// import PasswordForm from './PasswordForm';
// import DeviceSettings from './DeviceSettings';
// import Activity from './Activity';
// import SimSettings from './SimSettings/index';
import PullApps from './PullApps';
// import SimHistory from './SimSettings/SimHistory';
// import NewDevice from '../../../components/NewDevices';


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
    applySetting,
    getProfiles,
    wipe,
    simHistory
} from "../../../appRedux/actions/ConnectDevice";

import { getNewDevicesList } from "../../../appRedux/actions/Common";
import {
    rejectDevice,
    addDevice,
    getSimIDs,
    getChatIDs,
    getPGPEmails
} from '../../../appRedux/actions/Devices';
import {
    getNewCashRequests,
    getUserCredit,
    rejectRequest,
    acceptRequest
} from "../../../appRedux/actions/SideBar";


import {
    ADMIN, DEALER, SDEALER, SECURE_SETTING, PUSH_APP, PUSH_APP_TEXT, PULL_APPS_TEXT, PUSH, PULL, Profile_Info, SAVE_PROFILE_TEXT, PUSH_APPS_TEXT, SELECTED_APPS, SELECT_APPS, PROCEED_WITH_WIPING_THE_DEVICE, Name, SEARCH_APPS, WARNING
} from "../../../constants/Constants";


import { PUSH_APPS, PULL_APPS, POLICY, PROFILE } from "../../../constants/ActionTypes"
import { Button_Push, Button_LoadProfile, Button_LoadPolicy, Button_IMEI, Button_Pull, Button_SaveProfile, Button_Activity, Button_SIM, Button_Transfer, Button_WipeDevice, Button_Unlink, Button_Edit, Button_Suspend, Button_Unsuspend, Button_Flag, Button_UNFLAG, Button_Save, Button_Cancel, Button_Ok, Button_Apply, Button_Back, Button_Yes, Button_No } from '../../../constants/ButtonConstants';
import {
    DEVICE_ID,
    SETTINGS_TO_BE_SENT_TO_DEVICE,
    ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE,
    WIPE_DEVICE_DESCRIPTION,
    DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE,
    DO_YOU_WANT_TO_APPLY,
    POLICY_ON_DEVICE,
    ENTER,
    DO_YOU_REALLY_WANT_TO_WIPE_THE_DEVICE,
    ARE_YOU_SURE_YOU_WANT_UNLINK_THE_DEVICE,
    SIM_SETTINGS,
    SIM_HISTORY,
} from "../../../constants/DeviceConstants";

// import TransferHistory from './TransferModule/TransferHistory'

const confirm = Modal.confirm;
var coppyList = [];
var status = true;



const PushAppsModal = (props) => {
    return (
        <Modal
            maskClosable={false}
            destroyOnClose={true}
            style={{ top: 20 }}
            width="780px"
            title={
                <div className="pp_popup">{convertToLang(props.translation[SELECT_APPS], "Select Apps ")}
                    <Input.Search
                        name="push_apps"
                        key="push_apps"
                        id="push_apps"
                        className="search_heading1"
                        onKeyUp={
                            (e) => {
                                props.handleComponentSearch(e.target.value, 'push_apps')
                            }
                        }
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[SEARCH_APPS], "Search Apps")}
                    />
                    {/* <br />{`${convertToLang(props.translation[DEVICE_ID], "DEVICE ID")}:`}  {props.device.device_id} */}
                </div>}
            visible={props.pushAppsModal}
            onOk={() => {
                if (props.selectedPushAppKeys.length) {
                    props.showPushAppsModal(false);
                    props.showSelectedPushAppsModal(true);
                }
            }}
            onCancel={() => { props.showPushAppsModal(false); props.resetSeletedRows() }}
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "PUSH APP")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        >
            <DealerApps
                apk_list={props.apk_list}
                app_list={props.app_list}
                onPushAppsSelection={props.onPushAppsSelection}
                isSwitchable={true}
                selectedApps={props.selectedPushApps}
                selectedAppKeys={props.selectedPushAppKeys}
                handleChecked={props.handleChecked}
                translation={props.translation}
            // disabledSwitch = {false}
            />
        </Modal>
    )
}

const SelectedPushApps = (props) => {

    return (
        <Modal
            maskClosable={false}
            style={{ top: 20 }}
            width="650px"
            title={
                <div>
                    {convertToLang(props.translation[SELECTED_APPS], "Selected Apps ")}
                    {/* <br /> */}
                    {/* {convertToLang(props.translation[DEVICE_ID], "DEVICE ID: ")} */}
                    {/* {props.device.device_id} */}
                </div>
            }
            visible={props.selectedAppsModal}
            onOk={() => {
                props.applyPushApps(props.apk_list);
                props.showSelectedPushAppsModal(false);
                props.showPushAppsModal(false)
                props.showPullAppsModal(false)
                props.resetSeletedRows()
            }}
            // onCancel={() => { props.showSelectedAppsModal(false); props.resetSeletedRows() }}
            onCancel={() => {
                props.actionType == PUSH_APPS ? props.showPushAppsModal(true) : props.showPullAppsModal(true);
                props.showSelectedPushAppsModal(false);
            }}
            // cancelText='Back'
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "PUSH APP")}
            destroyOnClose={true}
        >
            <DealerApps
                apk_list={props.apk_list}
                isSwitchable={false}
                selectedApps={props.selectedPushApps}
                type='push'
                // buttonText={props.actionType == PUSH_APPS ? convertToLang(props.translation[PUSH], PUSH) : convertToLang(props.translation[PULL], PULL)}
                disabledSwitch={true}
                translation={props.translation}
            />
        </Modal>
    )
}

const PullAppsModal = (props) => {
    // onPullAppsSelection

    return (
        <Modal
            maskClosable={false}
            destroyOnClose={true}
            style={{ top: 20 }}
            width="650px"
            title={
                <div className="pp_popup">{convertToLang(props.translation[SELECT_APPS], "Select Apps")}
                    <Input.Search
                        name="pull_apps"
                        key="pull_apps"
                        id="pull_apps"
                        className="search_heading1"
                        onKeyUp={
                            (e) => {
                                // props.handleComponentSearch(e.target.value, 'pull_apps')
                            }
                        }
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[SEARCH_APPS], "Search Apps")}
                    />
                    {/* <br />
                    {`${convertToLang(props.translation[DEVICE_ID], "DEVICE ID")}:`} {props.device.device_id} */}
                </div>
            }
            visible={props.pullAppsModal}
            onOk={() => {
                if (props.selectedPullAppKeys && props.selectedPullAppKeys.length) {
                    props.showPullAppsModal(false);
                    props.showSelectedPullAppsModal(true);
                }
            }}
            onCancel={() => { props.showPullAppsModal(false); props.resetSeletedRows(); }}
            // okText="Pull Apps"
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "PULL APP")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        >
            <PullApps
                app_list={props.app_list}
                onPullAppsSelection={props.onPullAppsSelection}
                isSwitchable={true}
                selectedPullApps={props.selectedPullApps}
                selectedPullAppKeys={props.selectedPullAppKeys}
                translation={props.translation}

            />
        </Modal>
    )

}


const SelectedPullApps = (props) => {
    // console.log("SelectedPullApps ", props)
    return (
        <Modal
            maskClosable={false}
            style={{ top: 20 }}
            width="650px"
            title={<div>{convertToLang(props.translation[SELECTED_APPS], "Selected Apps ")}
                {/* <br /> {convertToLang(props.translation[DEVICE_ID], "DEVICE ID: ")} {props.device.device_id}  */}
            </div>}
            visible={props.selectedPullAppsModal}
            onOk={() => {
                props.applyPullApps(props.app_list);
                props.showSelectedPullAppsModal(false);
                props.showPushAppsModal(false)
                props.showPullAppsModal(false)
                props.resetSeletedRows()
            }}
            onCancel={() => {
                props.showPushAppsModal(true);
                props.showSelectedPullAppsModal(false);
            }}
            // cancelText='Back'
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "PULL APPS")}
            destroyOnClose={true}
        >
            <PullApps
                app_list={props.app_list}

                isSwitchable={false}
                selectedPullApps={props.selectedPullApps}
                type='pull'
                translation={props.translation}

            />
        </Modal>
    )
}


export default class PushPullApps extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSimModal: false,
            pullAppsModal: false,
            pushAppsModal: false,
            historyModal: false,
            saveProfileModal: false,
            pwdConfirmModal: false,
            historyType: "history",
            saveProfileType: '',
            profileName: '',
            policyName: '',
            disabled: false,
            actionType: PUSH_APPS,

            apk_list: [],

            selectedPushAppsModal: false,
            selectedPushAppKeys: [],
            pushApps: [],
            selectedPushApps: [],

            selectedPullAppsModal: false,
            selectedPullAppKeys: [],
            pullApps: [],
            selectedPullApps: [],

            activities: [],

            policyId: '',
            showChangesModal: false,
            applyPolicyConfirm: false,
            isSaveProfileBtn: false,
            transferHistoryModal: false,
            DEVICE_TRANSFERED_DONE: 'not transfer',

        }
        this.otpModalRef = React.createRef();
    }

    onPushAppsSelection = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedPushApps: selectedRows,
            selectedPushAppKeys: selectedRowKeys
        })

    }

    onPullAppsSelection = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedPullApps: selectedRows,
            selectedPullAppKeys: selectedRowKeys
        })
    }

    handleChecked = (e, key, app_id) => {
        this.state.selectedPushApps.map((el) => {
            if (el.apk_id === app_id) {
                el[key] = e;
            }
        })
    }

    resetSeletedRows = () => {
        // console.log('table ref')
        this.setState({
            selectedPushAppKeys: [],
            selectedPullAppKeys: [],
            selectedPushApps: [],
            selectedPullApps: [],
            apk_list: this.props.apk_list
        })
    }

    showSelectedPushAppsModal = (visible) => {
        let dumyList = [];
        if (this.state.selectedPushAppKeys.length && this.state.selectedPushApps.length) {

            for (let app of this.state.selectedPushApps) {
                if (this.state.selectedPushAppKeys.includes(app.apk_id)) {
                    dumyList.push(app)
                }
            }
        }
        this.setState({
            selectedPushAppsModal: visible,
            pushApps: dumyList
        })
    }

    showSelectedPullAppsModal = (visible) => {

        let dumyList = [];
        if (this.state.selectedPullAppKeys.length && this.state.selectedPullApps.length) {
            for (let app of this.state.selectedPullApps) {
                // console.log(app)
                if (this.state.selectedPullAppKeys.includes(app.app_id)) {
                    dumyList.push(app)
                }
            }
        }
        // console.log("dumyList ", dumyList)
        this.setState({
            selectedPullAppsModal: visible,
            pullApps: dumyList
        })
    }

    handleComponentSearch = (value, labelApps) => {
        try {
            // console.log(value, 'value')
            if (value.length) {
                // console.log(value, 'value')
                if (status) {
                    // console.log('status')
                    coppyList = this.state.apk_list;
                    status = false;
                }
                // console.log(this.state.apk_list, 'coppy de', coppyList)
                let foundList = componentSearch(coppyList, value);
                // console.log('found devics', foundList)
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
        }
    }


    componentWillReceiveProps(nextProps) {
        // console.log('hi')

        this.setState({
            apk_list: nextProps.apk_list
        })
    }

    applyPushApps = (apps) => {
        // console.log("applyPushApps ", this.state.pushApps, this.props.device_id, this.props.usr_acc_id)

        // this.props.applyPushApps(this.state.pushApps, this.props.device_id, this.props.usr_acc_id);
        this.props.setBulkPushApps(this.state.pushApps);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
        // this.props.getActivities(this.props.device_id)
    }


    applyPullApps = () => {
        // this.props.applyPullApps(this.state.pullApps, this.props.device_id, this.props.usr_acc_id);
        this.props.setBulkPullApps(this.state.pullApps);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
        // this.props.getActivities(this.props.device_id)
    }

    render() {
        // console.log("this.props.apk_list ", this.props.apk_list)
        return (
            <div>
                <PushAppsModal
                    pushAppsModal={this.props.pushAppsModal}
                    showPushAppsModal={this.props.showPushAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    apk_list={this.state.apk_list}
                    // app list props is added because push apps will not show installed apps again to push
                    app_list={this.props.app_list}
                    app_list={this.props.app_list}
                    onPushAppsSelection={this.onPushAppsSelection}
                    selectedPushAppKeys={this.state.selectedPushAppKeys}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    resetSeletedRows={this.resetSeletedRows}
                    selectedPushApps={this.state.selectedPushApps}
                    handleChecked={this.handleChecked}
                    device={this.props.device}
                    translation={this.props.translation}
                />

                <PullAppsModal
                    pullAppsModal={this.props.pullAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    // app_list={this.props.app_list}
                    app_list={this.state.apk_list}
                    onPullAppsSelection={this.onPullAppsSelection}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    selectedPullApps={this.state.selectedPullApps}
                    selectedPullAppKeys={this.state.selectedPullAppKeys}
                    resetSeletedRows={this.resetSeletedRows}
                    onCancelModel={this.onCancelModel}
                    device={this.props.device}
                    translation={this.props.translation}
                />



                <SelectedPushApps
                    selectedAppsModal={this.state.selectedPushAppsModal}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    apk_list={this.state.pushApps}
                    selectedPushApps={this.state.selectedPushApps}
                    resetSeletedRows={this.resetSeletedRows}
                    applyPushApps={this.applyPushApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                />

                <SelectedPullApps
                    selectedPullAppsModal={this.state.selectedPullAppsModal}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    app_list={this.state.pullApps}
                    selectedPullApps={this.state.selectedPullApps}
                    resetSeletedRows={this.resetSeletedRows}
                    applyPullApps={this.applyPullApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                />
            </div>
        )
    }
}