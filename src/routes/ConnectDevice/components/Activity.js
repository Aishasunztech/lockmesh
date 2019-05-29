import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar } from 'antd';
import { componentSearch, getFormattedDate } from '../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING } from '../../../constants/Constants';
import DeviceSettings from './DeviceSettings';
import { BASE_URL } from '../../../constants/Application';

var coppyActivities = [];
var status = true;
export default class Activity extends Component {

    constructor(props) {
        super(props);
        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
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
        this.pullAppsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];
        this.policyColumns = [
            {
                title: 'POLICY NAME',
                dataIndex: 'policy_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }
        ];

        this.imeiColumns = [
            {
                title: 'IMEI1',
                dataIndex: 'imei1',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            },
            {
                title: 'IMEI2',
                dataIndex: 'imei2',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            },
        ];
        this.state = {
            visible: false,
            activities: this.props.activities
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            activities: this.props.activities

        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    // handlePagination = (value) => {
    //     this.setState({
    //         pagination: value
    //     })
    // }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            // console.log(status,'searched value', e.target.value)
            if (value.length) {
                // console.log(status,'searched value', value)
                if (status) {
                    // console.log('status')
                    coppyActivities = this.state.activities;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundActivities = componentSearch(coppyActivities, value);
                //  console.log('found devics', foundImeis)
                if (foundActivities.length) {

                    this.setState({
                        activities: foundActivities,
                    })
                } else {

                    this.setState({
                        activities: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    activities: coppyActivities,
                })
            }

        } catch (error) {
            console.log('error')
            // alert("hello");
        }
    }


    renderApps = (apps) => {

        return apps.map(app => {
            // console.log(app.app_id);
            return ({
                key: app.app_id,
                app_name:
                    <Fragment>
                        <Avatar
                            size={"small"}
                            src={`${BASE_URL}users/getFile/${app.icon}`}
                        // style={{ width: "30px", height: "30px" }} 
                        />
                        <br />
                        <div className="line_break1">{app.apk_name}</div>
                    </Fragment>,
                guest:
                    <Switch
                        size="small"
                        value={app.guest}
                        disabled
                        checked={(app.guest === true || app.guest === 1) ? true : false}

                    />,
                encrypted:
                    <Switch
                        size="small"
                        disabled
                        value={app.encrypted}
                        checked={(app.encrypted === true || app.encrypted === 1) ? true : false}
                    />,
                enable:
                    <Switch
                        size="small"
                        value={app.enable}
                        disabled
                        checked={((app.enable === true) || (app.enable === 1)) ? true : false}
                    />
            });
        });
    }


    renderList = () => {
        let data = this.state.activities;
        if (data.length) {
            return data.map((row, index) => {
                return {
                    key: index,
                    action_name: row.action_name.toUpperCase(),
                    created_at: getFormattedDate(row.created_at),
                    data: row.data
                }
            })
        }
    }
    render() {
        console.log('activities', this.state.activities)
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title='Activities'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="activities"
                // className="edit_form"
                >
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        // className="search_heading1"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder="Search"
                    />

                    <Table
                        columns={[
                            {
                                title: 'ACTIVITY',
                                align: "center",
                                dataIndex: 'action_name',
                                key: "action_name",
                                className: '',
                                sorter: (a, b) => { return a.action_name.localeCompare(b.action_name) },
                                sortDirections: ['ascend', 'descend'],

                            },
                            {
                                title: "DATE",
                                align: "center",
                                dataIndex: 'created_at',
                                key: "created_at",
                                className: '',
                                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                                sortDirections: ['ascend', 'descend'],
                                defaultSortOrder: 'descend'

                            },
                        ]}
                        bordered
                        dataSource={this.renderList()}
                        expandedRowRender={record => {
                            // console.log('recored', record)
                            if (record.action_name == 'APPS PUSHED') {
                                return (
                                    <Table
                                        style={{ margin: 0, padding: 0 }}
                                        size='middle'
                                        bordered={false}
                                        columns={this.appsColumns}
                                        align='center'
                                        dataSource={
                                                this.renderApps(JSON.parse(record.data.push_apps)) 
                                        }
                                        pagination={false}
                                    />
                                )
                            } 

                            else if (record.action_name == 'APPS PULLED') {
                                return (
                                    <Table
                                        style={{ margin: 0, padding: 0 }}
                                        size='middle'
                                        bordered={false}
                                        columns={this.pullAppsColumns}
                                        align='center'
                                        dataSource={
                                                this.renderApps(JSON.parse(record.data.pull_apps))
                                        }
                                        pagination={false}
                                    />
                                )
                            }
                            else if (record.action_name == 'IMEI CHANGED') {
                                return (
                                    <Table
                                        style={{ margin: 0, padding: 0 }}
                                        size='middle'
                                        bordered={false}
                                        columns={this.imeiColumns}
                                        align='center'
                                        dataSource={
                                               [
                                                {
                                                key: record.data.id,
                                                imei1: JSON.parse(record.data.imei).imei1 ,
                                                imei2: JSON.parse(record.data.imei).imei2 

                                                }
                                               ]
                                        }
                                        pagination={false}
                                    />
                                )
                            }
                            else if (record.action_name == 'POLICY APPLIED') {
                                return (
                                    <Table
                                        style={{ margin: 0, padding: 0 }}
                                        size='middle'
                                        bordered={false}
                                        columns={this.policyColumns}
                                        align='center'
                                        dataSource={[
                                                {
                                                key: record.data.id,
                                                policy_name: '#'+record.data.policy_name
                                                }
                                            ]
                                        }
                                        pagination={false}
                                    />
                                )
                            }
                            
                            
                            else if (record.action_name == 'SETTING CHANGED') {
                                let controls = {
                                    'controls': JSON.parse(record.data.controls)
                                }
                                let passwords = JSON.parse(record.data.passwords)
                                return (
                                    <DeviceSettings
                                        app_list={JSON.parse(record.data.app_list)}
                                        extensions={JSON.parse(record.data.permissions)}
                                        extensionUniqueName={SECURE_SETTING}
                                        isAdminPwd={passwords.admin_password != null && passwords.admin_password != 'null' ? true : false}
                                        isDuressPwd={passwords.duress_password != null && passwords.duress_password != 'null' ? true : false}
                                        isEncryptedPwd={passwords.encrypted_password != null && passwords.encrypted_password != 'null' ? true : false}
                                        isGuestPwd={passwords.guest_password != null && passwords.guest_password != 'null' ? true : false}
                                        controls={controls}
                                        show_all_apps={true}
                                    />
                                )

                            }

                        }}
                        // scroll={{ y: 350 }}
                        pagination={false}
                    />

                </Modal>

            </div>
        )
    }
}
