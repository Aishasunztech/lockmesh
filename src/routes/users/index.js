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
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    render() {
        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder="Search User"
                    defaultPagingValue={10}
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
                    users={[]}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUser: addUser,
        getUserList: getUserList
    }, dispatch);
}
var mapStateToProps = ({ auth, users }) => {
    return {
        user: auth.authUser,
        users_list: users.users_list
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);