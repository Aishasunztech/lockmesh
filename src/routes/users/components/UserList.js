import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import styles1 from './users_fixheader.css';
import CustomScrollbars from "../../../util/CustomScrollbars";

import { Card, Row, Col, List, Button, message, Table, Icon, Switch, Modal } from "antd";
import UserDeviceList from './UserDeviceList'
import AddUser from './AddUser';
import { getFormattedDate, convertToLang } from '../../utils/commonUtils';

import {
    Button_Delete,
    Button_Edit,
    Button_Undo,

} from '../../../constants/ButtonConstants';

import styles from './user.css';
import { EDIT_USER, DELETE_USER, DO_YOU_WANT_TO_DELETE_USER, UNDO, DO_YOU_WANT_TO_UNDO_USER } from '../../../constants/UserConstants';

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
                action:
                    (<Fragment>
                        <Button
                            type="primary"
                            size="small"
                            style={{ textTransform: 'uppercase' }}
                            onClick={() => this.refs.edit_user.showModal(this.props.editUser, user, convertToLang(this.props.translation[EDIT_USER], EDIT_USER))}
                        >
                            {/* <IntlMessages id="button.Edit" />  */}
                            {convertToLang(this.props.translation[Button_Edit], Button_Edit)}
                        </Button>
                        {(user.devicesList.length === 0) ?
                            (user.del_status === 0) ?
                                <Button
                                    type="danger"
                                    size="small"
                                    style={{ textTransform: 'uppercase' }}
                                    onClick={() => showConfirm(this.props.deleteUser, user.user_id, convertToLang(this.props.translation[DO_YOU_WANT_TO_DELETE_USER], DO_YOU_WANT_TO_DELETE_USER) , convertToLang(this.props.translation[DELETE_USER], DELETE_USER))}
                                >
                                    {/* <IntlMessages id="button.Delete" /> */}
                                    {convertToLang(this.props.translation[Button_Delete], Button_Delete)}
                                </Button>
                                : <Button
                                    type="dashed"
                                    size="small"
                                    style={{ textTransform: 'uppercase' }}
                                    onClick={() => showConfirm(this.props.undoDeleteUser, user.user_id, convertToLang(this.props.translation[DO_YOU_WANT_TO_UNDO_USER], DO_YOU_WANT_TO_UNDO_USER) , convertToLang(this.props.translation[UNDO], UNDO))}
                                >
                                    {/* <IntlMessages id="button.Undo" />  */}
                                    {convertToLang(this.props.translation[Button_Undo], Button_Undo)}
                                </Button>
                            : null
                        }
                    </Fragment>)
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
                let list = this.state.expandedRowKeys.filter(item => item !== record.rowKey)
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
                <Card>
                    <CustomScrollbars className="gx-popover-scroll overflow_tables">
                        <Table
                            className="users_list lng_eng"
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
        // cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
        onOk() {
            action(user_id)
        },
        onCancel() { },
    })
}

