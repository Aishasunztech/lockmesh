import React, { Component, Fragment } from 'react';
import { Tabs, Table, Switch, Row, Col, Avatar } from 'antd';
import { BASE_URL } from '../../../constants/Application';
import Permissions from "./Permissions";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, Main_SETTINGS, APPLICATION_PERMISION, POLICY_DETAILS, SYSTEM_CONTROLS_UNIQUE, SECURE_SETTING } from '../../../constants/Constants';
import AppList from "./AppList";
import { convertToLang } from '../../utils/commonUtils';    
import { Tab_POLICY_SELECTED_APPS, Tab_POLICY_Dealer_PERMISSIONS } from '../../../constants/TabConstants';
import { POLICY_NAME, NAME, POLICY_ACTION, POLICY_NOTE, POLICY_COMMAND } from '../../../constants/PolicyConstants';

const TabPane = Tabs.TabPane;

export default class PolicyInfo extends Component {
    columnsSystemPermission = [{
        title: convertToLang(this.props.translation[NAME], NAME),
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="javascript:;">{text}</a>,
    }, {
        title: convertToLang(this.props.translation[POLICY_ACTION], POLICY_ACTION),
        dataIndex: 'action',
        key: 'action',
    }];
    
     columnsPolicyDetail = [{
        title: convertToLang(this.props.translation[POLICY_NAME], POLICY_NAME),
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="javascript:;">{text}</a>,
    }, {
        title: convertToLang(this.props.translation[POLICY_NOTE], POLICY_NOTE),
        dataIndex: 'note',
        key: 'note',
    }, {
        title: convertToLang(this.props.translation[POLICY_COMMAND], POLICY_COMMAND),
        dataIndex: 'command',
        key: 'command',
    }];
    constructor(props) {
        super(props);
        this.state = {
            selected: '1',
            policy: [],
            system_setting_app: '',
            secure_setting_app: '',
        }

    }


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
    }


    componentDidMount() {
        let system_setting_app = '';
        let secure_setting_app = '';

        if (this.props.policy.app_list.length) {
            let system_control_index = this.props.policy.app_list.findIndex(app => app.uniqueName === Main_SETTINGS)
            if (system_control_index > -1) {
                system_setting_app = this.props.policy.app_list[system_control_index]
            }

            let secure_setting_index = this.props.policy.app_list.findIndex(app => app.uniqueName === SECURE_SETTING)
            if (secure_setting_index > -1) {
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
            // console.log(nextProps.policy, 'next policy is');
            let system_setting_app = '';
            let secure_setting_app = '';
            if (nextProps.policy.app_list.length) {
                let system_control_index = nextProps.policy.app_list.findIndex(app => app.uniqueName === Main_SETTINGS)
                if (system_control_index > -1) {
                    system_setting_app = nextProps.policy.app_list[system_control_index]
                }

                let secure_setting_index = nextProps.policy.app_list.findIndex(app => app.uniqueName === SECURE_SETTING)
                if (secure_setting_index > -1) {
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
        // console.log(this.props.appsGotted, 'info list is ', this.state.secure_setting_app)

        const PolicyDetail = [{
            key: 1,
            name: this.state.policy.policy_name,
            note: this.state.policy.policy_note,
            command: this.state.policy.policy_command,

        }]
        // console.log(this.state.policy);
        return (
            <Fragment>
                <Tabs className="exp_tabs_policy" onChange={this.callback} activeKey={this.state.selected} type="card">
                    <TabPane tab={convertToLang(this.props.translation[Tab_POLICY_SELECTED_APPS], Tab_POLICY_SELECTED_APPS)} key="1">

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
                            translation={this.props.translation}
                        />
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[APPLICATION_PERMISION], APPLICATION_PERMISION)} key="2">
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
                            translation={this.props.translation}
                        />
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], SECURE_SETTING_PERMISSION)} key="3">
                        <Fragment>
                            <Row>
                                <Col span={8} className="">
                                </Col>
                                <Col span={2} className="">
                                    <Avatar src={`${BASE_URL}users/getFile/${this.state.secure_setting_app.icon}`} style={{ width: "30px", height: "30px" }} />
                                </Col>
                                <Col span={6} className="pl-0">
                                    <h5 style={{ marginTop: '9px' }}>Secure Settings Permission</h5>
                                </Col>
                            </Row>
                            <Row className="mb-8" style={{ marginTop: 10 }}>
                                <Col span={6}></Col>
                                <Col span={4} className="text-center">
                                    <span>Guest: </span>
                                    <Switch
                                        disabled
                                        size="small"
                                        checked={this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.guest === true || this.state.secure_setting_app.guest === 1) ? true : false : false}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Encrypted: </span>
                                    <Switch
                                        disabled
                                        size="small"
                                        checked={this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.encrypted === true || this.state.secure_setting_app.encrypted === 1) ? true : false : false}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Enable: </span>
                                    <Switch
                                        disabled
                                        size="small"
                                        checked={this.state.secure_setting_app !== '' ? (this.state.secure_setting_app.enable === true || this.state.secure_setting_app.enable === 1) ? true : false : false}
                                    />

                                </Col>
                                <Col span={6}></Col>
                            </Row>
                        </Fragment>
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
                            translation={this.props.translation}
                        />
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[SYSTEM_PERMISSION], SYSTEM_PERMISSION)} key="4">
                        {/* <Fragment>
                            <Row>
                                <Col span={8} className="">
                                </Col>
                                <Col span={2} className="">
                                    <Avatar src={`${BASE_URL}users/getFile/${this.state.system_setting_app.icon}`} style={{ width: "30px", height: "30px" }} />
                                </Col>
                                <Col span={6} className="pl-0">
                                    <h5 style={{ marginTop: '9px' }}>Android Settings Permission</h5>
                                </Col>
                            </Row>
                            <Row className="mb-8" style={{ marginTop: 10 }}>
                                <Col span={6}></Col>
                                <Col span={4} className="text-center">
                                    <span>Guest: </span>
                                    <Switch
                                        disabled
                                        size="small"
                                        checked={this.state.system_setting_app !== '' ? (this.state.system_setting_app.guest === true || this.state.system_setting_app.guest === 1) ? true : false : false}
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
                                        checked={this.state.system_setting_app !== '' ? (this.state.system_setting_app.encrypted === true || this.state.system_setting_app.encrypted === 1) ? true : false : false}
                                    />
                                </Col>
                                <Col span={4} className="text-center">
                                    <span>Enable: </span>
                                    <Switch
                                        disabled
                                        size="small"
                                        checked={this.state.system_setting_app !== '' ? (this.state.system_setting_app.enable === true || this.state.system_setting_app.enable === 1) ? true : false : false}
                                    />

                                </Col>
                                <Col span={6}></Col>
                            </Row>
                        </Fragment> */}

                        <Table
                            pagination={false}
                            dataSource={this.renderSystemPermissions(this.state.policy.controls)}
                            columns={this.columnsSystemPermission}>
                        </Table>
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[POLICY_DETAILS], POLICY_DETAILS)} key="5">
                        <Table
                            pagination={false}
                            dataSource={PolicyDetail}
                            columns={this.columnsPolicyDetail}>
                        </Table>
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[Tab_POLICY_Dealer_PERMISSIONS], Tab_POLICY_Dealer_PERMISSIONS)} key="6">
                        <Permissions
                            record={this.props.policy}
                            translation={this.props.translation}
                        />
                    </TabPane>
                </Tabs>
            </Fragment>
        )
    }
}