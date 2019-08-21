import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckApp,
    handleCheckAll
} from "../../../appRedux/actions/ConnectDevice";

import { BASE_URL } from '../../../constants/Application';

import { Table, Switch, Avatar, Row, Col, Button, Modal } from "antd";
import AppDropdown from "./AppDropdown";
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { convertToLang } from '../../utils/commonUtils';
import { Button_LoadProfile, Button_On, Button_Off } from '../../../constants/ButtonConstants';
import { appsColumns } from '../../utils/columnsUtils';
import AppList from './AppList';


class ListSpaceApps extends Component {
    constructor(props) {
        super(props);

        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false,
            app_list: [],
            rerender: false,
            app_list_count: 0,
            permissionModal: false
        }

        this.appsColumns = appsColumns(props.translation);
    }

    componentDidMount() {

        this.setState({
            app_list: this.props.app_list,
            app_list_count: this.props.length,
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log("app list, nextProps", nextProps);
        // alert("componentWillReceiveProps");
        this.setState({
            app_list: nextProps.app_list,
            // app_list_count: this.props.length,
            guestAll: nextProps.guestAll,
            encryptedAll: nextProps.encryptedAll,
            enableAll: nextProps.enableAll
        })

        if (this.props.translation != nextProps.translation) {
            this.appsColumns = appsColumns(nextProps.translation);
        }
    }

    handleCheckedAll = (key, value) => {

        if (key === "guestAll") {
            this.checkAll(key, 'guest', value);
        } else if (key === "encryptedAll") {
            this.checkAll(key, 'encrypted', value);
        } else if (key === "enableAll") {
            this.checkAll(key, 'enable', value);
        }
    }

    handleChecked = (e, key, app_id) => {
        this.props.handleCheckApp(e, key, app_id);

    }

    checkAll = (keyAll, key, value) => {
        this.props.handleCheckAll(keyAll, key, value);
    }

    onCancel = () => {
        this.setState({
            permissionModal: false
        })
    }
    showPermissionModal = () => {
        this.setState({
            permissionModal: true
        })
    }


    render() {
        let space_name = this.props.type === "guest" ? "GUEST" : "ENCRYPT"
        return (
            <div>
                <div style={{ textAlign: "center", margin: 10 }}>
                    <Button size="small" onClick={() => { this.showPermissionModal() }}>{convertToLang(this.props.translation[""], `CHANGE ${space_name} PERMISSIONS`)} </Button>
                </div>

                <div style={{ margin: 10, height: 300, width: 280, overflow: 'overlay' }}>
                    <Row>
                        {this.state.app_list.map(app => {
                            if (this.props.type === "guest") {
                                if (app.guest === true || app.guest === 1) {
                                    return (
                                        <Col span={6} style={{ marginBottom: 10, textAlign: "center" }}>
                                            <Avatar
                                                size={"small"}
                                                src={`${BASE_URL}users/getFile/${app.icon}`}
                                            // style={{ width: "30px", height: "30px" }} 
                                            />
                                            <br />
                                            <div className="line_break1" style={{ fontSize: 10 }}>{app.label}</div>
                                            <div className="line_break1" style={{ fontSize: 10 }}>{(app.enable === true || app.enable === 1) ? "" : "(Disabled)"}</div>
                                        </Col>
                                    );
                                }
                            } else {
                                if (app.encrypted === true || app.encrypted === 1) {
                                    return (
                                        <Col span={6} style={{ marginBottom: 10, textAlign: "center" }}>
                                            <Avatar
                                                size={"small"}
                                                src={`${BASE_URL}users/getFile/${app.icon}`}
                                            // style={{ width: "30px", height: "30px" }} 
                                            />
                                            <br />
                                            <div className="line_break1" style={{ fontSize: 10 }}>{app.label}</div>
                                            <div className="line_break1" style={{ fontSize: 10, color: 'red' }}>{(app.enable === true || app.enable === 1) ? "" : "(Disabled)"}</div>
                                        </Col>
                                    );
                                }
                            }
                        })}

                        {this.props.type === "encrypted" ?
                            (this.props.extension.encrypted === true || this.props.extension.encrypted === 1) ?
                                <Col span={6} style={{ marginBottom: 10, textAlign: "center" }}>
                                    <Avatar
                                        size={"small"}
                                        src={require("assets/images/setting.png")}
                                    // style={{ width: "30px", height: "30px" }} 
                                    />
                                    <br />
                                    <div className="line_break1" style={{ fontSize: 10 }}>{this.props.extension.label}</div>
                                    <div className="line_break1" style={{ fontSize: 10, color: 'red' }}>{(this.props.extension.enable === true || this.props.extension.enable === 1) ? "" : "(Disabled)"}</div>
                                </Col> : null
                            :
                            (this.props.extension.guest === true || this.props.extension.guest === 1) ?
                                <Col span={6} style={{ marginBottom: 10, textAlign: "center" }}>
                                    <Avatar
                                        size={"small"}
                                        src={require("assets/images/setting.png")}
                                    // style={{ width: "30px", height: "30px" }} 
                                    />
                                    <br />
                                    <div className="line_break1" style={{ fontSize: 10 }}>{this.props.extension.label}</div>
                                    <div className="line_break1" style={{ fontSize: 10, color: 'red' }}>{(this.props.extension.enable === true || this.props.extension.enable === 1) ? "" : "(Disabled)"}</div>
                                </Col> : null
                        }
                    </Row>
                </div>
                <Modal
                    maskClosable={false}
                    title={convertToLang(this.props.translation[""], `CHANGE ${space_name} PERMISSIONS`)}
                    visible={this.state.permissionModal}
                    onCancel={this.onCancel}
                    onOk={this.onCancel}
                >
                    <AppList
                        type={this.props.type}
                    />
                </Modal>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // showHistoryModal: showHistoryModal
        handleCheckApp: handleCheckApp,
        handleCheckAll: handleCheckAll
    }, dispatch);
}


var mapStateToProps = ({ device_details, settings }, ownProps) => {
    let extension = device_details.extensions.find(o => o.uniqueName === 'com.secureSetting.SecureSettingsMainSecure Settings');
    // console.log(extension);
    if (ownProps.isHistory !== undefined && ownProps.isHistory === true) {
        return {
            app_list: ownProps.app_list,
            isHistory: ownProps.isHistory
        }

    } else {
        return {
            translation: settings.translation,
            app_list: device_details.app_list,
            undoApps: device_details.undoApps,
            redoApps: device_details.redoApps,
            checked_app_id: device_details.checked_app_id,
            guestAll: device_details.guestAll,
            encryptedAll: device_details.encryptedAll,
            enableAll: device_details.enableAll,
            extension: extension
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSpaceApps);