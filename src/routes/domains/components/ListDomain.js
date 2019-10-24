import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col } from "antd";
// import { BASE_URL } from '../../../constants/Application';
// import styles from './app.css';
// import CustomScrollbars from "../../../util/CustomScrollbars";
// import { Link } from 'react-router-dom';

// import {
//     convertToLang
// } from '../../utils/commonUtils'
// import { Button_Edit, Button_Delete } from '../../../constants/ButtonConstants';
// import { ADMIN } from '../../../constants/Constants';
import Permissions from '../../utils/Components/Permissions';
// const TabPane = Tabs.TabPane;
export default class ListDomain extends Component {
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

    // handleCheckChange = (values) => {

    //     let dumydata = this.state.columns;
    //     // console.log('values', values);

    //     if (values.length) {

    //         this.state.columns.map((column, index) => {

    //             if (dumydata[index].className !== 'row') {
    //                 dumydata[index].className = 'hide';
    //             }

    //             values.map((value) => {
    //                 if (column.title === value) {
    //                     dumydata[index].className = '';
    //                 }
    //             });

    //         });

    //         this.setState({ columns: dumydata });

    //     } else {
    //         const newState = this.state.columns.map((column) => {
    //             if (column.className === 'row') {
    //                 return column;
    //             } else {
    //                 return ({ ...column, className: 'hide' })
    //             }
    //         });

    //         this.setState({
    //             columns: newState,
    //         });
    //     }

    // }

    // renderList
    renderList(list) {
        let domainList = [];
        let data
        list.map((app) => {
            // if (app.package_name !== 'com.armorSec.android' && app.package_name !== 'ca.unlimitedwireless.mailpgp' && app.package_name !== 'com.rim.mobilefusion.client' && app.package_name !== 'com.secure.vpn') {
            // console.log('app is: ', app)

            data = {
                rowKey: app.id,
                id: app.id,
                action: (
                    <div data-column="ACTION" style={{ display: "inline-flex" }}>
                        <Fragment>
                            <Button type="danger" size="small">DELETE</Button>
                            {/* <Button type="primary" size="small" style={{ margin: '0px 8px 0 0px', textTransform: "uppercase" }}
                                onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} > {convertToLang(this.props.translation[Button_Edit], "EDIT")}</Button>
                            {(app.policies === undefined || app.policies === null || app.policies.length === 0) ? <Button type="danger" className="mob_m_t" size="small" style={{ textTransform: "uppercase" }} onClick={(e) => {
                                this.props.handleConfirmDelete(app.apk_id, app);
                            }}>{convertToLang(this.props.translation[Button_Delete], "DELETE")}</Button> : null} */}

                        </Fragment>
                    </div>
                ),
                permission: (
                    <div data-column="PERMISSION" style={{ fontSize: 15, fontWeight: 400, display: "inline-block" }}>
                        {app.dealers ? JSON.parse(app.dealers).length : 0}
                    </div>
                ),
                permissions: app.dealers ? JSON.parse(app.dealers) : [],

                name: app.name ? app.name : 'N/A',

                created_at: app.created_at,
                updated_at: app.updated_at
            }
            domainList.push(data)
            // }
        });
        return domainList
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
            <Fragment>
                <Card>
                    <Table
                        className="gx-table-responsive apklist_table"
                        rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            // console.log("record ", record);
                            return (
                                <Fragment>
                                    <Permissions
                                        className="exp_row22"
                                        record={record}
                                        permissionType="domain"
                                        savePermissionAction={this.props.savePermission}
                                        translation={this.props.translation}
                                    />
                                </Fragment>
                            );
                        }}
                        onExpand={this.onExpandRow}
                        expandIconColumnIndex={2}
                        expandIconAsCell={false}
                        size="midddle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.domainList)}
                        onChange={this.props.onChangeTableSorting}
                        pagination={false
                        }
                        scroll={{ x: true }}
                        rowKey="domain_id"
                    />
                    {/* <EditApk ref='editApk' getApkList={this.props.getApkList} /> */}
                </Card>
            </Fragment>
        )
    }
}