import React, { Component } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card } from "antd";
import { BASE_URL } from '../../../constants/Application';

import EditApk from './EditApk';

export default class ListApk extends Component {
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
                    </div>
                ),
                'apk_status': (<Switch defaultChecked={(app.apk_status === "On") ? true : false} onChange={(e) => {
                    this.props.handleStatusChange(e, app.apk_id);
                }} />),
                'apk': app.apk ? app.apk : 'N/A',
                'apk_name': app.apk_name ? app.apk_name : 'N/A',
                // http://localhost:3000
                'apk_logo': (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
            }
        });
    }
    render() {
        // console.log('rendder of list apk call');
        // console.log(this.props.apk_list);
        // console.log('end');
        return (
            <Card>
                <Table className="gx-table-responsive apklist_table"
                    size="midddle"
                    bordered
                    columns={this.state.columns}
                    dataSource={this.renderList(this.props.apk_list)}
                    pagination={{ pageSize: Number(this.state.pagination) }}
                    onChange={this.props.tableChangeHandler()}
                    scroll={{ x: 500 }}
                    rowKey="apk_id"
                />
                <EditApk ref='editApk' getApkList={this.props.getApkList} />
            </Card>
        )
    }
}
