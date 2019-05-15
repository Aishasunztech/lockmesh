import React, { Component } from 'react';
import { Tabs, Table, Switch } from 'antd';
import Permissions from "./Permissions";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, POLICY_DETAILS } from '../../../constants/Constants';
import AppList from "./AppList";

const TabPane = Tabs.TabPane;
const columnsSystemPermission = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
}];

const columnsPolicyDetail = [{
    title: 'Policy Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Policy Note',
    dataIndex: 'note',
    key: 'note',
}, {
    title: 'Policy Command',
    dataIndex: 'command',
    key: 'command',
}];


export default class PolicyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '1',
            policy: [],
        }

    }

    // renderSystemPermissions = () => {
    //     if (this.state.policy.controls) {
    //         if (this.state.policy.controls.length) {
    //             return this.state.policy.controls.map((item, index) => {
    //                 // console.log('object, ', item)
    //                 return {
    //                     rowKey: index,
    //                     name: item.name,
    //                     action: <span style={{ color: (item.value === true || item.value === 1) ? 'green' : 'red' }} >{(item.value === true || item.value === 1) ? 'On' : 'Off'}</span>
    //                 }

    //             })
    //         }
    //     }

    // }

    renderSystemPermissions = (controls) => {
        if (controls) {

            return [{
                rowKey: 'wifi_status',
                name: 'Wifi',
                action: this.props.isSwitch ?
                    <Switch disabled checked={controls.wifi_status} onClick={(e) => this.props.handleEditPolicy(e, 'wifi_status', '', 'push_apps', this.props.rowId)} size="small" />
                    : <span style={{ color: (controls.wifi_status === true || controls.wifi_status === 1) ? 'green' : 'red' }} >{(controls.wifi_status === true || controls.wifi_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'bluetooth_status',
                name: 'Bluetooth',
                action: this.props.isSwitch ?
                    <Switch checked={controls.bluetooth_status} onClick={(e) => this.props.handleEditPolicy(e, 'bluetooth_status', '', 'controls', this.props.rowId)} size="small" />
                    : <span style={{ color: (controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'green' : 'red' }} >{(controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'screenshot_status',
                name: 'ScreenShot',
                action: this.props.isSwitch ? <Switch checked={controls.screenshot_status} onClick={(e) => this.props.handleEditPolicy(e, 'screenshot_status', '', 'controls', this.props.rowId)} size="small" />
                    : <span style={{ color: (controls.screenshot_status === true || controls.screenshot_status === 1) ? 'green' : 'red' }} >{(controls.screenshot_status === true || controls.screenshot_status === 1) ? 'On' : 'Off'}</span>

            }, {
                rowKey: 'location_status',
                name: 'Location',
                action: this.props.isSwitch ? <Switch checked={controls.location_status} onClick={(e) => this.props.handleEditPolicy(e, 'location_status', '', 'controls', this.props.rowId)} size="small" />
                    : <span style={{ color: (controls.location_status === true || controls.location_status === 1) ? 'green' : 'red' }} >{(controls.location_status === true || controls.location_status === 1) ? 'On' : 'Off'}</span>

            }, {
                rowKey: 'hotspot_status',
                name: 'Hotspot',
                action: this.props.isSwitch ? <Switch checked={controls.hotspot_status} onClick={(e) => this.props.handleEditPolicy(e, 'hotspot_status', '', 'controls', this.props.rowId)} size="small" />
                    : <span style={{ color: (controls.hotspot_status === true || controls.hotspot_status === 1) ? 'green' : 'red' }} >{(controls.hotspot_status === true || controls.hotspot_status === 1) ? 'On' : 'Off'}</span>

            }]
        }
        // console.log(this.state.systemPermissions, 'permissions')
        // if (this.state.systemPermissions.length) {
        //     return this.state.systemPermissions.map((item, index) => {
        //         // console.log('object, ', item)
        //         return {
        //             rowKey: index,
        //             name: item.name,
        //             action: <Switch disabled={item.name == 'Wifi' ? true : false} checked={item.value} onClick={(e) => this.props.handleChekSystemPermission(e, item.name)} size="small" />
        //         }

        //     })
        // }
    }


    componentDidMount() {
        this.setState({
            selected: this.props.selected,
            policy: this.props.policy
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            console.log(this.props, 'object updated', nextProps)
            this.setState({
                selected: nextProps.selected,
            })
        }
        if (this.props.policy !== nextProps.policy) {
            this.setState({
                policy: nextProps.policy
            })
        }
    }

    callback = (key) => {
        this.setState({ selected: key })
    }

    render() {
        // console.log('info list is ', this.props.policy.push_apps)

        const PolicyDetail = [{
            key: 1,
            name: this.state.policy.policy_name,
            note: this.state.policy.policy_note,
            command: this.state.policy.policy_command,

        }]
        // console.log(this.state.policy);
        return (
            <div>
                <Tabs onChange={this.callback} activeKey={this.state.selected} type="card">
                    <TabPane tab="Selected Apps " key="1">
                        <AppList
                            apk_list={this.state.policy.push_apps}
                            handleCheckApp={this.handleCheckApp}
                            handleEditPolicy={this.props.handleEditPolicy}
                            handleCheckAll={this.props.handleCheckAll}
                            guestAll={this.props.guestAlldealerApps}
                            encryptedAll={this.props.encryptedAlldealerApps}
                            enableAll={this.props.enableAlldealerApps}
                            apps='dealerApps'
                            isSwitch={this.props.isSwitch}
                            edit={this.props.edit}
                            rowId={this.props.rowId}
                        />
                    </TabPane>
                    <TabPane tab={APPLICATION_PERMISION} key="2">
                        <AppList
                            apk_list={this.state.policy.app_list}
                            handleEditPolicy={this.props.handleEditPolicy}
                            handleCheckAll={this.props.handleCheckAll}
                            handleCheckApp={this.handleCheckApp}
                            appPermissions='appPermissions'
                            guestAll={this.props.guestAllappPermissions}
                            encryptedAll={this.props.encryptedAllappPermissions}
                            enableAll={this.props.enableAllappPermissions}
                            isSwitch={this.props.isSwitch}
                            edit={this.props.edit}
                            rowId={this.props.rowId}
                        />
                    </TabPane>
                    <TabPane tab={SECURE_SETTING_PERMISSION} key="3">
                        <AppList
                            allExtensions={this.state.policy.secure_apps}
                            handleEditPolicy={this.props.handleEditPolicy}
                            handleCheckAll={this.props.handleCheckAll}
                            handleCheckApp={this.handleCheckApp}
                            secureSettings='allExtensions'
                            guestAll={this.props.guestAllallExtensions}
                            encryptedAll={this.props.encryptedAllallExtensions}
                            enableAll={this.props.enableAllallExtension}
                            
                            isSwitch={this.props.isSwitch}
                            edit={this.props.edit}
                            rowId={this.props.rowId}
                        />
                    </TabPane>
                    <TabPane tab={SYSTEM_PERMISSION} key="4">
                        <Table
                            pagination={false}
                            dataSource={this.renderSystemPermissions(this.state.policy.controls)}
                            size="small"
                            columns={columnsSystemPermission}>
                        </Table>
                    </TabPane>
                    <TabPane tab={POLICY_DETAILS} key="5">
                        <Table
                            pagination={false}
                            dataSource={PolicyDetail}
                            size="small"
                            columns={columnsPolicyDetail}>
                        </Table>
                    </TabPane>
                    <TabPane tab="Dealer Permissions" key="6">
                        <Permissions
                            record={this.props.policy}
                        />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}