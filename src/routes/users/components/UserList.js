import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import styles1 from './users_fixheader.css';
import CustomScrollbars from "../../../util/CustomScrollbars";

import { Card, Row, Col, List, Button, message, Table, Icon, Switch, Modal } from "antd";
import UserDeviceList from './UserDeviceList'
import AddUser from './AddUser';
import { getFormattedDate } from '../../utils/commonUtils';
import {
    Button_Delete,
    Button_Edit,
    Button_Undo,

} from '../../../constants/ButtonConstants';

import styles from './user.css';

const confirm = Modal.confirm

class UserList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            pagination: this.props.pagination,
            users: [],
            expandedRowKeys: [],

        }
    }
    handlePagination = (value) => {
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    handleSearch2 = () => {
        // console.log('refs of all', this.refs)

    }

    renderList(list) {
        // console.log(list);

        let user_list = list.filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return user_list.map((user, index) => {
            // this.state.expandTabSelected[index]='1';
            // this.state.expandedByCustom[index]=false;
            return {
                key: `${user.user_id}`,
                rowKey: `${user.user_id}`,
                counter: ++index,
                action: (
                    <Fragment>
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                style={{ textTransform: 'uppercase' }}
                                onClick={() => this.refs.edit_user.showModal(this.props.editUser, user, 'Edit User')}
                            >
                                {/* <IntlMessages id="button.Edit" />  */}
                                {this.props.translation[Button_Edit]}
                            </Button>
                            {(user.devicesList.length === 0) ?
                                (user.del_status == 0) ?
                                    <Button
                                        type="danger"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => showConfirm(this.props.deleteUser, user.user_id, "Do you want to DELETE user ", 'DELETE USER')}
                                    >
                                        {/* <IntlMessages id="button.Delete" /> */}
                                        {this.props.translation[Button_Delete]}
                                    </Button>
                                    : <Button
                                        type="dashed"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => showConfirm(this.props.undoDeleteUser, user.user_id, "Do you want to UNDO user ", 'UNDO')}
                                    >
                                        {/* <IntlMessages id="button.Undo" />  */}
                                        {this.props.translation[Button_Undo]}
                                    </Button>
                                : null
                            }
                        </div>
                    </Fragment>
                )
                ,

                user_id: user.user_id,
                devices: (user.devicesList) ? user.devicesList.length : 0,
                devicesList: user.devicesList,
                user_name: user.user_name,
                email: user.email,
                tokens: 'N/A',
                created_at: getFormattedDate(user.created_at)
            }
        });

    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /> </a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }
    componentDidMount() {
        this.setState({
            users: this.props.users,
            expandedRowKeys: this.props.expandedRowsKey
        })
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
                let list = this.state.expandedRowKeys.filter(item => item != record.rowKey)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            // console.log('this.props.expandr', this.props)
            this.setState({
                columns: this.props.columns,
                users: this.props.users,
                expandedRowKeys: this.props.expandedRowsKey
            })
        }
    }
    render() {
        // console.log(this.state.expandedRowKeys)
        return (
            <Fragment>
                <Card className="fix_card users_fix_card">
                    <CustomScrollbars className="gx-popover-scroll">
                        <Table
                            className="users_list"
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                            size="middle"
                            bordered
                            expandIcon={(props) => this.customExpandIcon(props)}
                            expandedRowRender={(record) => {
                                // console.log("table row", record);
                                return (
                                    <UserDeviceList
                                        ref='userDeviceList'
                                        record={record}
                                        translation={this.props.translation}
                                    />
                                );
                            }}
                            expandIconColumnIndex={3}
                            expandedRowKeys={this.state.expandedRowKeys}
                            onExpand={this.onExpandRow}
                            expandIconAsCell={false}
                            defaultExpandedRowKeys={(this.props.location.state) ? [this.props.location.state.id] : []}
                            columns={this.state.columns}
                            dataSource={this.renderList(this.state.users)}
                            pagination={false}
                            ref='user_table'
                            translation={this.props.translation}
                        />
                    </CustomScrollbars>
                </Card>
                <AddUser ref='edit_user' translation={this.props.translation} />
            </Fragment>
        )
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         // getPolicies: getPolicies,
//     }, dispatch);
// }

// var mapStateToProps = ({ policies }) => {
//     // console.log("policies", policies);
//     return {
//         // routing: routing,
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
export default UserList;


function showConfirm(action, user_id, msg, buttonText) {
    confirm({
        title: msg + user_id,
        okText: buttonText,
        onOk() {
            action(user_id)
        },
        onCancel() { },
    })
}

