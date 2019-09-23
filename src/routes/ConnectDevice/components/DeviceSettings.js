import React, { Component, Fragment } from 'react'
import { Table, Divider, Badge, Switch, Col, Row } from "antd";
import { APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS, PERMISSION_NAME, PUSH_APPS_TEXT, ADMIN, ANDROID_SETTING_PERMISSION, Main_SETTINGS, SECURE_SETTING, SYSTEM_CONTROLS } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';
import { PUSH_APPS } from '../../../constants/ActionTypes';
import { APK_APP_NAME } from '../../../constants/ApkConstants';
import { Guest, ENCRYPTED, ENABLE, EXTENSION_NAME, ADMIN_PASSWORD_IS_CHANGED, ENCRYPTED_PASSWORD_IS_CHANGED, GUEST_PASSWORD_IS_CHANGED, DURESS_PASSWORD_IS_CHANGED, ENCRYPT } from '../../../constants/TabConstants';
import { DEVICE_STATUS } from '../../../constants/DeviceConstants';
import { appsColumns, extensionColumns, controlColumns } from '../../utils/columnsUtils';

export default class DeviceSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appColumns: [],
            applist: [],
            extensions: [],
            controls: {},
            push_apps: []
        }

        this.appsColumns = appsColumns(props.translation);
        this.extensionColumns = extensionColumns(props.translation);
        this.controlColumns = controlColumns(props.translation);
    }

    controlValues = () => {
        console.log(this.state.controls, 'apply setting controls')
        if (this.state.controls.controls && this.state.controls.controls.length > 0) {

            let data = [];
            this.state.controls.controls.map(control => {
                // if(control.isChanged){
                if (this.props.showChangedControls) {
                    if (control.isChanged) {
                        data.push({
                            rowKey: control.setting_name,
                            key: control.setting_name,
                            label: control.setting_name,
                            status: <Switch
                                size="small"
                                value={control.setting_status}
                                checked={(control.setting_status === true || control.setting_status === 1) ? true : false}
                                disabled={true}
                            />,
                        })
                    }
                } else {
                    data.push({
                        rowKey: control.setting_name,
                        key: control.setting_name,
                        label: control.setting_name,
                        status: <Switch
                            size="small"
                            value={control.setting_status}
                            checked={(control.setting_status === true || control.setting_status === 1) ? true : false}
                            disabled={true}
                        />,
                    })
                }
                // }
            })

            return data;
        }
    }

    filterAppList = () => {
        let data = this.props.app_list;
        let applist = [];
        if (this.props.show_all_apps) {
            if (this.props.show_unchanged) {
                for (let obj of data) {
                    if (obj.isChanged !== undefined && obj.isChanged === true) {
                        // if(applist.includes(obj)){
                        // }else{
                        applist.push(obj);
                        // }
                    }
                }
                this.setState({ applist: applist })
            } else {
                this.setState({ applist: data })
            }

        } else {
            for (let obj of data) {
                if (obj.isChanged !== undefined && obj.isChanged === true) {
                    // if(applist.includes(obj)){

                    // }else{
                    applist.push(obj);

                    // }
                }
            }
            this.setState({ applist: applist })
        }

    }



    filterExtensions = () => {
        let data = this.props.extensions;
        let extensions = [];
        if (this.props.show_all_apps) {
            if (this.props.show_unchanged) {
                if (data.length) {

                    for (let item of data) {
                        if (item.isChanged !== undefined && item.isChanged === true) {
                            extensions.push(item);
                        }

                    }
                    this.setState({ extensions: extensions })
                }
            } else {
                this.setState({ extensions: data })
            }

        } else {
            if (data.length) {
                for (let obj of data) {
                    if (obj.uniqueName === this.props.extensionUniqueName) {
                        for (let item of obj.subExtension) {
                            if (item.isChanged !== undefined && item.isChanged === true) {
                                extensions.push(item);
                            }
                        }
                    }
                }
                this.setState({ extensions: extensions })
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {

            this.setState({
                controls: this.props.controls,
                push_apps: this.props.push_apps
            })
            this.filterAppList()
            this.filterExtensions()
        }

        if (this.props.translation != prevProps.translation) {
            this.appsColumns = appsColumns(this.props.translation);
            this.extensionColumns = extensionColumns(this.props.translation);
            this.controlColumns = controlColumns(this.props.translation);
        }
    }

    componentDidMount() {
        this.setState({
            controls: this.props.controls,
            push_apps: this.props.push_apps
        })
        this.filterAppList();
        this.filterExtensions();
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.translation != nextProps.translation) {
            this.appsColumns = appsColumns(nextProps.translation);
            this.extensionColumns = extensionColumns(nextProps.translation);
            this.controlColumns = controlColumns(nextProps.translation);
        }
    }
    renderData = (datalist) => {
        // console.log(JSON.parse(datalist));
        // console.log(this.props.type, 'datalist is type of');
        let data = JSON.parse(JSON.stringify(datalist));

        // if (this.props.type === 'profile') {
        //     data = JSON.parse(JSON.stringify(datalist))
        // }

        if (datalist.length > 0) {
            return data.map((item, index) => {
                return {
                    rowKey: item.app_id,
                    key: index,
                    app_name: item.label === undefined || item.label === 'undefined' ? item.apk_name : item.label,
                    label: item.label === undefined || item.label === 'undefined' ? item.apk_name : item.label,
                    // guest: (item.guest === 1 || item.guest === true) ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>,
                    guest: <Switch
                        size="small"
                        value={item.guest}
                        checked={(item.guest === true || item.guest === 1) ? true : false}
                        disabled={true}
                    />,
                    encrypted: <Switch
                        size="small"
                        value={item.encrypted}
                        checked={(item.encrypted === true || item.encrypted === 1) ? true : false}
                        disabled={true}
                    />,
                    enable: <Switch
                        size="small"
                        value={item.enable}
                        checked={(item.enable === true || item.enable === 1) ? true : false}
                        disabled={true}
                    />,
                }
            })

        }
    }

    renderAppList = (datalist) => {
        let data = JSON.parse(JSON.stringify(datalist));
        let appList = [];
        if (data.length) {

            data.map((item, index) => {
                if (!item.extension && item.visible) {
                    appList.push(
                        {
                            rowKey: item.app_id,
                            key: index,
                            app_name: item.label === undefined || item.label === 'undefined' ? item.apk_name : item.label,
                            label: item.label === undefined || item.label === 'undefined' ? item.apk_name : item.label,
                            guest: <Switch
                                size="small"
                                value={item.guest}
                                checked={(item.guest === true || item.guest === 1) ? true : false}
                                disabled={true}
                            />,
                            encrypted: <Switch
                                size="small"
                                value={item.encrypted}
                                checked={(item.encrypted === true || item.encrypted === 1) ? true : false}
                                disabled={true}
                            />,
                            enable: <Switch
                                size="small"
                                value={item.enable}
                                checked={(item.enable === true || item.enable === 1) ? true : false}
                                disabled={true}
                            />,
                        }
                    );
                }
            })

        }
        return appList;
    }

    render() {
        // console.log("this.props.controls. ischanged", this.props.controls.isChanged)


        // find the length of changed controls. it can be refactored
        let changes = 0;
        if (this.state.controls && Object.entries(this.state.controls).length) {
            if (this.state.controls.controls && this.state.controls.controls.length) {
                this.state.controls.controls.map(item => {

                    if (item.isChanged) {
                        changes++
                    }
                    // console.log(item, "item.isChanged",item.isChanged)
                })
            }
        }

        let objIndex = -1;
        if (this.props.settings && this.props.settings.length) {
            objIndex = this.props.settings.findIndex(item => item.uniqueName === Main_SETTINGS)
        }

        let extenObjIndex = -1;
        if (this.props.extensions && this.props.extensions.length) {
            extenObjIndex = this.props.extensions.findIndex(item => item.uniqueName === SECURE_SETTING)
        }

        // console.log(this.props.extensions, 'check extension  ', this.props.extensions[extenObjIndex].isChanged);

        // console.log("extenObjIndex ", extenObjIndex)
        // console.log("this.props.extensions extenObjIndex ", this.props.extensions[extenObjIndex])

        return (
            <div>

                {/* push apps listing */}
                {
                    this.props.isPushApps === true && this.props.type !== 'profile' ?
                        <div>
                            <Divider > {convertToLang(this.props.translation[PUSH_APPS_TEXT], "PUSH APPS")} </Divider>
                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.appsColumns}
                                align='center'
                                dataSource={this.renderData(this.state.push_apps)}
                                pagination={false}

                            />
                        </div> : null
                }

                {/* applisting */}
                {
                    this.state.applist.length > 0 ?
                        <div>
                            <Divider> {convertToLang(this.props.translation[APPLICATION_PERMISION], "APPLICATION PERMISION")} </Divider>
                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.appsColumns}
                                align='center'
                                dataSource={this.renderAppList(this.state.applist)}
                                pagination={false}

                            />
                        </div> : null
                }

                {/* secure extension for all */}

                {(this.props.extensions && extenObjIndex >= 0) ?
                    (this.props.extensions && this.props.extensions[extenObjIndex].isChanged) ?
                        <Fragment>
                            <Divider > {convertToLang(this.props.translation[""], "Secure Settings")} </Divider>

                            <Row className="sec_head">
                                <Col span={8}>
                                    <span>{convertToLang(this.props.translation[Guest], "Guest")} </span>
                                    <Switch disabled
                                        checked={this.props.extensions[extenObjIndex].guest === 1 ? true : false}
                                        size="small" />
                                </Col>
                                <Col span={8}>
                                    <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span>
                                    <Switch disabled
                                        checked={this.props.extensions[extenObjIndex].encrypted === 1 ? true : false}
                                        size="small" />
                                </Col>
                                <Col span={8}>
                                    <span>{convertToLang(this.props.translation[ENABLE], "Enable")} </span>
                                    <Switch disabled
                                        checked={this.props.extensions[extenObjIndex].enable === 1 ? true : false}
                                        size="small" />
                                </Col>
                            </Row>
                        </Fragment>
                        : null
                    : null
                }

                {/* secure extensions */}
                {
                    this.state.extensions.length ?
                        <div>
                            <Divider> {convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], "SECURE SETTING PERMISSION")}</Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.extensionColumns}
                                align='center'
                                dataSource={this.renderData(this.state.extensions)}
                                pagination={false}

                            /></div>
                        : null
                }

                {/* System Control setting for all */}
                {
                    (this.props.controls && objIndex >= 0) ?
                        (this.props.auth.authUser.type === ADMIN && this.props.settings && this.props.settings.length && this.props.settings[objIndex].isChanged) ?
                            <Fragment>
                                <Divider > {convertToLang(this.props.translation[ANDROID_SETTING_PERMISSION], "Android Settings")} </Divider>
                                <div className="row width_100 m-0 sec_head1">
                                    <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                                        <span>Guest</span>
                                        <Switch
                                            disabled
                                            checked={this.props.settings[objIndex].guest === 1 || this.props.settings[objIndex].guest === true ? true : false} size="small" />
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                                        <span>Encrypt</span>
                                        <Switch disabled checked={this.props.settings[objIndex].encrypted === 1 || this.props.settings[objIndex].encrypted === true ? true : false} size="small" />
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-4 p-0 text-center">
                                        <span>Enable</span>
                                        <Switch disabled checked={this.props.settings[objIndex].enable === 1 || this.props.settings[objIndex].enable === true ? true : false} size="small" />
                                    </div>
                                </div>
                            </Fragment>
                            : null
                        : null
                }

                {/* controls */}
                {
                    this.props.showChangedControls ?
                        changes > 0 ?
                            Object.entries(this.state.controls).length > 0 ?
                                this.state.controls.controls.length > 0 ?

                                    <div>
                                        {/* {console.log('if', Object.entries(this.state.controls.controls).length > 0)} */}
                                        <Divider> {convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")}</Divider>

                                        <Table
                                            style={{ margin: 0, padding: 0 }}
                                            size='default'
                                            bordered={false}
                                            columns={this.controlColumns}
                                            align='center'
                                            dataSource={this.controlValues()}
                                            pagination={false}

                                        />

                                    </div> : null : null : null
                        : this.props.showChangedControls === undefined ?

                            Object.keys(this.state.controls).length > 0 ?
                                this.state.controls.controls.length > 0 ?
                                    <div>
                                        <Divider> {convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")}</Divider>
                                        <Table
                                            style={{ margin: 0, padding: 0 }}
                                            size='default'
                                            bordered={false}
                                            columns={this.controlColumns}
                                            align='center'
                                            dataSource={this.controlValues()}
                                            pagination={false}

                                        />

                                    </div> : null : null : null
                }

                {(this.props.type === 'profile') ?

                    <div>
                        {
                            this.props.passwords.admin_password || this.props.passwords.guest_password || this.props.passwords.encrypted_password || this.props.passwords.duress_password ?
                                <Divider>{convertToLang(this.props.translation[MANAGE_PASSWORDS], "Manage Password")} </Divider> : false
                        }
                        {
                            this.props.passwords.admin_password ? <div> <Badge status="success" text={convertToLang(this.props.translation[ADMIN_PASSWORD_IS_CHANGED], "Admin Password is changed")} /> </div> : false
                        }
                        {
                            this.props.passwords.encrypted_password ? <div><Badge status="error" text={convertToLang(this.props.translation[ENCRYPTED_PASSWORD_IS_CHANGED], "Encrypted Password is changed")} /> </div> : false
                        }
                        {
                            this.props.passwords.guest_password ? <div><Badge status="processing" text={convertToLang(this.props.translation[GUEST_PASSWORD_IS_CHANGED], "Guest Password is changed")} /></div> : false
                        }
                        {
                            this.props.passwords.duress_password ? <div><Badge status="warning" text={convertToLang(this.props.translation[DURESS_PASSWORD_IS_CHANGED], "Duress Password is changed")} /></div> : false
                        }
                    </div>
                    :
                    <div>
                        {
                            this.props.isAdminPwd || this.props.isEncryptedPwd || this.props.isGuestPwd || this.props.isDuressPwd ?
                                <Divider> {convertToLang(this.props.translation[MANAGE_PASSWORDS], "Manage Password")} </Divider> : false
                        }
                        {
                            this.props.isAdminPwd ? <div> <Badge status="success" text={convertToLang(this.props.translation[ADMIN_PASSWORD_IS_CHANGED], "Admin Password is changed")} /> </div> : false
                        }{
                            this.props.isEncryptedPwd ? <div><Badge status="error" text={convertToLang(this.props.translation[ENCRYPTED_PASSWORD_IS_CHANGED], "Encrypted Password is changed")} /> </div> : false
                        }{
                            this.props.isGuestPwd ? <div><Badge status="processing" text={convertToLang(this.props.translation[GUEST_PASSWORD_IS_CHANGED], "Guest Password is changed")} /></div> : false
                        }{
                            this.props.isDuressPwd ? <div><Badge status="warning" text={convertToLang(this.props.translation[DURESS_PASSWORD_IS_CHANGED], "Duress Password is changed")} /></div> : false
                        }
                    </div>
                }


            </div>
        )
    }
}
