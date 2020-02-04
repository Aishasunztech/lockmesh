import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar, Card, Tabs } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, convertTimezoneValue } from '../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME } from '../../../constants/Constants';
import { BASE_URL, TIMESTAMP_FORMAT } from '../../../constants/Application';
import CircularProgress from "components/CircularProgress";
// import styles from './Applist.css';
import { POLICY_APP_NAME, POLICY_NAME, ACTIVITY } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { DEVICE_IMEI_1, DEVICE_IMEI_2, ACTIVITIES, DEVICE_ID } from '../../../constants/DeviceConstants';
import { bulkDeviceHistoryColumns } from '../../utils/columnsUtils';
import CustomScrollbars from '../../../util/CustomScrollbars';

const TabPane = Tabs.TabPane;
var copyActivities = [];
var status = true;
export default class BulkActivity extends Component {

    constructor(props) {
        super(props);
        let columns = bulkDeviceHistoryColumns(props.translation, this.handleSearch);

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

        // this.imeiColumns = [
        //     {
        //         title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI1"),
        //         dataIndex: 'imei1',
        //         key: '1',
        //         render: text => <a >{text}</a>,
        //     },
        //     {
        //         title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI2"),
        //         dataIndex: 'imei2',
        //         key: '1',
        //         render: text => <a >{text}</a>,
        //     },
        // ];
        this.state = {
            columns: columns,
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
        this.setState({
            visible: true,
            activities: this.props.history
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }


    handleComponentSearch = (e) => {
        // console.log("e.target.value ", e.target.name, e.target.value);
        let demoHistory = [];
        if (e.target.value.length && this.props.history && this.props.history.length) {
            this.props.history.forEach((device) => {
                if (device.action) {
                    if (device.action.toUpperCase().includes(e.target.value.toUpperCase())) {
                        if (!demoHistory.includes(device)) {
                            demoHistory.push(device);
                        }
                    }
                }
            });
            this.setState({
                activities: demoHistory
            })
        } else {
            this.setState({
                activities: this.props.history ? this.props.history : []
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


    renderHistoryList = (data) => {
        // let data = this.props.history;
        // let data = this.state.activities;
        // console.log("history is: ", data)
        if (data && data.length) {
            return data.map((row, index) => {
                // console.log(row);
                return {
                    key: index,
                    action: row.action.toUpperCase(),
                    created_at: convertTimezoneValue(this.props.user.timezone, row.created_at, TIMESTAMP_FORMAT),
                    // created_at: getFormattedDate(row.created_at),
                    allData: row
                }
            })
        } else {
            return [];
        }
    }
    render() {

        // console.log(this.state.activities, 'activities to')

        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width="750px"
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
                    bodyStyle={{ height: 400, overflow: 'overlay', width: '100%' }}
                >
                    {/* {this.props.history_loading ? <CircularProgress /> : */}
                    <Card className='fix_card fix_card_his_bulk'>
                        <hr className="fix_header_border" style={{ top: "17px" }} />
                        <CustomScrollbars className="gx-popover-scroll ">
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
                                dataSource={this.renderHistoryList(this.state.activities ? this.state.activities : [])}
                                expandedRowRender={record => {
                                    // console.log('recored', record)

                                    if (record.action === 'PUSHED APPS' || record.action === 'PULLED APPS' || record.action === 'PUSHED POLICY') {
                                        return (
                                            <Tabs type="card">
                                                {(record.action === 'PUSHED APPS') ?
                                                    <TabPane tab={convertToLang(this.props.translation[""], "PUSHED APPS")} key="2" >
                                                        <Table
                                                            style={{ margin: 0, padding: 0 }}
                                                            size='middle'
                                                            bordered={false}
                                                            columns={this.appsColumns}
                                                            align='center'
                                                            dataSource={this.renderApps(JSON.parse(record.allData.apps))}
                                                            pagination={false}
                                                            scroll={{ x: true }}
                                                        />
                                                    </TabPane>
                                                    : (record.action === 'PULLED APPS') ?
                                                        <TabPane tab={convertToLang(this.props.translation[""], "PULLED APPS")} key="3" >
                                                            <Table
                                                                style={{ margin: 0, padding: 0 }}
                                                                size='middle'
                                                                bordered={false}
                                                                columns={this.pullAppsColumns}
                                                                align='center'
                                                                dataSource={this.renderApps(JSON.parse(record.allData.apps))}
                                                                pagination={false}
                                                                scroll={{ x: true }}
                                                            />
                                                        </TabPane>
                                                        : (record.action === 'PUSHED POLICY') ?
                                                            <TabPane tab={convertToLang(this.props.translation[""], "POLICY APPLIED")} key="4" >
                                                                <Table
                                                                    style={{ margin: 0, padding: 0 }}
                                                                    size='middle'
                                                                    bordered={false}
                                                                    columns={this.policyColumns}
                                                                    align='center'
                                                                    // dataSource={[]}
                                                                    dataSource={
                                                                        record.allData.policy ? [{
                                                                            key: record.key,
                                                                            policy_name: '#' + record.allData.policy
                                                                        }] : []
                                                                    }
                                                                    pagination={false}
                                                                    scroll={{ x: true }}
                                                                />
                                                            </TabPane>
                                                            : null}
                                                <TabPane tab={convertToLang(this.props.translation[""], "DEVICES")} key="1" >
                                                    <Table
                                                        style={{ margin: 0, padding: 0 }}
                                                        size='middle'
                                                        bordered={false}
                                                        columns={this.state.columns}
                                                        align='center'
                                                        dataSource={this.props.renderList(JSON.parse(record.allData.devices), this.props.user.timezone)}
                                                        pagination={false}
                                                        scroll={{ x: true }}
                                                    />
                                                </TabPane>
                                            </Tabs>
                                        )
                                    } else {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.state.columns}
                                                align='center'
                                                dataSource={this.props.renderList(JSON.parse(record.allData.devices), this.props.user.timezone)}
                                                pagination={false}
                                                scroll={{ x: true }}
                                            />
                                        )
                                    }
                                }}
                                // scroll={{ y: 350 }}
                                pagination={false}
                            />
                        </CustomScrollbars>
                    </Card>
                    {/* } */}
                </Modal>
            </div>
        )
    }
}
