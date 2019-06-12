import React, { Component } from 'react';
import { Tabs, Table, Switch, Row, Col, } from 'antd';
import Permissions from "./Permissions";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, POLICY_DETAILS, SYSTEM_CONTROLS_UNIQUE, SECURE_SETTING } from '../../../constants/Constants';
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
             system_setting_app :'',
             secure_setting_app :'',
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
                action:
                    // this.props.isSwitch ?
                    <Switch disabled checked={controls.wifi_status} onClick={(e) => this.props.handleEditPolicy(e, 'wifi_status', '', 'push_apps', this.props.rowId)} size="small" />
                // : <span style={{ color: (controls.wifi_status === true || controls.wifi_status === 1) ? 'green' : 'red' }} >{(controls.wifi_status === true || controls.wifi_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'bluetooth_status',
                name: 'Bluetooth',
                action:
                    // this.props.isSwitch ?
                    <Switch disabled={this.props.isSwitch ? false : true} checked={controls.bluetooth_status} onClick={(e) => this.props.handleEditPolicy(e, 'bluetooth_status', '', 'controls', this.props.rowId)} size="small" />
                // : <span style={{ color: (controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'green' : 'red' }} >{(controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'screenshot_status',
                name: 'ScreenShot',
                action:
                    // this.props.isSwitch ? 
                    <Switch disabled={this.props.isSwitch ? false : true} checked={controls.screenshot_status} onClick={(e) => this.props.handleEditPolicy(e, 'screenshot_status', '', 'controls', this.props.rowId)} size="small" />
                // : <span style={{ color: (controls.screenshot_status === true || controls.screenshot_status === 1) ? 'green' : 'red' }} >{(controls.screenshot_status === true || controls.screenshot_status === 1) ? 'On' : 'Off'}</span>

            }, {
                rowKey: 'location_status',
                name: 'Location',
                action:
                    //  this.props.isSwitch ? 
                    <Switch disabled={this.props.isSwitch ? false : true} checked={controls.location_status} onClick={(e) => this.props.handleEditPolicy(e, 'location_status', '', 'controls', this.props.rowId)} size="small" />
                // : <span style={{ color: (controls.location_status === true || controls.location_status === 1) ? 'green' : 'red' }} >{(controls.location_status === true || controls.location_status === 1) ? 'On' : 'Off'}</span>

            }, {
                rowKey: 'hotspot_status',
                name: 'Hotspot',
                action:
                    // this.props.isSwitch ? 
                    <Switch disabled={this.props.isSwitch ? false : true} checked={controls.hotspot_status} onClick={(e) => this.props.handleEditPolicy(e, 'hotspot_status', '', 'controls', this.props.rowId)} size="small" />
                // : <span style={{ color: (controls.hotspot_status === true || controls.hotspot_status === 1) ? 'green' : 'red' }} >{(controls.hotspot_status === true || controls.hotspot_status === 1) ? 'On' : 'Off'}</span>

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
        let system_setting_app = '';
        let secure_setting_app = '';

        if(this.props.policy.app_list.length){
            let system_control_index = this.props.policy.app_list.findIndex(app => app.unique_name == SYSTEM_CONTROLS_UNIQUE)
            if(system_control_index > -1){
              system_setting_app = this.props.policy.app_list[system_control_index]
            }

            let secure_setting_index = this.props.policy.app_list.findIndex(app => app.uniqueName == SECURE_SETTING)
            if(secure_setting_index > -1){
              secure_setting_app = this.props.policy.app_list[secure_setting_index]
            }
          }

        this.setState({
            selected: this.props.selected,
            policy: this.props.policy,
            system_setting_app: system_setting_app,
            secure_setting_app: secure_setting_app,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            // console.log(this.props, 'object updated', nextProps)
            this.setState({
                selected: nextProps.selected,
            })
        }
        if (this.props.policy !== nextProps.policy) {
            console.log(nextProps.policy, 'next policy is');
            let system_setting_app = '';
            let secure_setting_app = '';
            if(nextProps.policy.app_list.length){
              let system_control_index = nextProps.policy.app_list.findIndex(app => app.unique_name == SYSTEM_CONTROLS_UNIQUE)
              if(system_control_index > -1){
                system_setting_app = nextProps.policy.app_list[system_control_index]
              }

              let secure_setting_index = nextProps.policy.app_list.findIndex(app => app.uniqueName == SECURE_SETTING)
              if(secure_setting_index > -1){
                secure_setting_app = nextProps.policy.app_list[secure_setting_index]
              }
            }
            this.setState({
                policy: nextProps.policy,
                system_setting_app: system_setting_app,
                secure_setting_app: secure_setting_app,
            })
        }
    }

    callback = (key) => {
        this.setState({ selected: key })
    }

    render() {
        console.log(this.state.system_setting_app, 'info list is ', this.state.secure_setting_app)

        const PolicyDetail = [{
            key: 1,
            name: this.state.policy.policy_name,
            note: this.state.policy.policy_note,
            command: this.state.policy.policy_command,

        }]
        // console.log(this.state.policy);
        return (
            <div>
                <Tabs className="exp_tabs_policy" onChange={this.callback} activeKey={this.state.selected} type="card">
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
                        <div>
                            <Row>
                                <Col span={8} className="">
                                </Col>
                                <Col span={2} className="">
                                    <img src={require("assets/images/setting.png")} className='image_icon' />
                                </Col>
                                <Col span={6} className="pl-0">
                                    <h5 style={{ marginTop: '9px' }}>Secure Settings Permission</h5>
                                </Col>
                            </Row>
                            <Row className="mb-8"  style={{marginTop: 10}}>
                            <Col span={6}></Col>
                                <Col span={4} className="text-center">
                                    <span>Guest: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.guest === true || this.state.secure_setting_app.guest === 1) ? true : false: false}
                                        onClick={(e) => {
                                            this.handleChecked(e, "guest", '', 'main');
                                        }}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Encrypted: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.encrypted === true || this.state.secure_setting_app.encrypted === 1) ? true : false: false}                                       
                                        onClick={(e) => {
                                            // console.log("encrypted", e);
                                            this.handleChecked(e, "encrypted", '', 'main');
                                        }}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Enable: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.enable === true || this.state.secure_setting_app.enable === 1) ? true : false: false}                                                                             
                                        onClick={(e) => {
                                            // console.log("encrypted", e);
                                            this.handleChecked(e, "enable", '', 'main');
                                        }}
                                    />

                                </Col>
                                <Col span={6}></Col>
                            </Row>
                        </div>
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
                        <div>
                            <Row>
                                <Col span={8} className="">
                                </Col>
                                <Col span={2} className="">
                                    <img src={require("assets/images/setting.png")} className='image_icon'/>
                                </Col>
                                <Col span={6} className="pl-0">
                                    <h5 style={{ marginTop: '9px' }}>System Settings Permission</h5>
                                </Col>
                            </Row>
                            <Row className="mb-8" style={{marginTop: 10}}>
                                <Col span={6}></Col>
                                <Col span={4}className="text-center">
                                    <span>Guest: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.system_setting_app !== '' ? (this.state.system_setting_app.guest === true || this.state.system_setting_app.guest === 1) ? true : false: false}                                                                                                                     
                                        onClick={(e) => {
                                            this.handleChecked(e, "guest", '', 'main');
                                        }}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Encrypted: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.system_setting_app !== '' ? (this.state.system_setting_app.encrypted === true || this.state.system_setting_app.encrypted === 1) ? true : false: false}                                                                                                                                                            
                                        onClick={(e) => {
                                            // console.log("encrypted", e);
                                            this.handleChecked(e, "encrypted", '', 'main');
                                        }}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Enable: </span>
                                    <Switch
                                    disabled
                                        size="small"
                                        checked={ this.state.system_setting_app !== '' ? (this.state.system_setting_app.enable === true || this.state.system_setting_app.enable === 1) ? true : false: false}                                                                                                                                                             
                                        onClick={(e) => {
                                            // console.log("encrypted", e);
                                            this.handleChecked(e, "enable", '', 'main');
                                        }}
                                    />

                                </Col>
                                <Col span={6}></Col>
                            </Row>
                        </div>
                        <Table
                            pagination={false}
                            dataSource={this.renderSystemPermissions(this.state.policy.controls)}
                            columns={columnsSystemPermission}>
                        </Table>
                    </TabPane>
                    <TabPane tab={POLICY_DETAILS} key="5">
                        <Table
                            pagination={false}
                            dataSource={PolicyDetail}
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