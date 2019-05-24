import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckApp,
    handleCheckAll
} from "../../../appRedux/actions/ConnectDevice";
import { SECURE_SETTING } from '../../../constants/Constants';

import { BASE_URL } from '../../../constants/Application';

import { Table, Switch, Popover, Checkbox, Icon, Avatar, Button, Row, Col } from "antd";
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
            selectedRowKeysApps: [],
            selectedRowKeysPermissios: [],
        }

        this.appsColumns2 = [
            {
                title: 'Action',
                dataIndex: 'action',
                key: '5',
                // render: text => <a href="javascript:;">{text}</a>,
            }, {
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
        // console.log(this.props.encryptedAll, 'dsdddddddddddddd')
        this.setState({
            apk_list: this.props.apk_list,
            // app_list_count: this.props.length,
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll
        });
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.encryptedAll, 'ffffffffffffff')

        if (this.props !== nextProps) {
            this.setState({
                apk_list: nextProps.apk_list,
                allExtensions: nextProps.allExtensions,
                // app_list_count: this.props.length,
                guestAll: nextProps.guestAll,
                encryptedAll: nextProps.encryptedAll,
                enableAll: nextProps.enableAll
            })
        }

    }

    handleCheckedAll = (value, key) => {

        //   console.log('check all handling', value,key);
        console.log("handleCheckedAll");
        if (key === "guestAll") {
            key = 'guest';
        } else if (key === "encryptedAll") {
            key = 'encrypted';
        } else if (key === "enableAll") {
            key = 'enable';
        }

        if (this.props.edit) {
            // console.log('this.props.edit')
            if (this.props.apps) this.props.handleCheckAll(value, key, this.props.apps, '', this.props.rowId)
            else if (this.props.appPermissions) this.props.handleCheckAll(value, key, this.props.appPermissions, '', this.props.rowId)
            else if (this.props.secureSettings) this.props.handleCheckAll(value, key, this.props.secureSettings, SECURE_SETTING, this.props.rowId)
        } else {

            if (this.props.apps) this.props.handleCheckAllAppPolicy(value, key, this.props.apps)
            else if (this.props.appPermissions) this.props.handleCheckAllAppPolicy(value, key, this.props.appPermissions)
            else if (this.props.secureSettings) this.props.handleCheckAllAppPolicy(value, key, this.props.secureSettings)
        }


    }

    handleChecked = (e, key, app_id) => {
        if (this.props.edit) {
            console.log('handle checked is called', e, key, app_id, this.props.rowId)
            if (this.props.apps) this.props.handleEditPolicy(e, key, app_id, 'push_apps', this.props.rowId)
            else if (this.props.appPermissions) this.props.handleEditPolicy(e, key, app_id, 'app_list', this.props.rowId)
            else if (this.props.secureSettings) this.props.handleEditPolicy(e, key, app_id, 'secure_apps', this.props.rowId, SECURE_SETTING)
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

    removeItem = (app) => {
        let dataType = this.props.pageType=='dealerApps' ? 'push_apps' : 'appPermissions';
        this.props.removeAppsFromPolicies(app.apk_id, this.props.rowId, dataType)
    }

    renderSingleApp = (app) => {
        //  console.log("this app", app);
        let app_id = (app.apk_id !== undefined) ? app.apk_id : app.app_id;
        let guest = (app.guest !== undefined) ? app.guest : false;
        let encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
        let enable = (app.enable !== undefined) ? app.enable : false;
        let label = (app.apk_name !== undefined) ? app.apk_name : app.label;
        let icon = (app.logo !== undefined) ? app.logo : app.icon;
        let Off = 'OFF';
        let On = 'ON';
        let isAvailable = true;
        if (this.props.appPermissions) {
            app_id = app.id;
            // isAvailable = true
        }
        if (this.props.pageType === 'dealerApps' && this.props.isCheckbox) {
            isAvailable = (this.state.selectedRowKeysApps.length) ? this.state.selectedRowKeysApps.find(id => (id === app_id) ? true : false) : false;
        } else if (this.props.pageType === 'appPermissions') {
            isAvailable = (this.state.selectedRowKeysPermissios.length) ? this.state.selectedRowKeysPermissios.find(id => (id === app_id) ? true : false) : false;

        }

        return ({
            key: app_id,
            action: <Button size='small' onClick={() => this.removeItem(app)}  >Remove</Button>,
            app_name:
                <Fragment>
                    <Avatar src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />

                    <div className="line_break2">{label}</div>
                </Fragment>,
            guest:
                // this.props.isSwitch ?
                <Switch
                    size="small"
                    ref={`guest_${app_id}`}
                    name={`guest_${app_id}`}
                    value={guest}
                    checked={this.props.edit ? ((guest === true || guest === 1) ? true : false) : (isAvailable ? ((guest === true || guest === 1) ? true : false) : false)}
                    disabled={this.props.isSwitch ? this.props.isCheckbox ? !isAvailable : false : true}
                    onClick={(e) => {
                        this.handleChecked(e, "guest", app_id)

                    }}
                />,
            // : <span style={{ color: (guest === true || guest === 1) ? 'green' : 'red' }}>{(guest === true || guest === 1) ? On : Off}</span>,
            encrypted:
                // this.props.isSwitch ?
                <Switch
                    size="small"
                    ref={`encrypted_${app_id}`}
                    name={`encrypted_${app_id}`}
                    // value={encrypted}
                    disabled={this.props.isSwitch ? this.props.isCheckbox ? app.default_app == 1 ? true : !isAvailable : false : true}
                    checked={app.default_app == 1 ? true : this.props.edit ? ((encrypted === true || encrypted === 1) ? true : false) : (isAvailable ? ((encrypted === true || encrypted === 1) ? true : false) : false)}
                    onClick={(e) => {
                        // console.log("encrypted", e);
                        this.handleChecked(e, "encrypted", app_id);
                    }}
                />,
            //  : <span style={{ color: (encrypted === true || encrypted === 1) ? 'green' : 'red' }} >{(encrypted === true || encrypted === 1) ? On : Off}</span>,
            enable:
                // this.props.isSwitch ?
                <Switch
                    size="small"
                    ref={`enable_${app_id}`}
                    name={`enable_${app_id}`}
                    // value={enable}
                    checked={app.default_app == 1 ? true : this.props.edit ? ((enable === true || enable === 1) ? true : false) : (isAvailable ? ((enable === true || enable === 1) ? true : false) : false)}
                    disabled={this.props.isSwitch ? this.props.isCheckbox ? app.default_app == 1 ? true : !isAvailable : false : true}
                    onClick={(e) => {
                        this.handleChecked(e, "enable", app_id);
                    }}
                />
            //  : <span style={{ color: (enable === true || enable === 1) ? 'green' : 'red' }} >{(enable === true || enable === 1) ? On : Off}</span>,
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
                    <Avatar className="perm_icons" src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />

                    <div className="line_break2">{label}</div>
                </Fragment>,
            guest:
                // this.props.isSwitch ?
                <Switch
                    size="small"
                    ref={`guest_${app_id}`}
                    name={`guest_${app_id}`}
                    value={guest}
                    checked={(guest === true || guest === 1) ? true : false}
                    disabled={this.props.isSwitch ? false : true}
                    onClick={(e) => {
                        this.handleChecked(e, "guest", app_id);
                    }}
                />,
            //  : <span style={{ color: (guest === true || guest === 1) ? 'green' : 'red' }} >{(guest === true || guest === 1) ? 'ON' : 'OFF'}</span>,
            encrypted:
                // this.props.isSwitch ?
                <Switch
                    size="small"
                    ref={`encrypted_${app_id}`}
                    name={`encrypted_${app_id}`}
                    value={encrypted}
                    disabled={this.props.isSwitch ? false : true}
                    checked={(encrypted === true || encrypted === 1) ? true : false}
                    onClick={(e) => {
                        // console.log("encrypted", e);
                        this.handleChecked(e, "encrypted", app_id);
                    }}
                />
            // : <span style={{ color: (encrypted === true || encrypted === 1) ? 'green' : 'red' }} >{(encrypted === true || encrypted === 1) ? 'ON' : 'OFF'}</span>,

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
            // console.log('a;; extension', this.props.allExtensions)
            if (this.props.allExtensions.length) {
                if (this.props.AddPolicy) {

                    return this.props.allExtensions[0]['subExtension'].map(app => {
                        return this.renderExtensionsApp(app)
                    })
                } else {
                    return this.props.allExtensions.map(app => {
                        return this.renderExtensionsApp(app)
                    })
                }

            }
        }

    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        if (this.props.pageType == 'dealerApps') {
            this.setState({
                selectedRowKeysApps: selectedRowKeys,
                selectedRows: selectedRows
            }, () => {
                if (!this.props.edit) {
                    this.props.onSelectChange(this.state.selectedRowKeysApps, this.props.pageType);
                }
            })
        } else {
            this.setState({
                selectedRowKeysPermissios: selectedRowKeys,
                selectedRows: selectedRows
            }, () => {
                if (!this.props.edit) {
                    this.props.onSelectChange(this.state.selectedRowKeysPermissios, this.props.pageType);
                }
            })
        }

    }

    // renderDropdown() {
    //     return (
    //         <div className="applist_menu" >
    //             <Switch value={this.state.guestAll ? true : false}
    //                 checkedChildren='Enable All Guests'
    //                 unCheckedChildren='Disable All Guests'
    //                 onChange={(e) => {
    //                     this.handleCheckedAll(e.target.checked, "guestAll");
    //                 }} />
    //             <Switch value={this.state.encryptedAll ? true : false}
    //                 checkedChildren='Enable All Encrypted'
    //                 unCheckedChildren='Disable All Encrypted'
    //                 onChange={(e) => {
    //                     this.handleCheckedAll(e.target.checked, "encryptedAll");
    //                 }} />
    //             {
    //                 this.props.apps || this.props.appPermissions ?

    //                     <Switch checked={this.state.enableAll ? true : false}
    //                         checkedChildren='Enable All'
    //                         unCheckedChildren='Disable All'
    //                         onChange={(e) => {
    //                             this.handleCheckedAll(e.target.checked, "enableAll");
    //                         }} /> : false}
    //         </div>
    //     );
    // }
    render() {
        // console.log('ap list ', this.state.encryptedAll, this.state.enableAll, this.state.guestAll)
        const { loading, selectedRowKeys, selectedRows, selectedRowKeysApps, selectedRowKeysPermissios } = this.state;
        let rowSelection = {
            selectedRowKeys: this.props.pageType == 'dealerApps' ? selectedRowKeysApps : selectedRowKeysPermissios,
            selectedRows,
            onChange: this.onSelectChange,
        };
        // const hasSelected = selectedRowKeys.length > 0;

        if ((this.props.apps || this.props.appPermissions) && this.props.isSwitch && this.props.isCheckbox) {
            rowSelection = rowSelection
        } else {
            rowSelection = null
        }

        return (

            <div>
                {/* {this.props.isSwitch ?
                    <Popover className="list_p_down1" placement="bottomRight" content={this.renderDropdown()} trigger="click">
                        <a><Icon type="ellipsis" /></a>
                    </Popover> : false} */}

                {
                    this.props.isCheckAllButtons ?

                        <div className="applist_menu" style={{ marginBottom: 10, }}>
                            <Row>
                                <Col span={6}>
                                    <span>Guest All</span>

                                    <Switch checked={this.state.guestAll ? true : false}
                                        size='small'

                                        onChange={(e) => {
                                            this.handleCheckedAll(e, "guestAll");
                                        }} />
                                </Col>
                                <Col span={6}>
                                    <span>Encrypted All</span>
                                    <Switch checked={this.state.encryptedAll ? true : false}
                                        size='small'
                                        // defaultChecked={this.state.encryptedAll}
                                        onChange={(e) => {
                                            this.handleCheckedAll(e, "encryptedAll");
                                        }} />
                                </Col>
                                <Col span={6}>
                                    {

                                        this.props.apps || this.props.appPermissions ?
                                            <div>
                                                <span>Enable All</span>
                                                <Switch checked={this.state.enableAll ? true : false}
                                                    size='small'

                                                    onChange={(e) => {
                                                        this.handleCheckedAll(e, "enableAll");
                                                    }} />
                                            </div>
                                            : false}
                                </Col>
                                <Col span={6}>
                                    {
                                        this.props.addAppsButton ?
                                            this.props.apps ?
                                                <Button onClick={() => this.props.addApps('push_apps')} >Add Push Apps</Button>
                                                : this.props.appPermissions ?
                                                    <Button onClick={() => this.props.addApps('app_list')} >Add Permissions</Button>
                                                    : false
                                            : false

                                    }
                                </Col>
                            </Row>

                        </div> : false
                }
                <Table
                    className="exp_policy"
                    style={{ margin: 0, padding: 0 }}
                    rowSelection={rowSelection}
                    selectedRowKeys={this.props.pageType == 'dealerApps' ? this.state.selectedRowKeysApps : this.state.selectedRowKeysPermissios}
                    size='small'
                    scroll={this.props.isHistory ? {} : {}}
                    columns={this.props.allExtensions ? this.extensionColumns : this.props.addAppsButton ? this.appsColumns2 : this.appsColumns}
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
