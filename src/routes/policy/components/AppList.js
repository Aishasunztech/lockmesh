import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckApp,
    handleCheckAll
} from "../../../appRedux/actions/ConnectDevice";
import {SECURE_SETTING} from '../../../constants/Constants';

import { BASE_URL } from '../../../constants/Application';

import { Table, Switch, Popover, Checkbox, Icon, Avatar } from "antd";
import AppDropdown from "./AppDropdown";


class AppList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false,
            app_list: [],
            rerender: false,
            app_list_count: 0,
            selectedRowKeys: [],
            selectedRows: [],
        }

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: 'ENABLE',
                dataIndex: 'enable',
                key: '4',
            }
        ];

        this.extensionColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }
        ];
    }

    componentDidMount() {
        this.setState({
            apk_list: this.props.apk_list,
            // app_list_count: this.props.length,
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log("app list in list, nextProps", nextProps);
        // alert("componentWillReceiveProps");
        // console.log(nextProps.enableAll, 'enable all is')

        this.setState({
            apk_list: nextProps.apk_list,
            // app_list_count: this.props.length,
            guestAll: nextProps.guestAll,
            encryptedAll: nextProps.encryptedAll,
            enableAll: nextProps.enableAll
        })
    }

    componentDidUpdate(nextProps, prevState, snapshot) {
        // alert("componentDidUpdate");
        // console.log("component did update", nextProps);
    }

    handleCheckedAll = (value, key) => {

        //   console.log('check all handling', value,key);
        // console.log("handleCheckedAll");
        if (key === "guestAll") {
            key = 'guest';
        } else if (key === "encryptedAll") {
            key = 'encrypted';
        } else if (key === "enableAll") {
            key = 'enable';
        }

        if (this.props.apps) this.props.handleCheckAllAppPolicy(value, key, this.props.apps)
        else if (this.props.appPermissions) this.props.handleCheckAllAppPolicy(value, key, this.props.appPermissions)
        else if (this.props.secureSettings) this.props.handleCheckAllAppPolicy(value, key, this.props.secureSettings)

    }

    handleChecked = (e, key, app_id) => {
        if (this.props.edit) {
            console.log('handle checked is called')
            if (this.props.apps) this.props.handleEditPolicy(e, key, app_id, 'push_apps', this.props.rowId)
            else if (this.props.appPermissions) this.props.handleEditPolicy(e, key, app_id, this.props.appPermissions)
            else if (this.props.secureSettings) this.props.handleEditPolicy(e, key, app_id, this.props.secureSettings)
        } else {
            if (this.props.apps) this.props.handleCheckApp(e, key, app_id, this.props.apps)
            else if (this.props.appPermissions) this.props.handleCheckApp(e, key, app_id, this.props.appPermissions)
            else if (this.props.secureSettings) this.props.handleCheckApp(e, key, app_id, this.props.secureSettings)
        }

        // console.log(e,key,app_id);


    }

    checkAll = (keyAll, key, value) => {
        // this.state.app_list.map((app) => {
        //     app[key] = value;
        // });
        // this.props.handleCheckAll(keyAll, key, value);

        // let applications = this.state.app_list;
        // applications.forEach(app => {
        //     app[key] = value;
        // })
        // this.setState({
        //     app_list: applications
        // });

        // this.props.pushApps(this.state.app_list);
    }

    renderSingleApp = (app) => {
        //  console.log("this app", app);
        let app_id = (app.apk_id !== undefined) ? app.apk_id : app.app_id;
        let guest = (app.guest !== undefined) ? app.guest : false;
        let encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
        let enable = (app.enable !== undefined) ? app.enable : false;
        let label = (app.apk_name !== undefined) ? app.apk_name : app.label;
        let icon = (app.logo !== undefined) ? app.logo : app.icon;
        let Off = 'Off';
        let On = 'On';
        let isAvailable = (this.state.selectedRowKeys.length) ? this.state.selectedRowKeys.find(id => (id === app_id) ? true : false) : false;
        if (this.props.appPermissions) {
            app_id = app.id;
            isAvailable = true
        }
        // alert(guest);


        return ({
            key: app_id,
            app_name:
                <Fragment>
                    <Avatar src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />
                    <br />
                    <div className="line_break">{label}</div>
                </Fragment>,
            guest:
                this.props.isSwitch ?
                    <Switch
                        size="small"
                        ref={`guest_${app_id}`}
                        name={`guest_${app_id}`}
                        value={guest}
                        checked={((guest === true || guest === 1) ? true : false)}
                        // disabled={!isAvailable}
                        onClick={(e) => {
                            this.handleChecked(e, "guest", app_id)

                        }}
                    /> : <span style={{ color: (guest === true || guest === 1) ? 'green' : 'red' }}>{(guest === true || guest === 1) ? On : Off}</span>,
            encrypted:
                this.props.isSwitch ?
                    <Switch
                        size="small"
                        ref={`encrypted_${app_id}`}
                        name={`encrypted_${app_id}`}
                        // value={encrypted}
                        // disabled={app.default_app == 1 ? true : !isAvailable}
                        checked={app.default_app == 1 ? true : ((encrypted === true || encrypted === 1) ? true : false)}
                        onClick={(e) => {
                            // console.log("encrypted", e);
                            this.handleChecked(e, "encrypted", app_id);
                        }}
                    /> : <span style={{ color: (encrypted === true || encrypted === 1) ? 'green' : 'red' }} >{(encrypted === true || encrypted === 1) ? On : Off}</span>,
            enable:
                this.props.isSwitch ?
                    <Switch
                        size="small"
                        ref={`enable_${app_id}`}
                        name={`enable_${app_id}`}
                        // value={enable}
                        checked={app.default_app == 1 ? true :((enable === true || enable === 1) ? true : false)}
                        // disabled={app.default_app == 1 ? true : !isAvailable}
                        onClick={(e) => {
                            this.handleChecked(e, "enable", app_id);
                        }}
                    /> : <span style={{ color: (enable === true || enable === 1) ? 'green' : 'red' }} >{(enable === true || enable === 1) ? On : Off}</span>,
        });
    }

    renderExtensionsApp = (app) => {
        // console.log("this app", app);
        let app_id = (app.apk_id !== undefined) ? app.app_id : app.app_id;
        let guest = (app.guest !== undefined) ? app.guest : false;
        let encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
        let enable = (app.enable !== undefined) ? app.enable : false;
        let label = (app.label !== undefined) ? app.label : app.apk_name;
        let icon = (app.logo !== undefined) ? app.logo : app.icon;
        // alert(guest);

        return ({
            key: app_id,
            app_name:
                <Fragment>
                    <img src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />
                    <br />
                    <div className="line_break">{label}</div>
                </Fragment>,
            guest:
                this.props.isSwitch ?
                    <Switch
                        size="small"
                        ref={`guest_${app_id}`}
                        name={`guest_${app_id}`}
                        value={guest}
                        checked={(guest === true || guest === 1) ? true : false}

                        onClick={(e) => {
                            this.handleChecked(e, "guest", app_id);
                        }}
                    /> : <span style={{ color: (guest === true || guest === 1) ? 'green' : 'red' }} >{(guest === true || guest === 1) ? 'On' : 'Off'}</span>,
            encrypted:
                this.props.isSwitch ?
                    <Switch
                        size="small"
                        ref={`encrypted_${app_id}`}
                        name={`encrypted_${app_id}`}
                        value={encrypted}

                        checked={(encrypted === true || encrypted === 1) ? true : false}
                        onClick={(e) => {
                            // console.log("encrypted", e);
                            this.handleChecked(e, "encrypted", app_id);
                        }}
                    /> : <span style={{ color: (encrypted === true || encrypted === 1) ? 'green' : 'red' }} >{(encrypted === true || encrypted === 1) ? 'On' : 'Off'}</span>,

        });
    }

    renderApps = () => {
        // console.log('props is', this.state.apk_list)
        if (this.props.apk_list) {
            if (this.props.apk_list.length) {
                return this.props.apk_list.map(app => {
                    return this.renderSingleApp(app)
                })
            }

        }
        else if (this.props.allExtensions) {
            if (this.props.allExtensions.length) {
                return this.props.allExtensions[0]['subExtension'].map(app => {
                    return this.renderExtensionsApp(app)
                })
            }

        }
        // else {
        //     return this.props.app_list.map(app => {
        //         return this.renderSingleApp(app)
        //     })
        // }

    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
        })
        if (!this.props.edit) {
            this.props.onSelectChange(selectedRowKeys);
        }

        // console.log('selected row keys', selectedRowKeys)
    }

    renderDropdown() {
        return (
            <div className="applist_menu">
                <Checkbox checked={this.state.guestAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e.target.checked, "guestAll");
                }}>Guests All</Checkbox><br></br>
                <Checkbox checked={this.state.encryptedAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e.target.checked, "encryptedAll");
                }}>Encrypted All</Checkbox><br></br>
                {
                    this.props.apps || this.props.appPermissions ?

                        <Checkbox checked={this.state.enableAll ? true : false} onChange={(e) => {
                            this.handleCheckedAll(e.target.checked, "enableAll");
                        }}>Enable All</Checkbox> : false}
            </div>
        );
    }
    render() {
        const { loading, selectedRowKeys, selectedRows } = this.state;
        let rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
        };
        // const hasSelected = selectedRowKeys.length > 0;

        if (this.props.apps && !this.props.isSwitch) {
            rowSelection = rowSelection
        } else {
            rowSelection = null
        }

        return (

            <div>
                {/* <AppDropdown 
                    checked_app_id={this.props.checked_app_id} 
                    enableAll={this.state.enableAll} 
                    encryptedAll={this.state.encryptedAll} 
                    guestAll={this.state.guestAll} handleCheckedAll={this.handleCheckedAll} 
                /> */}
                <Popover className="list_p_down" placement="bottomRight" content={this.renderDropdown()} trigger="click">
                    <a><Icon type="ellipsis" /></a>
                </Popover>
                <Table
                    style={{ margin: 0, padding: 0 }}
                    rowSelection={rowSelection}
                    size='small'
                    scroll={this.props.isHistory ? {} : {}}
                    bordered={false}
                    columns={this.props.allExtensions ? this.extensionColumns : this.appsColumns}
                    align='center'
                    dataSource={
                        this.renderApps()
                    }
                    pagination={false}
                />

            </div>

        )
    }
}

export default AppList;
