import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import UserList from "./components/UserList";
import { getStatus, componentSearch, titleCase } from '../utils/commonUtils';


import {
    ADMIN,
} from '../../constants/Constants'
import {
    USER_ID
} from '../../constants/DeviceConstants';

import {
    addUser,
    editUser,
    getUserList,
    deleteUser,
    undoDeleteUser
} from "../../appRedux/actions/Users";

import {
    postPagination,
    getPagination

} from "../../appRedux/actions/Common";
import AddUser from './components/AddUser';
var coppyUsers = [];
var status = true;
const question_txt = (
    <div>
        <p>Press <a style={{ fontSize: 14 }}><Icon type="caret-right" /> </a> to View Devices<br></br> list of this User</p>
    </div>
);
class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
        this.columns = [
            {
                title: '#',
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
            },
            {
                title: 'ACTION',
                align: "center",
                dataIndex: 'action',
                key: "action",
            },
            {
                title: (
                    <Input.Search
                        name="user_id"
                        key="user_id"
                        id="user_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(USER_ID)}
                    />
                ),
                dataIndex: 'user_id',
                className: '',
                children: [
                    {
                        title: USER_ID,
                        align: "center",
                        dataIndex: 'user_id',
                        key: "user_id",
                        className: '',
                        sorter: (a, b) => {
                            // console.log(a, 'user is is')
                            return a.user_id.localeCompare(b.user_id)
                        },

                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <div>
                        <Input.Search
                            name="device_id"
                            key="device_id"
                            id="device_id"
                            className="search_heading"
                            autoComplete="new-password"
                            onKeyUp={this.handleSearch2}
                            placeholder={'Search By Device Id'}
                        />
                    </div>
                ),
                dataIndex: 'devices',
                className: 'row',
                children: [
                    {
                        title: (
                            <span>
                                DEVICES
                                <Popover placement="top" content={question_txt}>
                                    <span className="helping_txt"><Icon type="info-circle" /></span>
                                </Popover>
                            </span>
                        ),
                        align: "center",
                        dataIndex: 'devices',
                        key: "devices",
                        className: 'row',
                        onFilter: (value, record) => record.devices.indexOf(value) === 0,
                        sorter: (a, b) => { return a.devices - b.devices },
                    
                        // sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="user_name"
                        key="user_name"
                        id="user_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Name"
                    />
                ),
                dataIndex: 'user_name',
                className: 'row',
                children: [{
                    title: 'NAME',
                    dataIndex: 'user_name',
                    align: "center",
                    key: 'user_name',
                    className: '',
                    sorter: (a, b) => { return a.user_name.localeCompare(b.user_name) },
                    sortDirections: ['ascend', 'descend'],
                }]
            },
            {
                title: (
                    <Input.Search
                        name="email"
                        key="email"
                        id="email"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Email"
                    />
                ),
                dataIndex: 'email',
                className: 'row',
                children: [{
                    title: 'EMAIL',
                    dataIndex: 'email',
                    align: "center",
                    key: 'email',
                    className: '',
                    sorter: (a, b) => { return a.email.localeCompare(b.email.toString()) },
                    sortDirections: ['ascend', 'descend'],

                }]
            },
            {
                title: 'TOKENS',
                align: "center",
                dataIndex: 'tokens',
                key: "tokens",
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Date Registered"
                    />
                ),
                dataIndex: 'created_at',
                className: 'row',
                children: [{
                    title: 'DATE REGISTERED',
                    dataIndex: 'created_at',
                    align: "center",
                    key: 'created_at',
                    className: '',
                    sorter: (a, b) => { return a.created_at.localeCompare(b.created_at.toString()) },
                    sortDirections: ['ascend', 'descend'],

                }]
            },
        ];
        this.state = {
            users: [],
            originalUsers: [],
            expandedRowsKeys: [],
        }

    }

    componentDidMount() {
        this.props.getUserList();
        this.props.getPagination('users');
        // console.log(this.props.location.state);
        this.columns[2].children[0].title = USER_ID + ' (' + this.props.users_list.length + ')'
        this.setState({
            users: this.props.users_list,
            originalUsers: this.props.users_list,
            expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
        })
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.users_list !== this.props.users_list) {
            this.columns[2].children[0].title = USER_ID + ' (' + nextProps.users_list.length + ')'
            // console.log('will recice props is called', nextProps.users_list)
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                users: nextProps.users_list,
                originalUsers: nextProps.users_list,
                expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
            })

        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.DisplayPages);
            this.columns[2].children[0].title = USER_ID + ' (' + this.props.users_list.length + ')'
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
            })
        }
    }




    handleComponentSearch = (value) => {
        //    console.log('values sr', value)   
        try {
            if (value.length) {

                // console.log('length')

                if (status) {
                    // console.log('status')
                    coppyUsers = this.state.users;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundUsers = componentSearch(coppyUsers, value);
                // console.log('found devics', foundUsers)
                if (foundUsers.length) {
                    this.setState({
                        users: foundUsers,
                    })
                } else {
                    this.setState({
                        users: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    users: coppyUsers,
                })
            }
        } catch (error) {
            // alert("hello");
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

    consoled = () => {
        // console.log('rendered row is ', this.refs)
    }


    handleSearch2 = (e) => {
        let demoUsers = [];
        coppyUsers = JSON.parse(JSON.stringify(this.state.originalUsers));
        let expandedRowsKeys = [];

        if (e.target.value.length) {

            coppyUsers.forEach((user) => {
                //  console.log("user", user[e.target.name] !== undefined);
                if (user['devicesList'].length > 0) {
                    let demoDeviceList = [];
                    for (let device of user['devicesList']) {

                        if (device[e.target.name] !== undefined && device[e.target.name] !== null) {
                            if ((typeof device[e.target.name]) === 'string') {
                                // console.log("string check", typeof device[e.target.name])

                                if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                                    demoDeviceList.push(device);
                                }
                            }
                            else if (device[e.target.name] != null) {
                                // console.log("else null check", user[e.target.name])
                                // if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                                //     demoDeviceList.push(device);
                                // }
                            } else {
                                // demoUsers.push(user);
                            }
                        } else {
                            // demoUsers.push(user);
                        }
                    }
                    // console.log('array of device will b', demoDeviceList);

                    if (demoDeviceList.length > 0) {
                        user.devicesList = demoDeviceList;
                        demoUsers.push(user);
                        expandedRowsKeys.push(user.user_id);

                    }

                }

            });
            //  console.log(this.state.originalUsers, "searched value", demoUsers);
            this.setState({
                users: demoUsers,
                expandedRowsKeys: expandedRowsKeys
            })
        } else {
            this.setState({
                users: this.state.originalUsers,
                expandedRowsKeys: []
            })
        }
    }

    handleSearch = (e) => {
        // console.log('============ check search value ========')
        // console.log(e.target.name , e.target.value);

        let demoUsers = [];
        if (status) {
            coppyUsers = this.state.users;
            status = false;
        }
        //   console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            coppyUsers.forEach((user) => {
                //  console.log("user", user[e.target.name] !== undefined);

                if (user[e.target.name] !== undefined) {
                    if ((typeof user[e.target.name]) === 'string') {
                        // console.log("string check", user[e.target.name])
                        if (user[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoUsers.push(user);
                        }
                    } else if (user[e.target.name] != null) {
                        // console.log("else null check", user[e.target.name])
                        if (user[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoUsers.push(user);
                        }
                    } else {
                        // demoUsers.push(user);
                    }
                } else {
                    demoUsers.push(user);
                }
            });
            //  console.log("searched value", demoUsers);
            this.setState({
                users: demoUsers
            })
        } else {
            this.setState({
                users: coppyUsers
            })
        }
    }

    render() {
        // console.log(this.state.expandedRowsKeys, 'refs is');
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
                    editUser={this.props.editUser}
                    deleteUser={this.props.deleteUser}
                    undoDeleteUser={this.props.undoDeleteUser}
                    location={this.props.location}
                    columns={this.columns}
                    users={this.state.users}
                    expandedRowsKey={this.state.expandedRowsKeys}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    consoled={this.consoled}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUser: addUser,
        editUser: editUser,
        deleteUser: deleteUser,
        undoDeleteUser: undoDeleteUser,
        getUserList: getUserList,
        postPagination: postPagination,
        getPagination: getPagination
    }, dispatch);
}
var mapStateToProps = ({ auth, users, devices }) => {
    // console.log(users.users_list);
    return {
        user: auth.authUser,
        users_list: users.users_list,
        DisplayPages: devices.DisplayPages,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);