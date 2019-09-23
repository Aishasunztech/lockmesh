import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import UserList from "./components/UserList";
import { getStatus, componentSearch, titleCase, convertToLang, handleMultipleSearch } from '../utils/commonUtils';

import { isArray } from "util";
import {
    ADMIN,
} from '../../constants/Constants'
import {
    DEVICE_ID,
} from '../../constants/DeviceConstants';


import {
    // DEVICE_ID,
    USER_ID,
    USER_NAME,
    USER_EMAIL,
    USER_DATE_REGISTERED,
    USER_TOKEN
} from '../../constants/UserConstants';

import {
    Appfilter_SearchUser, USERS_PAGE_HEADING
} from '../../constants/AppFilterConstants';


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
import { usersColumns } from '../utils/columnsUtils';

import AddUser from './components/AddUser';
import { Button_Add_User } from '../../constants/ButtonConstants';
import { Sidebar_users } from '../../constants/SidebarConstants';
var copyUsers = [];
var status = true;
// const question_txt = (
//     <div>Appuyez sur > pour afficher la liste des périphériques de cet utilisateur.
//         <p>Press <a style={{ fontSize: 14 }}><Icon type="caret-right" /> </a> to View Devices<br></br> list of this User</p>
//     </div>
// );
class Users extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     users: []
        // }
        var columns = usersColumns(props.translation, this.handleSearch);
        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            columns: columns,
            users: [],
            originalUsers: [],
            expandedRowsKeys: [],
            SearchValues: []
        }

    }

    // handleTableChange = (pagination, query, sorter) => {
    //     // 
    //     const sortOrder = sorter.order || "ascend";
    //     this.state.columns = usersColumns(sortOrder, this.props.translation, this.handleSearch);
    // };

    handleTableChange = (pagination, query, sorter) => {
        // 
        let { columns } = this.state;

        columns.forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }

    componentDidMount() {
        this.props.getUserList();
        this.props.getPagination('users');
        // 
        this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
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
            
            this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + nextProps.users_list.length + ')'
            // 
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
            // 
            // this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
            })
        }
        if (this.props.translation !== prevProps.translation) {
            this.setState({
                columns: usersColumns(this.props.translation, this.handleSearch)
            });
        }
    }




    handleComponentSearch = (value) => {
        //       
        try {
            if (value.length) {

                // 

                if (status) {
                    // 
                    copyUsers = this.state.users;
                    status = false;
                }
                // 
                let foundUsers = componentSearch(copyUsers, value);
                // 
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
                    users: copyUsers,
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
        // 
    }


    handleSearch2 = (e) => {
        let demoUsers = [];
        copyUsers = JSON.parse(JSON.stringify(this.state.originalUsers));
        let expandedRowsKeys = [];

        if (e.target.value.length) {

            copyUsers.forEach((user) => {
                //  
                if (user['devicesList'].length > 0) {
                    let demoDeviceList = [];
                    for (let device of user['devicesList']) {

                        if (device[e.target.name] !== undefined && device[e.target.name] !== null) {
                            if ((typeof device[e.target.name]) === 'string') {
                                // 

                                if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                                    demoDeviceList.push(device);
                                }
                            }
                            else if (device[e.target.name] !== null) {
                                // 
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
                    // 

                    if (demoDeviceList.length > 0) {
                        user.devicesList = demoDeviceList;
                        demoUsers.push(user);
                        expandedRowsKeys.push(user.user_id);

                    }

                }

            });
            //  
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
        // 
        // 

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };

        let response = handleMultipleSearch(e, status, copyUsers, this.state.SearchValues, this.state.users)

        
        this.setState({
            users: response.demoData,
            SearchValues: response.SearchValues
        });
        status = response.copy_status;
        copyUsers = response.copyRequireSearchData;


        // let demoUsers = [];
        // let demoSearchValues = this.state.SearchValues;
        // if (status) {
        //     coppyUsers = this.state.users;
        //     status = false;
        // }
        // // 

        // let targetName = e.target.name;
        // let targetValue = e.target.value;

        // if (targetValue.length || Object.keys(demoSearchValues).length) {
        //     demoSearchValues[targetName] = { key: targetName, value: targetValue };
        //     this.state.SearchValues[targetName] = { key: targetName, value: targetValue };
        //     // 
        //     // 
        //     // 
        //     coppyUsers.forEach((user) => {
        //         // 

        //         // if (user[e.target.name] !== undefined) {

        //         let searchColsAre = Object.keys(demoSearchValues).length;
        //         let searchUsers = 0;
        //         // if (typeof (user[targetName]) === 'string' && user[targetName] !== null && user[targetName] !== undefined) {
        //         // 

        //         if (searchColsAre > 0) {
        //             Object.values(demoSearchValues).forEach((data) => {

        //                 if (typeof (user[data.key]) === 'string' && user[data.key] !== null && user[data.key] !== undefined) {

        //                     if (data.value == "") {
        //                         searchUsers++;
        //                     } else if (user[data.key]) {
        //                         if (user[data.key].toUpperCase().includes(data.value.toUpperCase())) {
        //                             searchUsers++;
        //                         }
        //                     }
        //                 } else if (isArray(user[data.key])) {
        //                     if (user[data.key].length.toString().toUpperCase().includes(data.value.toUpperCase())) {
        //                         searchUsers++;
        //                     }
        //                 }

        //             })

        //             if (searchColsAre === searchUsers) {
        //                 demoUsers.push(user);
        //             }

        //         } else {
        //             if (user[targetName].toUpperCase().includes(targetValue.toUpperCase())) {
        //                 demoUsers.push(user);
        //             }
        //         }


        //     });
        //     //  
        //     this.setState({
        //         users: demoUsers,
        //         SearchValues: demoSearchValues
        //     })
        // } else {
        //     this.setState({
        //         users: coppyUsers,
        //         SearchValues: demoSearchValues
        //     })
        // }
    }

    // handleSearch = (e) => {
    //     // 
    //     // 

    //     let demoUsers = [];
    //     if (status) {
    //         coppyUsers = this.state.users;
    //         status = false;
    //     }
    //     //   

    //     if (e.target.value.length) {
    //         // 
    //         // 
    //         // 
    //         coppyUsers.forEach((user) => {
    //              

    //             if (user[e.target.name] !== undefined) {
    //                 if ((typeof user[e.target.name]) === 'string') {
    //                     // 
    //                     if (user[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
    //                         demoUsers.push(user);
    //                     }
    //                 } else if (user[e.target.name] !== null) {
    //                     // 
    //                     if (user[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
    //                         demoUsers.push(user);
    //                     }
    //                 } else {
    //                     // demoUsers.push(user);
    //                 }
    //             } else {
    //                 demoUsers.push(user);
    //             }
    //         });
    //         //  
    //         this.setState({
    //             users: demoUsers
    //         })
    //     } else {
    //         this.setState({
    //             users: coppyUsers
    //         })
    //     }
    // }

    render() {
        this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.state.users.length + ')'
        // 
        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchUser], "Search")}
                    defaultPagingValue={this.state.defaultPagingValue}
                    addButtonText={convertToLang(this.props.translation[Button_Add_User], "Add User")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={this.props.user.type !== ADMIN}
                    isAddUserButton={true}
                    // AddPolicyModel={true}
                    handleUserModal={this.handleUserModal}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    translation={this.props.translation}
                    pageHeading={convertToLang(this.props.translation[Sidebar_users], "Users")}
                />
                <AddUser ref="add_user" translation={this.props.translation} />
                <UserList
                    onChangeTableSorting={this.handleTableChange}
                    editUser={this.props.editUser}
                    deleteUser={this.props.deleteUser}
                    undoDeleteUser={this.props.undoDeleteUser}
                    location={this.props.location}
                    columns={this.state.columns}
                    users={this.state.users}
                    expandedRowsKey={this.state.expandedRowsKeys}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    consoled={this.consoled}
                    translation={this.props.translation}
                    user={this.props.user}
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
var mapStateToProps = ({ auth, users, devices, settings }) => {
    // 
    return {
        user: auth.authUser,
        users_list: users.users_list,
        DisplayPages: devices.DisplayPages,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);