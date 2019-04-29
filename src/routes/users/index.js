import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import UserList from "./components/UserList";

import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_TRIAL
} from '../../constants/Constants'

import {
    addUser,
    getUserList
} from "../../appRedux/actions/Users";

import {
    postPagination,
    getPagination

} from "../../appRedux/actions/Common";

import AddUser from './components/AddUser';

class Users extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'ACTION',
                align: "center",
                dataIndex: 'action',
                key: "action",
            },
            {
                title: (
                    <span>
                        User ID
                    {/* <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>),
                dataIndex: 'user_id',
                key: 'user_id',
                className: 'row'
            },
            {
                title: (
                    <span>
                        DEVICES
                    <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover>
                    </span>),
                dataIndex: 'devices',
                key: 'devices',
                className: 'row'
            },
            {
                title: (
                    <span>
                        Name
                    {/* <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>),
                dataIndex: 'user_name',
                key: 'user_name',
                className: 'row'
            },
            {
                title: (
                    <span>
                        Email
                    {/* <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>),
                dataIndex: 'user_email',
                key: 'user_email',
                className: 'row'
            },
            {
                title: 'TOKENS',
                align: "center",
                dataIndex: 'tokens',
                key: "tokens",
            },
        ];
        this.state = {
            users: []
        }

    }

    componentDidMount() {
        this.props.getUserList();
        this.props.getPagination('users');
        this.setState({
            users: this.props.users_list
        })
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.users_list !== this.props.users_list) {
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                users: nextProps.users_list
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.DisplayPages);
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
            })
        }
    }
    handlePagination = (value) => {
        this.refs.userList.handlePagination(value);
        this.props.postPagination(value, 'users');
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    render() {
        // console.log(this.props.DisplayPages);
        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder="Search User"
                    defaultPagingValue={this.state.defaultPagingValue}
                    addButtonText={"Add User"}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={this.props.user.type !== ADMIN}
                    // AddPolicyModel={true}
                    handleUserModal={this.handleUserModal}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                />
                <AddUser ref="add_user" />
                <UserList
                    columns={this.columns}
                    users={this.state.users}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUser: addUser,
        getUserList: getUserList,
        postPagination: postPagination,
        getPagination: getPagination
    }, dispatch);
}
var mapStateToProps = ({ auth, users, devices }) => {
    console.log(users.users_list);
    return {
        user: auth.authUser,
        users_list: users.users_list,
        DisplayPages: devices.DisplayPages,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);