import React, { Component, Fragment } from 'react'
import { Table, Divider, Badge, Switch } from "antd";
import { APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS, PERMISSION_NAME } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';
import { PUSH_APPS } from '../../../constants/ActionTypes';
import { APK_APP_NAME } from '../../../constants/ApkConstants';
import { Guest, ENCRYPTED, ENABLE, EXTENSION_NAME, ADMIN_PASSWORD_IS_CHANGED, ENCRYPTED_PASSWORD_IS_CHANGED, GUEST_PASSWORD_IS_CHANGED, DURESS_PASSWORD_IS_CHANGED } from '../../../constants/TabConstants';
import { DEVICE_STATUS } from '../../../constants/DeviceConstants';
import { appsColumns, extensionColumns, controlColumns } from '../../utils/columnsUtils';
// import AppList from "./AppList";

export default class TableHistory extends Component {
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

    cotrolsValues = () => {
        // console.log(this.state.controls, 'controls are');
        if (Object.entries(this.state.controls).length > 0 && this.state.controls.constructor === Object) {

            let data = [];
            if (this.state.controls.controls.wifi_status !== undefined) {
                data.push({
                    label: 'Wifi',
                    // status: this.state.controls.controls.wifi_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    status: <Switch
                        size="small"
                        value={this.state.controls.controls.wifi_status}
                        checked={(this.state.controls.controls.wifi_status === true || this.state.controls.controls.wifi_status === 1) ? true : false}
                        disabled={true}
                    />,
                })
            } if (this.state.controls.controls.bluetooth_status !== undefined) {
                data.push({
                    label: 'Bluetooth',
                    // status: this.state.controls.controls.bluetooth_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    status: <Switch
                        size="small"
                        value={this.state.controls.controls.bluetooth_status}
                        checked={(this.state.controls.controls.bluetooth_status === true || this.state.controls.controls.bluetooth_status === 1) ? true : false}
                        disabled={true}
                    />,
                })
            } if (this.state.controls.controls.hotspot_status !== undefined) {
                data.push({
                    label: 'Hotspot',
                    // status: this.state.controls.controls.hotspot_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    status: <Switch
                        size="small"
                        value={this.state.controls.controls.hotspot_status}
                        checked={(this.state.controls.controls.hotspot_status === true || this.state.controls.controls.hotspot_status === 1) ? true : false}
                        disabled={true}
                    />,
                })
            } if (this.state.controls.controls.screenshot_status !== undefined) {
                data.push({
                    label: 'Screenshots',
                    // status: this.state.controls.controls.screenshot_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    status: <Switch
                        size="small"
                        value={this.state.controls.controls.screenshot_status}
                        checked={(this.state.controls.controls.screenshot_status === true || this.state.controls.controls.screenshot_status === 1) ? true : false}
                        disabled={true}
                    />,
                })
            } if (this.state.controls.controls.call_status !== undefined) {
                data.push({
                    label: 'Block Calls',
                    // status: this.state.controls.controls.call_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    status: <Switch
                        size="small"
                        value={this.state.controls.controls.call_status}
                        checked={(this.state.controls.controls.call_status === true || this.state.controls.controls.call_status === 1) ? true : false}
                        disabled={true}
                    />,
                })

            }

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

    renderData = (datalist) => {
        // console.log(JSON.parse(datalist));
        // console.log(this.props.type, 'datalist is type of');
        let data = JSON.parse(JSON.stringify(datalist));
        if (this.props.type === 'profile') {
            data = JSON.parse(JSON.stringify(datalist))
        }

        if (datalist.length > 0) {
            return (
                data.map((item, index) => {

                    // console.log(item);
                    return {
                        key: item.app_id,
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
                })
            )
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.isPushApps === true && this.props.type !== 'profile' ?
                        <div>
                            <Divider > {convertToLang(this.props.translation[PUSH_APPS], PUSH_APPS)} </Divider>
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
                {
                    this.state.applist.length > 0 ?
                    <div>
                        <Divider > {convertToLang(this.props.translation[APPLICATION_PERMISION], APPLICATION_PERMISION)} </Divider>
                        <Table
                            style={{ margin: 0, padding: 0 }}
                            size='default'
                            bordered={false}
                            columns={this.appsColumns}
                            align='center'
                            dataSource={this.renderData(this.state.applist)}
                            pagination={false}

                        />
                    </div> : false
                }
                {
                    this.state.extensions.length ?
                        <div>
                            <Divider> {convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], SECURE_SETTING_PERMISSION)}</Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.extensionColumns}
                                align='center'
                                dataSource={this.renderData(this.state.extensions)}
                                pagination={false}

                            /></div>
                        : false
                }
                {
                    this.props.showChangedControls ?
                        Object.entries(this.state.controls).length > 0 ?
                            Object.entries(this.state.controls.controls).length > 0 ?
                                <div>
                                    <Divider> {convertToLang(this.props.translation[SYSTEM_PERMISSION], SYSTEM_PERMISSION)}</Divider>

                                    <Table
                                        style={{ margin: 0, padding: 0 }}
                                        size='default'
                                        bordered={false}
                                        columns={this.controlColumns}
                                        align='center'
                                        dataSource={this.cotrolsValues()}
                                        pagination={false}

                                    />

                                </div> : false : false
                        : this.props.showChangedControls === undefined ?
                            Object.entries(this.state.controls).length > 0 ?
                                Object.entries(this.state.controls.controls).length > 0 ?
                                    <div>
                                        <Divider> {convertToLang(this.props.translation[SYSTEM_PERMISSION], SYSTEM_PERMISSION)}</Divider>
                                        <Table
                                            style={{ margin: 0, padding: 0 }}
                                            size='default'
                                            bordered={false}
                                            columns={this.controlColumns}
                                            align='center'
                                            dataSource={this.cotrolsValues()}
                                            pagination={false}

                                        />

                                    </div> : false : false : false
                }
                {(this.props.type === 'profile') ?

                    <div>
                        {
                            this.props.passwords.admin_password || this.props.passwords.guest_password || this.props.passwords.encrypted_password || this.props.passwords.duress_password ?
                                <Divider>{convertToLang(this.props.translation[MANAGE_PASSWORDS], MANAGE_PASSWORDS)} </Divider> : false
                        }
                        {
                            this.props.passwords.admin_password ? <div> <Badge status="success" text={convertToLang(this.props.translation[ADMIN_PASSWORD_IS_CHANGED], ADMIN_PASSWORD_IS_CHANGED)} /> </div> : false
                        }
                        {
                            this.props.passwords.encrypted_password ? <div><Badge status="error" text={convertToLang(this.props.translation[ENCRYPTED_PASSWORD_IS_CHANGED], ENCRYPTED_PASSWORD_IS_CHANGED)} /> </div> : false
                        }
                        {
                            this.props.passwords.guest_password ? <div><Badge status="processing" text={convertToLang(this.props.translation[GUEST_PASSWORD_IS_CHANGED], GUEST_PASSWORD_IS_CHANGED)} /></div> : false
                        }
                        {
                            this.props.passwords.duress_password ? <div><Badge status="warning" text={convertToLang(this.props.translation[DURESS_PASSWORD_IS_CHANGED], DURESS_PASSWORD_IS_CHANGED)} /></div> : false
                        }
                    </div>
                    :
                    <div>
                        {
                            this.props.isAdminPwd || this.props.isEncryptedPwd || this.props.isGuestPwd || this.props.isDuressPwd ?
                                <Divider> {convertToLang(this.props.translation[MANAGE_PASSWORDS], MANAGE_PASSWORDS)} </Divider> : false
                        }
                        {
                            this.props.isAdminPwd ? <div> <Badge status="success" text='Admin Password is changed' /> </div> : false
                        }
                        {
                            this.props.isEncryptedPwd ? <div><Badge status="error" text='Encrypted Password is changed' /> </div> : false
                        }
                        {
                            this.props.isGuestPwd ? <div><Badge status="processing" text='Guest Password is changed' /></div> : false
                        }
                        {
                            this.props.isDuressPwd ? <div><Badge status="warning" text='Duress Password is changed' /></div> : false
                        }
                    </div>
                }


            </div>
        )
    }
}
