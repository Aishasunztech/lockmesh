import React, { Component, Fragment } from 'react'
import { Table, Divider, Badge, Switch } from "antd";
import { APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS } from '../../../constants/Constants';

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

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: 'ENABLE',
                dataIndex: 'enable',
                key: '4',
            }
        ];
        this.extensionColumns = [
            {
                title: 'Extension NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}> {text}</ a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }
        ];
        this.controlColumns = [
            {
                title: 'PERMISSION NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
            }, {
                title: 'STATUS',
                dataIndex: 'status',
                key: '2',
            }
        ];
    }

    cotrolsValues = () => {
        // console.log(this.state.controls);
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
                    if (obj.uniqueName == this.props.extensionUniqueName) {
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

        if (datalist.length > 0) {
            return (
                datalist.map((item, index) => {

                    // console.log(item);
                    return {
                        key: item.app_id,
                        label: item.label == undefined || item.label == 'undefined' ? item.apk_name : item.label,
                        // guest: (item.guest == 1 || item.guest === true) ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>,
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
        // console.log(this.props.extensions, 'data li s t of exte')
        // console.log(this.props.passwords);
        return (
            <div>
                {/* {
                    this.state.applist.length ? */}
                {
                    this.props.isPushApps == true && this.props.type !== 'profile' ?
                        <div>
                            <Divider > PUSH APPS </Divider>
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
                {this.state.applist.length > 0 ?
                    <div>
                        <Divider >{APPLICATION_PERMISION} </Divider>
                        <Table
                            style={{ margin: 0, padding: 0 }}
                            size='default'
                            bordered={false}
                            columns={this.appsColumns}
                            align='center'
                            dataSource={this.renderData(this.state.applist)}
                            pagination={false}

                        />
                    </div> : false}
                {/* : false}  */}
                {
                    this.state.extensions.length ?
                        <div>
                            <Divider> {SECURE_SETTING_PERMISSION}</Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.extensionColumns}
                                align='center'
                                dataSource={this.renderData(this.state.extensions)}
                                pagination={false}

                            /></div>
                        : false}
                {
                    this.props.showChangedControls ?
                        Object.entries(this.state.controls).length > 0 ?
                            Object.entries(this.state.controls.controls).length > 0 ?

                                <div>
                                    {console.log('if', Object.entries(this.state.controls.controls).length > 0)}
                                    <Divider> {SYSTEM_PERMISSION}</Divider>

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
                        : this.props.showChangedControls == undefined ? <div>
                            <Divider> {SYSTEM_PERMISSION}</Divider>
                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='default'
                                bordered={false}
                                columns={this.controlColumns}
                                align='center'
                                dataSource={this.cotrolsValues()}
                                pagination={false}

                            />

                        </div> : false
                }
                {(this.props.type === 'profile') ?

                    <div>
                        {
                            this.props.passwords.admin_password || this.props.passwords.guest_password || this.props.passwords.encrypted_password || this.props.passwords.duress_password ?
                                <Divider> {MANAGE_PASSWORDS} </Divider> : false
                        }
                        {
                            this.props.passwords.admin_password ? <div> <Badge status="success" text='Admin Password is changed' /> </div> : false
                        }{
                            this.props.passwords.encrypted_password ? <div><Badge status="error" text='Encrypted Password is changed' /> </div> : false
                        }{
                            this.props.passwords.guest_password ? <div><Badge status="processing" text='Guest Password is changed' /></div> : false
                        }{
                            this.props.passwords.duress_password ? <div><Badge status="warning" text='Duress Password is changed' /></div> : false
                        }
                    </div>
                    :
                    <div>
                        {
                            this.props.isAdminPwd || this.props.isEncryptedPwd || this.props.isGuestPwd || this.props.isDuressPwd ?
                                <Divider> {MANAGE_PASSWORDS} </Divider> : false
                        }
                        {
                            this.props.isAdminPwd ? <div> <Badge status="success" text='Admin Password is changed' /> </div> : false
                        }{
                            this.props.isEncryptedPwd ? <div><Badge status="error" text='Encrypted Password is changed' /> </div> : false
                        }{
                            this.props.isGuestPwd ? <div><Badge status="processing" text='Guest Password is changed' /></div> : false
                        }{
                            this.props.isDuressPwd ? <div><Badge status="warning" text='Duress Password is changed' /></div> : false
                        }
                    </div>
                }


            </div>
        )
    }
}
