import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs } from "antd";
import { BASE_URL } from '../../../constants/Application';
import Permissions from './Permissions';
import styles from './app.css';
import CustomScrollbars from "../../../util/CustomScrollbars";

import {
    convertToLang
} from '../../utils/commonUtils'
import EditApk from './EditApk';
import { Button_Edit, Button_Delete } from '../../../constants/ButtonConstants';


export default class ListApk extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            columns: [],
            pagination: this.props.pagination,
            expandedRowKeys: [],

        };
        this.renderList = this.renderList.bind(this);
    }

    handlePagination = (value) => {

        var x = Number(value)
        // console.log(value)
        this.setState({
            pagination: x,
        });

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            // console.log(this.props.columns);
            this.setState({
                columns: this.props.columns
            })
        }
    }

    handleCheckChange = (values) => {

        let dumydata = this.state.columns;
        // console.log('values', values);

        if (values.length) {

            this.state.columns.map((column, index) => {

                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                }

                values.map((value) => {
                    if (column.title === value) {
                        dumydata[index].className = '';
                    }
                });

            });

            this.setState({ columns: dumydata });

        } else {
            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({
                columns: newState,
            });
        }

    }

    // renderList
    renderList(list) {

        return list.map((app) => {
            // console.log('app is: ', app)
            if (app.deleteable) {
                return {
                    'rowKey': app.apk_id,
                    'apk_id': app.apk_id,
                    'action': (
                        <div data-column="ACTION" style={{ display: "inline-flex" }}>
                            <Fragment>
                                <Button type="primary" size="small" style={{ margin: '0px 8px 0 0px', textTransform: "uppercase" }}
                                    onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} > {convertToLang(this.props.translation[Button_Edit], "EDIT")}</Button>
                                <Button type="danger" className="mob_m_t" size="small" style={{ textTransform: "uppercase" }} onClick={(e) => {
                                    this.props.handleConfirmDelete(app.apk_id, app);
                                }}>{convertToLang(this.props.translation[Button_Delete], "DELETE")}</Button>
                            </Fragment>
                        </div>
                    ),
                    'permission': (
                        <div data-column="PERMISSION" style={{ fontSize: 15, fontWeight: 400, display: "inline-block" }}>
                            {app.permission_count}
                        </div>
                    ),
                    "permissions": app.permissions,
                    'apk_status': (
                        <div data-column="SHOW ON DEVICE">
                            <Switch size="small" defaultChecked={(app.apk_status === "On") ? true : false} onChange={(e) => {
                                this.props.handleStatusChange(e, app.apk_id);
                            }} />
                        </div>
                    ),
                    'apk': (
                        <div data-column="SHOW ON DEVICE">
                            {app.apk ? app.apk : 'N/A'}
                        </div>
                    ),
                    'apk_name': app.apk_name ? app.apk_name : 'N/A',
                    'apk_logo': (
                        <div data-column="APK LOGO">
                            <Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />
                        </div>),
                    'apk_size': (
                        <div data-column="APP SIZE">
                            {app.size ? app.size : 'N/A'}
                        </div>
                    ),
                }

            } else {
                return {
                    'rowKey': app.apk_id,
                    'apk_id': app.apk_id,
                    'action': (
                        <Fragment>
                            <Button type="primary" size="small" style={{ margin: '0px', marginRight: "8px", textTransform: "uppercase" }}
                                onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} > {convertToLang(this.props.translation[Button_Edit], "EDIT")}</Button>
                        </Fragment>
                    ),
                    'permission': <span style={{ fontSize: 15, fontWeight: 400, display: "inline-block" }}>{app.permission_count}</span>,
                    "permissions": app.permissions,
                    'apk_status': (<Switch size="small" disabled defaultChecked={(app.apk_status === "On") ? true : false} onChange={(e) => {
                        this.props.handleStatusChange(e, app.apk_id);
                    }} />),
                    'apk': app.apk ? app.apk : 'N/A',
                    'apk_name': app.apk_name ? app.apk_name : 'N/A',
                    'apk_logo': (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
                    'apk_size': app.size ? app.size : "N/A",
                }
            }
        });
    }

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        // this.setState({ selectedRowKeys });
    }
    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.rowKey)) {
                this.state.expandedRowKeys.push(record.rowKey);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.rowKey)) {
                let list = this.state.expandedRowKeys.filter(item => item !== record.rowKey)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    render() {

        return (
            <Card className="fix_card apk_fix_card">
                <hr className="fix_header_border" style={{ top: "15px" }} />
                <CustomScrollbars className="gx-popover-scroll">
                    <Table
                        className="gx-table-responsive apklist_table"

                        rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            return (
                                <Permissions className="exp_row22" record={record} translation={this.props.translation} />
                                /*<Fragment>
                                    <Tabs
                                        className="exp_tabs_policy"
                                        type="card"
                                    >
                                        <Tabs.TabPane tab={convertToLang(this.props.translation['PERMISSIONS'], "PERMISSIONS")} key="1">
                                            <Permissions className="exp_row22" record={record} translation={this.props.translation} />
                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation['POLICIES'], "POLICIES")} key="2">

                            </Tabs.TabPane>
                                    </Tabs>
                                </Fragment>*/
                            );
                        }}
                        onExpand={this.onExpandRow}
                        expandIconColumnIndex={2}
                        expandIconAsCell={false}
                        size="midddle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.apk_list)}
                        onChange={this.props.onChangeTableSorting}
                        pagination={false
                            //{ pageSize: Number(this.state.pagination) }
                        }
                        // scroll={{ x: 10 }}
                        rowKey="apk_id"
                    />
                    <EditApk ref='editApk' getApkList={this.props.getApkList} />
                </CustomScrollbars>
            </Card>
        )
    }
}