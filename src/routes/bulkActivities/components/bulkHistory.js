import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar } from 'antd';
import { componentSearch, getFormattedDate, convertToLang } from '../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME } from '../../../constants/Constants';
import { BASE_URL } from '../../../constants/Application';
// import styles from './Applist.css';
import { POLICY_APP_NAME, POLICY_NAME, ACTIVITY } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { DEVICE_IMEI_1, DEVICE_IMEI_2, ACTIVITIES, DEVICE_ID } from '../../../constants/DeviceConstants';

var copyActivities = [];
var status = true;
export default class Activity extends Component {

    constructor(props) {
        super(props);
        this.appsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }, {
                title: convertToLang(props.translation[Guest], "GUEST"),
                dataIndex: 'guest',
                key: '2',
            }, {
                title: convertToLang(props.translation[ENCRYPTED], "ENCRYPTED"),
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: convertToLang(props.translation[ENABLE], "ENABLE"),
                dataIndex: 'enable',
                key: '4',
            }
        ];
        this.pullAppsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];
        this.policyColumns = [
            {
                title: convertToLang(props.translation[POLICY_NAME], "POLICY NAME"),
                dataIndex: 'policy_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];

        this.imeiColumns = [
            {
                title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI1"),
                dataIndex: 'imei1',
                key: '1',
                render: text => <a >{text}</a>,
            },
            {
                title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI2"),
                dataIndex: 'imei2',
                key: '1',
                render: text => <a >{text}</a>,
            },
        ];
        this.state = {
            visible: false,
            activities: props.history ? props.history : [],
            expandedRowKeys: [],
            device: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.history !== nextProps.history) {
            this.setState({
                activities: nextProps.history
            })
        }
    }

    showModal = () => {
        // console.log("this.props.activities show modal: ", this.props.activities)
        this.setState({
            visible: true,
            activities: this.props.history

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

    // handleComponentSearch = (e) => {

    //     try {
    //         let value = e.target.value;
    //         console.log(status,'searched value', e.target.value)
    //         if (value.length) {
    //             // console.log(status,'searched value', value)
    //             if (status) {
    //                 // console.log('status')
    //                 copyActivities = this.state.activities;
    //                 status = false;
    //             }
    //             // console.log(this.state.users,'coppy de', coppyDevices)
    //             let foundActivities = componentSearch(copyActivities, value);
    //             //  console.log('found devics', foundImeis)
    //             if (foundActivities.length) {

    //                 this.setState({
    //                     activities: foundActivities,
    //                 })
    //             } else {

    //                 this.setState({
    //                     activities: [],
    //                 })
    //             }
    //         } else {
    //             status = true;
    //             this.setState({
    //                 activities: copyActivities,
    //             })
    //         }

    //     } catch (error) {
    //         console.log('error')
    //         // alert("hello");
    //     }
    // }

    handleComponentSearch = (e) => {

        let demoHistory = [];
        if (status) {
            copyActivities = this.props.history;
            status = false;
        }
        console.log("copyActivities ", copyActivities);
        // return [];

        if (e.target.value.length) {
            // let foundDevices = componentSearch(copyActivities, e.target.value);

            // console.log("foundDevices ", foundDevices);
            copyActivities.forEach((device) => {
                Object.keys(device).map(key => {
                    // console.log("device[key] ", device[key])
                    if (device[key] !== undefined) {
                        if ((typeof device[key]) === 'string') {
                            if (device[key].toUpperCase().includes(e.target.value.toUpperCase())) {
                                if (!demoHistory.includes(device)) {
                                    demoHistory.push(device);
                                }
                            }
                        } else if (device[key] !== null) {
                            if (device[key].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                                if (!demoHistory.includes(device)) {
                                    demoHistory.push(device);
                                }
                            }
                        }
                    }
                })
            });
            // console.log("searched value", demoHistory);
            this.setState({
                activities: demoHistory
            })
        } else {
            this.setState({
                activities: copyActivities
            })
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

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = this.state.expandedRowKeys.filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }


    renderList = () => {
        // let data = this.props.history;
        let data = this.state.activities;
        // console.log("history is: ", data)
        if (data.length) {
            return data.map((row, index) => {
                // console.log(row);
                return {
                    key: index,
                    action: row.action.toUpperCase(),
                    created_at: getFormattedDate(row.created_at),
                    data: row.data
                }
            })
        }
    }
    render() {

        // console.log(this.state.activities[16], 'activities to')

        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width="850px"
                    maskClosable={false}
                    visible={this.props.historyModalShow}
                    title={
                        <div className="pp_popup">
                            {convertToLang(this.props.translation[""], "History of Bulk Device Activities")}
                            <Input.Search
                                name="search"
                                key="search"
                                id="search"
                                className="search_heading1"
                                onKeyUp={
                                    (e) => {
                                        this.handleComponentSearch(e)
                                    }
                                }
                                placeholder="Search"
                            />
                        </div>
                    }
                    onOk={this.handleOk}
                    onCancel={this.props.handleHistoryCancel}
                    footer={null}
                    className="activities"
                // className="edit_form"
                >
                    <Table
                        columns={[
                            {
                                title: convertToLang(this.props.translation[ACTIVITY], "ACTIVITY"),
                                align: "center",
                                dataIndex: 'action',
                                key: "action",
                                className: '',
                                sorter: (a, b) => { return a.action.localeCompare(b.action) },
                                sortDirections: ['ascend', 'descend'],

                            },
                            {
                                title: convertToLang(this.props.translation[DATE], "DATE"),
                                align: "center",
                                dataIndex: 'created_at',
                                key: "created_at",
                                className: '',
                                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                                sortDirections: ['ascend', 'descend'],
                                defaultSortOrder: 'descend'

                            },
                        ]}
                        onChange={this.props.onChangeTableSorting}
                        bordered
                        rowClassName={(record, index) =>
                            this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''
                        }
                        onExpand={this.onExpandRow}
                        dataSource={this.renderList()}
                        expandedRowRender={record => {
                            // console.log('recored', record)
                            return (
                                <Table
                                    style={{ margin: 0, padding: 0 }}
                                    size='middle'
                                    bordered={false}
                                    columns={this.props.columns}
                                    align='center'
                                    dataSource={this.props.renderList(JSON.parse(record.data))}
                                    pagination={false}
                                    scroll={{ x: true }}
                                />
                            )

                        }}
                        // scroll={{ y: 350 }}
                        pagination={false}
                    />

                </Modal>

            </div>
        )
    }
}
