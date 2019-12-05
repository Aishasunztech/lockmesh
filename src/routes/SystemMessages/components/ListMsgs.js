import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col, Tag, Modal } from "antd";
import { convertToLang, checkValue } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import moment from 'moment';


export default class ListMsgs extends Component {
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
        this.confirm = Modal.confirm;
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

            data = {
                rowKey: app.id,
                id: app.id,
                action: (
                    <div data-column="ACTION" style={{ display: "inline-flex" }}>
                        <Fragment>
                            <Fragment><Button type="primary" size="small">EDIT</Button></Fragment>
                            <Fragment><Button type="danger" size="small" onClick={() => this.deleteMsg(app.id)}>DELETE</Button></Fragment>
                            {/* <Fragment><Button type="dashed" size="small">RESEND</Button></Fragment> */}
                        </Fragment>
                    </div>
                ),

                send_to: app,
                msg: checkValue(app.msg),
                repeat: checkValue(app.repeat_duration),
                sending_time: app.sending_time ? moment(app.sending_time).format('YYYY-MM-DD HH:mm') : "N/A",
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
                        className="gx-table-responsive bulk_msg"
                        rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            console.log("record ", record);
                            return (
                                <Fragment>
                                    {/* <Permissions
                                        className="exp_row22"
                                        record={record}
                                        permissionType="domain"
                                        savePermissionAction={this.props.savePermission}
                                        translation={this.props.translation}

                                    /> */}
                                    <Row>
                                        <Col span={8}>
                                            <h3>Devices: </h3>
                                        </Col>
                                        <Col span={16}>
                                            {JSON.parse(record.send_to.device_ids).map(item => <Tag>{item}</Tag>)}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <h3>Users: </h3>
                                        </Col>
                                        <Col span={16}>
                                            {JSON.parse(record.send_to.user_ids).map(item => <Tag>{item}</Tag>)}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8}>
                                            <h3>Dealers: </h3>
                                        </Col>
                                        <Col span={16}>
                                            {JSON.parse(record.send_to.dealer_ids).map(item => <Tag>{item}</Tag>)}
                                        </Col>
                                    </Row>
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