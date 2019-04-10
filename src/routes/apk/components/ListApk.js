import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Row, Col, Input } from "antd";
import { BASE_URL } from '../../../constants/Application';
import Permissions from './permissions';

import EditApk from './EditApk';

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}];
const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
}];

export default class ListApk extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
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
            return {
                'apk_id': app.apk_id,
                'action': (
                    <div>
                        <Button type="primary" size="small" style={{ margin: '0px', marginRight: "8px" }}
                            onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} > EDIT</Button>
                        <Button type="danger" size="small" style={{ margin: '0px', width: '60px' }} onClick={(e) => {
                            this.props.handleConfirmDelete(app.apk_id);
                        }}>DELETE</Button>
                        {/* <Button type="primary" size="small" style={{ margin: '0px', marginLeft: "8px" }}
                            onClick={this.showModal} >Permission</Button> */}
                        <Modal
                            title="Dealers"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            {/* <Table columns={columns} dataSource={data} /> */}
                        </Modal>

                    </div>
                ),
                'permission': <span style={{fontSize:15, fontWeight:400}}>{app.permission_count}</span>,
                'apk_status': (<Switch defaultChecked={(app.apk_status === "On") ? true : false} onChange={(e) => {
                    this.props.handleStatusChange(e, app.apk_id);
                }} />),
                'apk': app.apk ? app.apk : 'N/A',
                'apk_name': app.apk_name ? app.apk_name : 'N/A',
                'apk_logo': (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
            }
        });
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
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

    render() {

        const rowSelection = {
            onChange: this.onSelectChange,
        };

        return (
            <Card>
                <Table
                    // rowSelection={rowSelection}
                    // expandableRowIcon={<Icon type="right" />}
                    // collapsedRowIcon={<Icon type="down" />}
                    expandIcon={(props) => this.customExpandIcon(props)}
                    expandedRowRender={(record) => {
                        console.log("table row", record);
                        return (
                            <Permissions record={record} />
                        );

                    }}
                    expandIconColumnIndex={1}
                    expandIconAsCell={false}
                    className="gx-table-responsive apklist_table"
                    size="midddle"
                    bordered
                    columns={this.state.columns}
                    dataSource={this.renderList(this.props.apk_list)}
                    pagination={{ pageSize: Number(this.state.pagination) }}

                    scroll={{ x: 500 }}
                    rowKey="apk_id"
                />
                <EditApk ref='editApk' getApkList={this.props.getApkList} />
            </Card>
        )
    }
}