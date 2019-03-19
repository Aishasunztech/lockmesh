import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message } from "antd";
import CircularProgress from "components/CircularProgress/index";
import { editDevice } from "../../appRedux/actions/Devices";

import {
    getDeviceDetails,
    getDeviceApps,
    getProfiles,
    getDeviceHistories,
    saveDeviceProfile,
    loadDeviceProfile,
    pushApps,
    undoApps,
    redoApps,
    applySetting,
    startLoading,
    endLoading,
    // showMessage,
    unlinkDevice,
    changePage,
    activateDevice2,
    suspendDevice2
} from "../../appRedux/actions/ConnectDevice";
import {getDevicesList} from '../../appRedux/actions/Devices';
import imgUrl from '../../assets/images/mobile.png';
import styles from './ConnectDevice.css';
// import { BASE_URL } from '../../constants/Application';

import DeviceActions from './components/DeviceActions';
import DeviceSidebar from './components/DeviceSidebar';
import SideActions from './components/SideActions';
import AppList from './components/AppList';
import Password from "./components/Password"

class ConnectDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            device_id: '',
            pageName: "main_menu",
            // apply: true,
            // undo: true,
            // redo: true,
            // clear: false,
            // syncStatus: false
        }
        // console.log("hello every body", this.props);
        this.mainMenu = [
            {
                pageName: "apps",
                value: 'Set Apps & Permissions'
            },
            {
                pageName: "guest_password",
                value: 'Set Guest Password'
            },
            {
                pageName: "encrypted_password",
                value: 'Set Encrypted Password'
            },
            {
                pageName: "duress_password",
                value: 'Set Duress Password'
            },
            // {
            //     pageName: "settings",
            //     value: 'Setting Menu'
            // },
            {
                pageName: "admin_password",
                value: 'Change Admin Panel Code'
            }
        ]
    }
    changePage = (pageName) => {
        this.props.changePage(pageName);

    }
    onBackHandler = () => {
        this.props.changePage("main_menu");

    }
    componentDidMount() {
        this.props.startLoading();

        this.setState({
            pageName: this.props.pageName,
            device_id: this.props.match.params.device_id
        });

        const device_id = this.props.match.params.device_id;
        if (device_id !== '') {

            this.props.getDeviceDetails(device_id);
            this.props.getDeviceApps(device_id);
            this.props.getProfiles();
            this.props.getDeviceHistories(device_id);
            // this.setState({
            //     syncStatus: this.props.device_details.is_sync
            // })
        }
        // this.props.endLoading();
        setTimeout(() => {
            this.props.endLoading();
        }, 2000);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.pathName !== nextProps.pathName) {
            // alert("hello");
            // alert("hello");
            // this.setState({
            //     pageName: nextProps.pageName
            // });

            // nextProps.showMessage(false);

            // this.setState({
            //     device_id: nextProps.match.params.device_id
            // });
            // const device_id = nextProps.match.params.device_id;
            // if (device_id != '') {

            //     nextProps.getDeviceDetails(device_id);
            //     nextProps.getDeviceApps(device_id);
            //     nextProps.getProfiles();
            //     nextProps.getDeviceHistories(device_id);
            //     this.setState({
            //         syncStatus: this.props.device_details.is_sync
            //     })
            // }
            // this.props.endLoading();
            // setTimeout(() => {
            //     this.props.endLoading();
            // }, 2000);
        }
    }

    renderScreen = () => {
        if (this.props.pageName === "main_menu" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (
                <List
                    className="dev_main_menu"
                    size="small"
                    dataSource={this.mainMenu}
                    renderItem={item => {
                        return (<List.Item
                            onClick={() => {

                                this.changePage(item.pageName)
                            }}
                        ><a>{item.value}</a></List.Item>)
                    }}
                />
            );
        } else if (this.props.pageName === "apps" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (
                <AppList
                    app_list={this.props.app_list}
                    // pushApps={this.props.pushApps}
                    undoApps={this.props.undoApps}
                />
            );
        } else if (this.props.pageName === "guest_password" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (<Password pwdType={this.state.pageName} />);
        } else if (this.props.pageName === "encrypted_password" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (<Password pwdType={this.state.pageName} />);
        } else if (this.props.pageName === "duress_password" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (<Password pwdType={this.state.pageName} />);
        } else if (this.props.pageName === "admin_password" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (<Password pwdType={this.state.pageName} />);
        } else if (this.props.pageName === "settings" && (this.props.isSync === 1 || this.props.isSync === true)) {
            return (<Password pwdType={this.state.pageName} />);
        } else if(this.props.pageName === "not_available"){
            return (<div><h1 className="not_syn_txt"><a>Device is {this.props.status}</a></h1></div>);
        }else {
            return (<div><h1 className="not_syn_txt"><a>Device is not Synced</a></h1></div>)
        }
    }

    applyActionButton = () => {
        this.props.applySetting(this.props.app_list,
            {
                adminPwd: this.props.adminPwd,
                guestPwd: this.props.guestPwd,
                encryptedPwd: this.props.encryptedPwd,
                duressPwd: this.props.duressPwd,
            }
            , this.state.device_id);
        // 
    }
    componentWillUnmount() {
        this.onBackHandler();
    }
    refreshDevice = (deviceId) => {
        this.props.startLoading();
        // console.log("refreshDevice", this.props);
        this.props.getDeviceDetails(deviceId);
        this.props.getDeviceApps(deviceId);
        this.props.getProfiles();
        this.props.getDeviceHistories(deviceId);
        this.onBackHandler();
        setTimeout(() => {
            this.props.endLoading();
        }, 2000);
    }

    render() {
        return (
            <div className="gutter-example">
                {this.props.isLoading ?
                    <div className="gx-loader-view">
                        <CircularProgress />
                    </div> : null}

                {this.props.showMessage === true ?
                    (this.props.messageType === "error") ?
                        message.error(this.props.messageText) :
                        (this.props.messageType === "success") ?
                            message.success(this.props.messageText) : null : null}

                <Row gutter={16} type="flex" align="top">
                    <Col className="gutter-row left_bar" xs={24} sm={24} md={24} lg={24} xl={8} span={8}>
                        <DeviceSidebar
                            device_details={this.props.device_details}
                            refreshDevice={this.refreshDevice}
                            startLoading={this.props.startLoading}
                            endLoading={this.props.endLoading}
                        />
                    </Col>
                    <Col className="gutter-row action_group" span={8} xs={24} sm={24} md={24} lg={24} xl={8}>
                        <Card>
                            <div className="gutter-box bordered deviceImg" alt="Mobile Image" style={{ backgroundImage: 'url(' + imgUrl + ')' }}>
                                {this.renderScreen()}
                                <Button.Group className="nav_btn_grp">
                                    <Button type="default" icon="left" className="nav_btn" onClick={() => {
                                        this.onBackHandler();
                                    }} />
                                    <Button type="default" className="nav_btn" />
                                    <Button type="default" icon="border" className="nav_btn" />
                                </Button.Group>

                            </div>
                            <DeviceActions
                                // apply={this.state.apply}
                                // undo={this.state.undo}
                                // redo={this.state.redo}
                                // clear={this.state.clear}
                                app_list={this.props.app_list}
                                undoApplications={this.props.undoApplications}
                                redoApplications={this.props.redoApplications}
                                applyActionButton={this.applyActionButton}
                            />
                        </Card>
                    </Col>
                    <Col className="gutter-row right_bar" xs={24} sm={24} md={24} lg={24} xl={8}>
                        {/*  */}
                        <SideActions
                            device={this.props.device_details}
                            profiles={this.props.profiles}

                            histories={this.props.histories} 
                            activateDevice={this.props.activateDevice2} 
                            suspendDevice = {this.props.suspendDevice2}
                            editDevice = {this.props.editDevice}
                            unlinkDevice = {this.props.unlinkDevice}
                            history={this.props.history}
                            getDevicesList={this.props.getDevicesList} 
                            refreshDevice={this.refreshDevice}   

                        />

                    </Col>
                </Row>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDeviceDetails: getDeviceDetails,
        getDeviceApps: getDeviceApps,
        getProfiles: getProfiles,
        getDeviceHistories: getDeviceHistories,
        saveDeviceProfile: saveDeviceProfile,
        loadDeviceProfile: loadDeviceProfile,
        pushApps: pushApps,
        startLoading: startLoading,
        endLoading: endLoading,
        undoApplications: undoApps,
        redoApplications: redoApps,
        applySetting: applySetting,
        changePage: changePage,
        suspendDevice2: suspendDevice2,
        activateDevice2: activateDevice2,
        editDevice: editDevice,
        getDevicesList:getDevicesList,


        // showMessage: showMessage,
        unlinkDevice: unlinkDevice,


    }, dispatch);
}
var mapStateToProps = ({ routing, device_details, devices }) => {
    // console.log("connect device state");
    return {
        routing: routing,
        pathName: routing.location.pathname,
        device_details: device_details.device,
        app_list: device_details.app_list,
        undoApps: device_details.undoApps,
        profiles: device_details.profiles,
        histories: device_details.device_histories,
        isLoading: device_details.isLoading,
        showMessage: device_details.showMessage,
        messageType: device_details.messageType,
        messageText: device_details.messageText,
        pageName: device_details.pageName,
        isSync: device_details.device.is_sync,
        guestPwd: device_details.guestPwd,
        guestCPwd: device_details.guestCPwd,
        encryptedPwd: device_details.encryptedPwd,
        encryptedCPwd: device_details.encryptedCPwd,
        duressPwd: device_details.duressPwd,
        duressCPwd: device_details.duressCPwd,
        adminPwd: device_details.adminPwd,
        adminCPwd: device_details.adminCPwd,
        status: device_details.status
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDevice);