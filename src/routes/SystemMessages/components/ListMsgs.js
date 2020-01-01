import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col, Tag, Modal } from "antd";
import { convertToLang, checkValue, convertTimezoneValue, getWeekDay, getMonthName } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import moment from 'moment';
import { userDevicesListColumns } from '../../utils/columnsUtils';
import { TIMESTAMP_FORMAT_NOT_SEC, TIME_FORMAT_HM } from '../../../constants/Application';
import EditMsgModal from './EditMsgForm';


export default class ListMsgs extends Component {

    constructor(props) {
        super(props);
        let selectedDevicesColumns = userDevicesListColumns(props.translation, this.handleSearch);
        this.state = {
            selectedDevicesColumns: selectedDevicesColumns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
            searchText: '',
            columns: [],
            expandedRowKeys: [],
            visible: false,
            editRecord: null,
            editModal: false
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

    handleEditModal = (data) => {
        this.setState({ editModal: true, editRecord: data })
    }

    renderList(list) {
        // console.log("renderList: ", list);
        let bulkMsgs = [];
        let data







        list.map((item) => {
            let parseDevices = item.data ? JSON.parse(item.data) : [];
            let duration = item.repeat_duration;
            // console.log(item);

            if (duration === "WEEKLY") {
                duration = getWeekDay(item.week_day)
            }
            else if (duration === "MONTHLY" || duration === "3 MONTHS" || duration === "6 MONTHS") {
                duration = `Every month on ${checkValue(item.month_date)} date`
            }
            else if (duration === "12 MONTHS") {
                duration = `Every ${getMonthName(item.month_name)} on ${checkValue(item.month_date)} date`
            } else {
                duration = "N/A"
            }

            data = {
                rowKey: item.id,
                id: item.id,
                action: (
                    <div data-column="ACTION" style={{ display: "inline-flex" }}>
                        <Fragment>
                            <Fragment><Button type="primary" size="small" onClick={() => this.handleEditModal(JSON.parse(JSON.stringify(item)))}>EDIT</Button></Fragment>
                            <Fragment><Button type="danger" size="small" onClick={() => this.deleteMsg(item.id)}>DELETE</Button></Fragment>
                        </Fragment>
                    </div>
                ),
                send_to: parseDevices.length,
                msg: checkValue(item.msg),
                timer_status: item.timer_status ? item.timer_status : "N/A",
                repeat: item.repeat_duration ? item.repeat_duration : "NONE",
                sending_time: item.timer_status === "DATE/TIME" ? item.date_time : (item.timer_status !== "NOW" && item.time) ? item.time : "N/A",
                // sending_time: item.timer_status === "DATE/TIME" ? convertTimezoneValue(this.props.user.timezone, item.date_time, TIMESTAMP_FORMAT_NOT_SEC) : (item.timer_status !== "NOW" && item.time) ? item.time : "N/A",
                interval_description: duration,
                created_at: item.created_at,
                // week_day: getWeekDay(item.week_day),
                // month_date: item.month_date && item.month_date !== 0 ? `On every ${checkValue(item.month_date)} date of month` : "N/A",
                // month_name: getMonthName(item.month_name),
                devices: parseDevices,
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

    handleEditMsgModal = (visible) => {
        this.setState({ editModal: visible })
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
                                        // onChange={this.props.onChangeTableSorting}
                                        dataSource={this.props.renderDevicesList(record.devices)}
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
                        // onChange={this.props.onChangeTableSorting}
                        pagination={false
                        }
                        scroll={{ x: true }}
                        rowKey="domain_id"
                    />
                </Card>

                <EditMsgModal
                    editModal={this.state.editModal}
                    handleEditMsgModal={this.handleEditMsgModal}
                    updateBulkMsgAction={this.props.updateBulkMsgAction}
                    user={this.props.user}
                    editRecord={this.state.editRecord}
                    // ref='edit_msg_form'
                    translation={this.props.translation}
                />
            </Fragment>
        )
    }
}