import React, { Component, Fragment } from 'react'
import { Table, Divider, Badge, } from "antd";
import { APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS} from '../../../constants/Constants';

// import AppList from "./AppList";

export default class TableHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appColumns: [],
            applist: [],
            extensions: [],
            controls: {}
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
        this.controlColumns = [
            {
                title: 'PERMISSION NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: 'STATUS',
                dataIndex: 'status',
                key: '2',
            }
        ];
    }

    cotrolsValues = ()=> {
        if(this.state.controls.length){
            return(
                [
                    {
                        label: 'Wifi',
                        status: this.state.controls.wifi_status ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    },
                    {
                        label: 'Bluetooth',
                        status: this.state.controls.bluetooth_status ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    },
                    {
                        label: 'Hotspot',
                        status: this.state.controls.hotspot_status ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    },
                    {
                        label: 'Screenshots',
                        status: this.state.controls.screenshot_status ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    },
                    {
                        label: 'Block Calls',
                        status: this.state.controls.call_status ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    }
                ]
        
            )
        }
      
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
            this.setState({
                controls: this.props.controls
            })
            this.filterAppList()
            this.filterExtensions()
        }
    }

    componentDidMount() {
        this.setState({controls: this.props.controls})
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
                        guest: (item.guest == 1 || item.guest === true) ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>,
                        encrypted: (item.encrypted == 1 || item.encrypted) === true ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>,
                        enable: (item.enable == 1 || item.enable === true) ? <p style={{ color: "green" }}>On</p> : <p style={{ color: "red" }}>Off</p>
                    }
                })
            )
        }
    }

    render() {
        console.log(this.props.extensions, 'data li s t of exte')
        return (
            <div>
                {/* {
                    this.state.applist.length ? */}

                        <div>
                            <Divider >{APPLICATION_PERMISION} </Divider>
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
                         {/* : false}
                 { */}
                     {/* this.state.extensions.length ? */}
                        <div>
                            <Divider> {SECURE_SETTING_PERMISSION}</Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='small'
                                bordered={false}
                                columns={this.extensionColumns}
                                align='center'
                                dataSource={this.renderData(this.state.extensions)}
                                pagination={false}

                            /></div> 
                            {/* : false} */}
                            
                            <div>
                            <Divider> {SYSTEM_PERMISSION}</Divider>

                            <Table
                                style={{ margin: 0, padding: 0 }}
                                size='small'
                                bordered={false}
                                columns={this.controlColumns}
                                align='center'
                                dataSource={this.cotrolsValues()}
                                pagination={false}

                            /> 
                    
                            </div> 

                           <Divider> {MANAGE_PASSWORDS} </Divider>
                {
                    this.props.isAdminPwd ? <div> <Badge status="success" text='Admin Password is changed' /> </div> : false
                }{
                    this.props.isEncryptedPwd ? <div><Badge status="error" text='Encrypted Password is changed' /> </div> : false
                }{
                    this.props.isGuestPwd ? <div><p></p> <Badge status="processing" text='Guest Password is changed' /></div> : false  
                }{
                    this.props.isDuressPwd ? <div><Badge status="warning" text='Duress Password is changed' /></div> : false 
                }

            </div>
        )
    }
}
