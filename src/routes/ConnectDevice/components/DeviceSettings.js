import React, { Component } from 'react'
import { Table, Divider } from "antd";

// import AppList from "./AppList";

export default class TableHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appColumns: [],
            applist: [],
            extensions: [],
        }

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
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
                render: text => <a href="javascript:;">{text}</a>,
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

    }

    filterAppList = () => {
        let data = this.props.app_list;
        let applist = [];
        for (let obj of data) {
            if (obj.isChanged !== undefined && obj.isChanged === true) {
                applist.push(obj);
            }
        }
        this.setState({ applist: applist })
    }

    filterExtensions = () => {
        let data = this.props.extensions;
        let extensions = [];
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

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.filterAppList()
            this.filterExtensions()
        }
    }

    componentDidMount() {
        this.filterAppList();
        this.filterExtensions();
    }

    renderData = (datalist) => {
        console.log(this.props.extensionUniqueName, ' object', this.state.extensions);
        if (datalist.length > 0) {
            return (
                datalist.map((item, index) => {
                    return {
                        key: item.app_id,
                        label: item.label,
                        guest: (item.guest == 1 || item.guest === true) ? <p>On</p> : <p>Off</p>,
                        encrypted: (item.encrypted == 1 || item.encrypted) === true ? <p>On</p> : <p>Off</p>,
                        enable: (item.enable == 1 || item.enable === true) ? <p>On</p> : <p>Off</p>
                    }
                })
            )
        }
    }

    render() {
        console.log(this.props.extensions, 'data li s t of exte')
        return (
            <div>
                {
                    this.state.applist.length ?

                        <div>
                            <Divider > Changed Apps </Divider>
                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='small'
                                bordered={false}
                                columns={this.appsColumns}
                                align='center'
                                dataSource={this.renderData(this.state.applist)}
                                pagination={false}

                            />
                        </div>
                        : false}
                {
                    this.state.extensions.length ?
                        <div>
                            <Divider> Changed Extensions </Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='small'
                                bordered={false}
                                columns={this.extensionColumns}
                                align='center'
                                dataSource={this.renderData(this.state.extensions)}
                                pagination={false}

                            /></div> : false}

                {
                    this.props.isAdminPwd ? <div> <Divider> Admin Password </Divider><p>Admin Password is changed</p> </div> : false
                }{
                    this.props.isEncryptedPwd ? <div> <Divider> Encrypted Password </Divider><p>Encrypted Password is changed</p> </div> : false

                }{
                    this.props.isGuestPwd ? <div> <Divider> Guest Password </Divider><p>Guest Password is changed</p> </div> : false
                   
                }{
                    this.props.isDuressPwd ? <div> <Divider> Duress Password </Divider><p>Duress Password is changed</p> </div> : false
                   
                }

            </div>
        )
    }
}
