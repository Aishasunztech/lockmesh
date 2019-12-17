import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col, Tag, Modal } from "antd";
import { convertToLang, checkValue } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import moment from 'moment';
import { userDevicesListColumns } from '../../utils/columnsUtils';


export default class ListMsgs extends Component {

    constructor(props) {
        super(props);
        let selectedDevicesColumns = userDevicesListColumns(props.translation, this.handleSearch);
        this.state = {
            selectedDevicesColumns: selectedDevicesColumns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
            searchText: '',
            columns: [],
            pagination: this.props.pagination,
            expandedRowKeys: [],
            visible: false,
            
        };
        this.renderList = this.renderList.bind(this);
        this.confirm = Modal.confirm;
    }

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

    deleteMsg = id => {

        this.confirm({
            title: "Do you want to delete this message ?",
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.deleteBulkMsg(id);
            }),
            onCancel() { },
        });

    }

    renderList(list) {
        // console.log("renderList: ", list);
        let bulkMsgs = [];
        let data
        list.map((app) => {
            // console.log("list ", app.sending_time ? "OKay" : "fail")

            data = {
                rowKey: app.id,
                id: app.id,
                action: (
                    <div data-column="ACTION" style={{ display: "inline-flex" }}>
                        <Fragment>
                            <Fragment><Button type="primary" size="small" onClick={() => this.props.showEditModal(app)}>EDIT</Button></Fragment>
                            <Fragment><Button type="danger" size="small" onClick={() => this.deleteMsg(app.id)}>DELETE</Button></Fragment>
                            {/* <Fragment><Button type="dashed" size="small">RESEND</Button></Fragment> */}
                        </Fragment>
                    </div>
                ),
                msg: checkValue(app.msg),
                timer_status: app.timer_status ? app.timer_status : "N/A",
                repeat: checkValue(app.repeat_duration),
                sending_time: app.sending_time && app.sending_time !== "0000-00-00 00:00:00" ? moment(app.sending_time).format('YYYY-MM-DD HH:mm') : "N/A",
                data: app,
            }
            bulkMsgs.push(data)
        });
        return bulkMsgs
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
                        className="gx-table-responsive"
                        rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            // console.log("record ", record);
                            return (
                                <Fragment>
                                    <Table
                                        style={{ margin: 10 }}
                                        size="middle"
                                        bordered
                                        columns={this.state.selectedDevicesColumns}
                                        onChange={this.props.onChangeTableSorting}
                                        dataSource={this.props.renderDevicesList(JSON.parse(record.data.data))}
                                        pagination={false}
                                        scroll={{ x: true }}
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
                        dataSource={this.renderList(this.props.bulkMsgs ? this.props.bulkMsgs : [])}
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