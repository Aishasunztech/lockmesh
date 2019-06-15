import React, { Component, Fragment } from 'react'
import { Button, Avatar, Input, Modal, Form, Icon, Col, Row, Table, Switch, Tabs } from "antd";
import AppList from "./AppList";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, SECURE_SETTING, SYSTEM_CONTROLS_UNIQUE, Main_SETTINGS } from '../../../constants/Constants';
import styles from './policy.css';
import { BASE_URL } from '../../../constants/Application';

const TextArea = Input;
const TabPane = Tabs.TabPane;
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
}, {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
}];
const data = [
    {
        name: "Wifi",
        action: (<Switch size="small"></Switch>),
        key: 1,
    },
    {
        name: "Bluetooth",
        action: (<Switch size="small"></Switch>),
        key: 2,
    },
    {
        name: "Screenshot",
        action: (<Switch size="small"></Switch>),
        key: 3,
    },
    {
        name: "Location",
        action: (<Switch size="small"></Switch>),
        key: 4,
    },
    {
        name: "Hotspot",
        action: (<Switch size="small"></Switch>),
        key: 4,
    }
];

export default class AddPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            dealerApps: [],
            pushApps: [],
            steps: [],
            first: true,
            tabSelected: '1',
            allExtensions: [],
            systemPermissions: [],
            policy_name: '',
            command: '',
            isCommand: 'success',
            isPolicy_name: 'success',
            policy_name_error: '',
            command_error: '',
            pushAppsIds: [],
            appPermissionsIds: [],
            main_system_control: {},
            main_extension: {},

            guestAlldealerApps: false,
            encryptedAlldealerApps: false,
            enableAlldealerApps: false,

            guestAllappPermissions: false,
            encryptedAllappPermissions: false,
            enableAllappPermissions: false,

            guestAllallExtensions: false,
            encryptedAllallExtensions: false,
            enableAllallExtensions: false,

            editAblePolicy:
            {
                push_apps: [],
                app_list: [],
                secure_apps: []
            },

            addPushAppModal: false,

            selectedRowKeysApps: [],
            selectedRowKeysPermissios: [],
            addDataOf: 'push_apps'

        };

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }]
    }

    handleCheckApp = (value, key, id, arrayOf, main = '') => {
        // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiii');

        if (main == 'main') {
            if (this.state.main_extension) {
                this.state.main_extension[key] = value
            }
            this.setState({
                main_extension: this.state.main_extension
            })
        } else {
            this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING)
        }

        // console.log(value, key, id, arrayOf, 'data is');
    }

    handleCheckAllAppPolicy = (value, key, arrayOf) => {
        this.props.handleCheckAllAppPolicy(value, key, arrayOf, SECURE_SETTING)
    }

    componentDidMount() {
        if (this.props.editAblePolicy.length) {
            let editAblePolicy = this.props.editAblePolicy.find(item => item.id == this.props.editAblePolicyId)
            // console.log(this.props.editAblePolicyId, 'id')
            console.log(editAblePolicy, 'policys')
            let main_system_control = {};
            let main_extension = {};
            if (editAblePolicy.app_list) {
                if (editAblePolicy.app_list.length) {
                    main_system_control = editAblePolicy.app_list.find(item => item.uniqueName == Main_SETTINGS);
                    main_extension = editAblePolicy.app_list.find(item => item.uniqueName == SECURE_SETTING);

                    // console.log('1223', editAblePolicy.app_list)

                    let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == SECURE_SETTING);
                    // console.log(seccure_index, 'sdfdsfa')
                    if (seccure_index > -1) {
                        editAblePolicy.app_list.splice(seccure_index, 1)
                    }
                    let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == Main_SETTINGS);
                    // console.log('system_index', systemcontrols_index)
                    if (systemcontrols_index > -1) {
                        editAblePolicy.app_list.splice(systemcontrols_index, 1)
                    }

                    // console.log('object,', editAblePolicy.app_list)
                }
            }

            // console.log(main_system_control, 'eidtable', main_extension)
            if (editAblePolicy) {
                this.setState({
                    editAblePolicy: editAblePolicy,
                    current: 0,
                    command: editAblePolicy.policy_note,
                    policy_name: editAblePolicy.policy_name,
                    main_system_control: main_system_control,
                    main_extension: main_extension

                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        // console.log('edit able changed', this.props.editAblePolicy);
        if (this.props !== prevProps) {

            if (this.props.editAblePolicy.length) {
                let editAblePolicy = this.props.editAblePolicy.find(item => item.id == this.props.editAblePolicyId)
                // console.log('eidted dsddffffffff', editAblePolicy);

                let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == SECURE_SETTING);
                // console.log(seccure_index, 'sdfdsfa')
                if (seccure_index > -1) {
                    editAblePolicy.app_list.splice(seccure_index, 1)
                }
                let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == Main_SETTINGS);
                if (systemcontrols_index > -1) {
                    editAblePolicy.app_list.splice(systemcontrols_index, 1)
                }

                // console.log(editAblePolicy, 'chceck', systemcontrols_index)

                if (this.state.main_extension == undefined && this.state.main_extension == {}) {
                    let main_extension = {};
                    let main_system_control = {};
                    if (editAblePolicy.app_list.length) {

                        main_system_control = editAblePolicy.app_list.find(item => item.uniqueName == Main_SETTINGS);
                        main_extension = editAblePolicy.app_list.find(item => item.uniqueName == SECURE_SETTING);

                        let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == SECURE_SETTING);
                        // console.log(seccure_index, 'sdfdsfa')
                        if (seccure_index > -1) {
                            editAblePolicy.app_list.splice(seccure_index, 1)
                        }
                        let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName == Main_SETTINGS);
                        if (systemcontrols_index > -1) {
                            editAblePolicy.app_list.splice(systemcontrols_index, 1)
                        }

                    }
                    // console.log(main_system_control, 'eidtable jksdhf', main_extension)
                    this.setState({
                        editAblePolicy: editAblePolicy,
                        // current: 0,
                        command: editAblePolicy.policy_note,
                        policy_name: editAblePolicy.policy_name,
                        main_system_control: main_system_control,
                        main_extension: main_extension,
                        first: false
                    });
                } else {
                    if (editAblePolicy) {
                        this.setState({
                            editAblePolicy: editAblePolicy,
                            // current: 0,
                            command: editAblePolicy.policy_note,
                            policy_name: editAblePolicy.policy_name,
                            first: false

                        });
                    }
                }

            }
        }
    }


    handleChecked = (value, key) => {
        if (this.state.main_system_control) {
            this.state.main_system_control[key] = value
        }
        this.setState({
            main_system_control: this.state.main_system_control
        })
    }

    handleChecked2 = (value, key) => {
        if (this.state.main_extension) {
            this.state.main_extension[key] = value
        }
        this.setState({
            main_extension: this.state.main_extension
        })
    }


    renderApp = (data) => {
        // console.log('data is', data)
        if (data.length) {
            return data.map(app => {
                let app_id = (app.apk_id !== undefined) ? app.apk_id : app.id;
                let label = (app.apk_name !== undefined) ? app.apk_name : app.label;
                let icon = (app.logo !== undefined) ? app.logo : app.icon;

                return ({
                    key: app_id,
                    app_name:
                        <Fragment>
                            <Avatar src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />

                            <div className="line_break2">{label}</div>
                        </Fragment>
                });
            })
        }

    }


    renderSystemPermissions = () => {
        const { controls } = this.state.editAblePolicy;
        // console.log(controls)
        if (controls) {

            return [{
                rowKey: 'wifi_status',
                name: 'Wifi',
                action:
                    // this.props.isSwitch ?
                    <Switch checked={controls.wifi_status} onClick={(e) => this.props.handleEditPolicy(e, 'wifi_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
                // : <span style={{ color: (controls.wifi_status === true || controls.wifi_status === 1) ? 'green' : 'red' }} >{(controls.wifi_status === true || controls.wifi_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'bluetooth_status',
                name: 'Bluetooth',
                action:
                    // this.props.isSwitch ?
                    <Switch checked={controls.bluetooth_status} onClick={(e) => this.props.handleEditPolicy(e, 'bluetooth_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
                // : <span style={{ color: (controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'green' : 'red' }} >{(controls.bluetooth_status === true || controls.bluetooth_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'screenshot_status',
                name: 'ScreenShot',
                action:
                    // this.props.isSwitch ? 
                    <Switch checked={controls.screenshot_status} onClick={(e) => this.props.handleEditPolicy(e, 'screenshot_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
                // : <span style={{ color: (controls.screenshot_status === true || controls.screenshot_status === 1) ? 'green' : 'red' }} >{(controls.screenshot_status === true || controls.screenshot_status === 1) ? 'On' : 'Off'}</span>

            }, {
                rowKey: 'location_status',
                name: 'Location',
                action:
                    //  this.props.isSwitch ? 
                    <Switch checked={controls.location_status} onClick={(e) => this.props.handleEditPolicy(e, 'location_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
                // : <span style={{ color: (controls.location_status === true || controls.location_status === 1) ? 'green' : 'red' }} >{(controls.location_status === true || controls.location_status === 1) ? 'On' : 'Off'}</span>
            }, {
                rowKey: 'hotspot_status',
                name: 'Hotspot',
                action:
                    // this.props.isSwitch ? 
                    <Switch checked={controls.hotspot_status} onClick={(e) => this.props.handleEditPolicy(e, 'hotspot_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
                // : <span style={{ color: (controls.hotspot_status === true || controls.hotspot_status === 1) ? 'green' : 'red' }} >{(controls.hotspot_status === true || controls.hotspot_status === 1) ? 'On' : 'Off'}</span>

            }]
        }
    }

    SavePolicyChanges = () => {

        if (this.state.command === '') {
            this.setState({
                isCommand: 'error',
                command_error: "Please Input Policy Note"
            })
        } else {
            // console.log(this.state.editAblePolicy.app_list, 'policy while editing')
            this.state.editAblePolicy.policy_note = this.state.command;
            if (this.state.main_extension !== null && this.state.main_extension !== '' && this.state.main_extension !== {} && this.state.main_extension !== undefined && this.state.main_extension !== "undefined") {
                this.state.editAblePolicy.app_list.push(this.state.main_extension);
                // console.log('if is called 1')
            }

            if (this.state.main_system_control !== null && this.state.main_system_control !== '' && this.state.main_extension !== {} && this.state.main_extension !== undefined && this.state.main_extension !== "undefined") {
                this.state.editAblePolicy.app_list.push(this.state.main_system_control);
                // console.log('if is called 2')
            }

            if(this.state.editAblePolicy.app_list.length){
                let indexforDel = this.state.editAblePolicy.app_list.findIndex(item => item == undefined || item == "undefined" || item == '' || item == null || item == {})
                if (indexforDel > -1) {
                    this.state.editAblePolicy.app_list.splice(indexforDel, 1)
                }
            }

            // console.log(this.state.main_extension, 'app list is one', this.state.editAblePolicy.app_list)

            Modal.confirm({
                title: 'Are You Sure, You Want to Save Changes',
                onOk: () => {
                    this.props.SavePolicyChanges(this.state.editAblePolicy);
                    this.props.editPolicyModalHide();
                    this.props.getPolicies();
                    this.props.handleAppGotted(true)
                    this.setState({ tabSelected: '1' })
                    
                },
                okText: 'Save',
            });
        }
    }

    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys: selectedRowKeys });
    };


    reset_steps = () => {
        this.setState({ tabSelected: '1' })
    }

    onCancel = () => {
        this.props.onCancel();
    }

    hideAddPushAppModal = () => {
        this.setState({
            addPushAppModal: false,
            selectedRowKeys: [],
        })
    }

    addApps = (dataType) => {
        this.setState({
            addPushAppModal: true,
            addDataOf: dataType
        })
    }

    addItems = () => {
        if (this.state.selectedRowKeys.length) {
            this.props.addAppsToPolicies(this.state.selectedRowKeys, this.props.editAblePolicyId, this.state.addDataOf)
            this.hideAddPushAppModal()
        }
    }

    callback = (activeKey) => {
        this.setState({ tabSelected: activeKey })
    }

    // next() {
    //     const current = this.state.current + 1;
    //     this.setState({ current });
    // }

    // prev() {
    //     const current = this.state.current - 1;
    //     this.setState({ current });
    // }

    render() {
        const { current } = this.state;
        // console.log(this.state.editAblePolicy.app_list, 'selected row for error')

        const { selectedRows, selectedRowKeys } = this.state;
        let rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
        };

        return (
            <Fragment>
                <div className="policy_steps">
                    <Tabs tabPosition="left" size="small" type="card" activeKey={this.state.tabSelected} onChange={this.callback}>
                        <TabPane tab="APPS" key="1">
                            <AppList
                                apk_list={this.state.editAblePolicy.push_apps}
                                dataLength={this.state.editAblePolicy.push_apps.length}
                                handleCheckApp={this.handleCheckApp}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                guestAll={this.props.guestAlldealerApps}
                                encryptedAll={this.props.encryptedAlldealerApps}
                                enableAll={this.props.enableAlldealerApps}
                                removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                                addAppsButton={true}
                                isCheckAllButtons={true}
                                pageType={'appPermissions'}
                                addApps={this.addApps}
                                apps='dealerApps'
                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                                isCheckbox={false}
                                pageType={'dealerApps'}
                            />

                        </TabPane>
                        <TabPane tab="APP PERMISSION" key="2">
                            <AppList
                                dataLength={this.state.editAblePolicy.app_list.length}
                                apk_list={this.state.editAblePolicy.app_list}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                                handleCheckApp={this.handleCheckApp}
                                appPermissions='appPermissions'
                                pageType={'appPermissions'}
                                // addAppsButton={true}
                                isCheckAllButtons={true}
                                addApps={this.addApps}
                                guestAll={this.props.guestAllappPermissions}
                                encryptedAll={this.props.encryptedAllappPermissions}
                                enableAll={this.props.enableAllappPermissions}
                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                            />

                        </TabPane>
                        <TabPane tab="SETTINGS PERMISSION" key="3">


                            {
                                this.state.main_extension != undefined ?

                                    <div>
                                        <Row>
                                            <Col span={6} className="">
                                            </Col>
                                            <Col span={3} className="">
                                            <Avatar src={`${BASE_URL}users/getFile/${this.state.main_extension.icon}`} style={{ width: "30px", height: "30px" }} />
                                                {/* <img src={require("assets/images/setting.png")} /> */}
                                            </Col>
                                            <Col span={15} className="pl-0">
                                                <h5 style={{ marginTop: '9px' }}>Secure Settings Permission</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8} className="text-center">
                                                <span>Guest: </span>
                                                <Switch
                                                    size="small"
                                                    checked={(this.state.main_extension.guest === true || this.state.main_extension.guest === 1) ? true : false}

                                                    onClick={(e) => {
                                                        this.handleChecked2(e, "guest", '', 'main');
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8} className="text-center">
                                                <span>Encrypted: </span>
                                                <Switch
                                                    size="small"

                                                    checked={(this.state.main_extension.encrypted === true || this.state.main_extension.encrypted === 1) ? true : false}
                                                    onClick={(e) => {
                                                        // console.log("encrypted", e);
                                                        this.handleChecked2(e, "encrypted", '', 'main');
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8} className="text-center">
                                                <span>Enable: </span>
                                                <Switch
                                                    size="small"
                                                    checked={(this.state.main_extension.enable === true || this.state.main_extension.enable === 1) ? true : false}
                                                    onClick={(e) => {
                                                        // console.log("encrypted", e);
                                                        this.handleChecked2(e, "enable", '', 'main');
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </div> : null}
                            <AppList
                                dataLength={this.state.editAblePolicy.secure_apps.length}
                                allExtensions={this.state.editAblePolicy.secure_apps}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                handleCheckApp={this.handleCheckApp}

                                EditmainExtension={this.state.main_extension}
                                secureSettings='allExtensions'
                                pageType={'allExtensions'}
                                guestAll={this.props.guestAllallExtensions}
                                encryptedAll={this.props.encryptedAllallExtensions}
                                enableAll={this.props.enableAllallExtension}
                                isCheckAllButtons={true}

                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                            />
                        </TabPane>
                        <TabPane tab="SYSTEM PERMISSION" key="4">
                            <div>
                                {
                                    this.state.main_system_control != undefined ?

                                        <div>
                                            <Row>
                                                <Col span={6} className="">
                                                </Col>
                                                <Col span={3} className="">
                                            <Avatar src={`${BASE_URL}users/getFile/${this.state.main_system_control.icon}`} style={{ width: "30px", height: "30px" }} />

                                                    {/* <img src={require("assets/images/setting.png")} /> */}
                                                </Col>
                                                <Col span={15} className="pl-0">
                                                    <h5 style={{ marginTop: '9px' }}>System Settings Permission</h5>
                                                </Col>
                                            </Row>
                                            <Row className="mb-8">
                                                <Col span={8} className="text-center">
                                                    <span>Guest: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.guest === true || this.state.main_system_control.guest === 1) ? true : false}
                                                        onClick={(e) => {
                                                            this.handleChecked(e, "guest", '', 'main');
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={8} className="text-center">
                                                    <span>Encrypted: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.encrypted === true || this.state.main_system_control.encrypted === 1) ? true : false}
                                                        onClick={(e) => {
                                                            // console.log("encrypted", e);
                                                            this.handleChecked(e, "encrypted", '', 'main');
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={8} className="text-center">
                                                    <span>Enable: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.enable === true || this.state.main_system_control.enable === 1) ? true : false}
                                                        onClick={(e) => {
                                                            // console.log("encrypted", e);
                                                            this.handleChecked(e, "enable", '', 'main');
                                                        }}
                                                    />

                                                </Col>
                                            </Row>
                                        </div>
                                        : null}
                                <Table
                                    pagination={false}
                                    dataSource={this.renderSystemPermissions()}
                                    bordered
                                    columns={columns}>
                                </Table>
                            </div>

                        </TabPane>
                        <TabPane tab="POLICY DETAILS" key="5">
                            <Form className="login-form">
                                <Form.Item
                                    validateStatus={this.state.isPolicy_name}
                                    help={this.state.policy_name_error}
                                >
                                    <span className="h3">Name</span>
                                    <Input placeholder="Name" disabled value={this.state.policy_name} onChange={(e) => this.setState({ policy_name: e.target.value, policy_name_error: '', isPolicy_name: 'success' })} className="pol_inp" />
                                </Form.Item>
                                <Form.Item>
                                    <span className="h3">Command Name</span>
                                    <Input disabled value={this.state.editAblePolicy.command_name} className="pol_inp" />
                                </Form.Item>
                                <Form.Item
                                    validateStatus={this.state.isCommand}
                                    help={this.state.command_error}
                                >
                                    <span className="h3">Policy Note</span>
                                    <textarea placeholder="Policy Note" value={this.state.command} onChange={(e) => this.setState({ command: e.target.value, command_error: '', isCommand: 'success' })} className="ant-input"></textarea>

                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                    <div className="text-center">
                        <Button className="mt-10" onClick={() => this.onCancel()}>Cancel</Button>
                        <Button className="mt-10" type="primary" onClick={() => this.SavePolicyChanges(this.state.policy_name, this.state.command)}>Save</Button>
                    </div>
                    {/* <Steps current={current} labelPlacement="vertical">
                        {this.steps.map(item => <Steps.Step icon={item.Icon} key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content">{this.steps[current].content}</div>
                    <div className="steps-action">
                        {
                            current > 0
                            && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    Previous
                            </Button>
                            )
                        }
                        {
                            current === this.steps.length - 1
                            && <Button type="primary" onClick={() => this.SavePolicyChanges(this.state.policy_name, this.state.command)}>Save</Button>
                        }
                        {
                            current < this.steps.length - 1
                            && <Button type="primary" onClick={() => this.next()}>Next</Button>

                        } */}
                    {/* </div> */}

                    <Modal
                        title="Add Apps"
                        visible={this.state.addPushAppModal}
                        onOk={this.addItems}
                        onCancel={this.hideAddPushAppModal}
                        okText="Add"
                        cancelText="Cancel"
                        width='700px'
                    >
                        <Table
                            className="exp_policy"
                            style={{ margin: 0, padding: 0 }}
                            rowSelection={rowSelection}
                            scroll={this.props.isHistory ? {} : {}}
                            columns={this.appsColumns}
                            align='center'
                            dataSource={
                                this.renderApp(this.state.addDataOf == 'push_apps' ? this.props.push_apps : this.props.appPermissions)
                            }
                            pagination={false}
                            bordered
                        />

                    </Modal>
                </div>
            </Fragment>
        );
    }
}
