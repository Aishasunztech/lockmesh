import React, { Component, Fragment } from 'react'
import { Tabs, Button, Row, Col, Avatar, Input, Form, Checkbox, Icon, Steps, message, Table, Divider, Tag, Switch } from "antd";
import AppList from "./AppList";
import { connect } from "react-redux";
import { BASE_URL } from '../../../constants/Application';
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, SECURE_SETTING, SYSTEM_CONTROLS_UNIQUE, Main_SETTINGS } from '../../../constants/Constants';
import styles from './policy.css';
import { bindActionCreators } from "redux";
import { getDealerApps, } from '../../../appRedux/actions/ConnectDevice';
import { handleCheckAppPolicy, getAppPermissions, handleChekSystemPermission, savePolicy, handleCheckAllAppPolicy } from '../../../appRedux/actions/Policy';
import RestService from '../../../appRedux/services/RestServices'
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

class AddPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelected: '1',
            dealerApps: [],
            pushApps: [],
            steps: [],
            allExtensions: [],
            systemPermissions: [],
            main_system_control: {},
            policy_name: '',
            command: '',
            isCommand: 'success',
            isPolicy_name: 'success',
            policy_name_error: '',
            command_error: '',
            disabledCommand: '',
            pushAppsIds: [],
            appPermissionsIds: [],
            appPermissions: [],


            guestAlldealerApps: false,
            encryptedAlldealerApps: false,
            enableAlldealerApps: false,

            guestAllappPermissions: false,
            encryptedAllappPermissions: false,
            enableAllappPermissions: false,

            guestAllallExtensions: false,
            encryptedAllallExtensions: false,
            enableAllallExtensions: false,

        };

        // console.log('stat is ', this.state.dealerApps)

    }

    handleCheckApp = (value, key, id, arrayOf, main) => {
        this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING, main)
        // console.log(value, key, id, arrayOf, 'data is');
    }

    handleCheckAllAppPolicy = (value, key, arrayOf) => {
        this.props.handleCheckAllAppPolicy(value, key, arrayOf, SECURE_SETTING)
    }

    savePolicy = () => {

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(err, 'Received values of form: ', values);

                if (this.state.pushAppsIds.length) {
                    for (let id of this.state.pushAppsIds) {
                        let index = this.state.dealerApps.findIndex(item => item.apk_id == id);
                        if (index > -1) {
                            this.state.pushApps.push(this.state.dealerApps[index])
                        }
                    }
                }

                let appPermissions = JSON.parse(JSON.stringify(this.state.appPermissions))
                let secure_apps = [];

                let main_extension = JSON.parse(JSON.stringify(this.state.allExtensions.find(item => item.uniqueName == SECURE_SETTING)));
                // console.log(main_extension)
                if (main_extension) {
                    secure_apps = main_extension.subExtension
                }

                if (Object.keys(this.state.main_system_control).length !== 0 && this.state.main_system_control.constructor === Object) {
                     appPermissions.push(JSON.parse(JSON.stringify(this.state.main_system_control)))
                }
                console.log(appPermissions, 'length at system control', this.state.main_system_control)

                delete main_extension.subExtension;
                // console.log(this.state.main_system_control, 'main setting controls is')
                if (main_extension) {

                    console.log(main_extension, 'main extension is')

                    appPermissions.push(JSON.parse(JSON.stringify(main_extension)));
                }
                console.log(appPermissions, 'length at extenison', main_extension)

                let data = {
                    policy_name: values.policy_name,
                    policy_note: values.command,
                    push_apps: this.state.pushApps,
                    app_list: appPermissions,
                    secure_apps: secure_apps,
                    system_permissions: this.state.systemPermissions
                }
                console.log('polcy is', data);

                this.props.savePolicy(data);
                this.props.handlePolicyModal(false);
                this.props.getPolicies();
                this.props.getDealerApps();
                this.props.getAppPermissions();
                this.setState({
                    current: 0,
                    pushApps: [],
                    guestAlldealerApps: false,
                    encryptedAlldealerApps: false,
                    enableAlldealerApps: false,

                    guestAllappPermissions: false,
                    encryptedAllappPermissions: false,
                    enableAllappPermissions: false,

                    guestAllallExtensions: false,
                    encryptedAllallExtensions: false,
                    enableAllallExtensions: false,
                })
            }
        });
    }


    componentDidMount() {
        this.props.getDealerApps();
        this.props.getAppPermissions();

        let main_system_control = {};
        if (this.props.appPermissions.length) {
            let main_system_control_index = this.props.appPermissions.findIndex(item => item.uniqueName == Main_SETTINGS)
            console.log(main_system_control_index, 'component did mount');
            if (main_system_control_index > -1) {
                main_system_control = this.props.appPermissions[main_system_control_index];
                this.props.appPermissions.splice(main_system_control_index, 1);
            }

        }


        this.setState({
            dealerApps: this.props.dealerApps,
            appPermissions: this.props.appPermissions,
            allExtensions: this.props.allExtensions,
            systemPermissions: this.props.systemPermissions,
            main_system_control: main_system_control,

            guestAlldealerApps: this.props.guestAlldealerApps,
            encryptedAlldealerApps: this.props.encryptedAlldealerApps,
            enableAlldealerApps: this.props.enableAlldealerApps,

            guestAllappPermissions: this.props.guestAllappPermissions,
            encryptedAllappPermissions: this.props.encryptedAllappPermissions,
            enableAllappPermissions: this.props.enableAllappPermissions,

            guestAllallExtensions: this.props.guestAllallExtensions,
            encryptedAllallExtensions: this.props.encryptedAllallExtensions,
            enableAllallExtensions: this.props.enableAllallExtensions,

        })
    }


    componentDidUpdate(prevProps) {
        //   console.log(this.props.allExtensions, 'add policy page data is ', prevProps.allExtensions);
        if (this.props !== prevProps) {
            if (this.props.goToLastTab !== prevProps.goToLastTab && this.props.goToLastTab == true) {
                this.setState({ tabSelected: '5' })
            }

            if (this.props.appPermissions.length) {
                let main_system_control_index = this.props.appPermissions.findIndex(item => item.uniqueName == Main_SETTINGS)
                // console.log(main_system_control_index, 'dsfksd');
                if (main_system_control_index > -1) {
                    this.props.appPermissions.splice(main_system_control_index, 1);
                }
            }

            // console.log('updated called')
            this.setState({
                dealerApps: this.props.dealerApps,
                appPermissions: this.props.appPermissions,
                allExtensions: this.props.allExtensions,
                systemPermissions: this.props.systemPermissions,


                guestAlldealerApps: this.props.guestAlldealerApps,
                encryptedAlldealerApps: this.props.encryptedAlldealerApps,
                enableAlldealerApps: this.props.enableAlldealerApps,

                guestAllappPermissions: this.props.guestAllappPermissions,
                encryptedAllappPermissions: this.props.encryptedAllappPermissions,
                enableAllappPermissions: this.props.enableAllappPermissions,

                guestAllallExtensions: this.props.guestAllallExtensions,
                encryptedAllallExtensions: this.props.encryptedAllallExtensions,
                enableAllallExtensions: this.props.enableAllallExtensions,
            });

        }
    }


    onSelectChange = (selected, pageType) => {
        if (pageType == 'dealerApps') this.state.pushAppsIds = selected;
        else if (pageType == 'appPermissions') this.state.appPermissionsIds = selected

        console.log(this.state.appPermissionsIds, 'guested apps', this.state.pushAppsIds)
    }

    renderSystemPermissions = () => {
        if (this.state.systemPermissions) {

            return [{
                rowKey: 'wifi_status',
                name: 'Wifi',
                action: <Switch checked={this.state.systemPermissions.wifi_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'wifi_status')} size="small" />
            }, {
                rowKey: 'bluetooth_status',
                name: 'Bluetooth',
                action: <Switch checked={this.state.systemPermissions.bluetooth_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'bluetooth_status')} size="small" />
            }, {
                rowKey: 'screenshot_status',
                name: 'ScreenShot',
                action: <Switch checked={this.state.systemPermissions.screenshot_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'screenshot_status')} size="small" />
            }, {
                rowKey: 'location_status',
                name: 'Location',
                action: <Switch checked={this.state.systemPermissions.location_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'location_status')} size="small" />
            }, {
                rowKey: 'hotspot_status',
                name: 'Hotspot',
                action: <Switch checked={this.state.systemPermissions.hotspot_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'hotspot_status')} size="small" />
            }]
        }

    }

    policyNameChange = async (rule, value, callback) => {
        let response = true
        if (/[^A-Za-z \d]/.test(value)) {
            callback("Please insert only alphabets and numbers.")
        }
        else {
            response = await RestService.checkPolicyName(value).then((response) => {
                if (RestService.checkAuth(response.data)) {
                    if (response.data.status) {
                        return true
                    }
                    else {
                        return false
                    }
                }
            });
            if (response) {
                callback()
                this.setState({
                    policy_name: value,
                    // isPolicy_name: 'success',
                    disabledCommand: '#' + value.replace(/ /g, '_'),
                    // policy_name_error: ''
                })
            } else {
                callback("Policy name already taken please use another name.")
            }
        }

    }


    onNoteChange = (e) => {

        this.props.form.setFieldsValue({
            command: e.target.value
        })

        // if (e.target.value === '') {
        //     this.setState({
        //         command: e.target.value,
        //         isCommand: 'error',
        //         command_error: "Please Input Policy Note"
        //     })
        // } else {
        //     this.setState({

        //         command: e.target.value,
        //         isCommand: 'success',
        //         command_error: ''
        //     })
        // }

    }

    handleChecked = (value, key) => {
        if (this.state.main_system_control) {
            this.state.main_system_control[key] = value
        }
        this.setState({
            main_system_control: this.state.main_system_control
        })

    }

    callback = (activeKey) => {
        this.setState({ tabSelected: activeKey })
    }

    prev_tab = () => {
        let tabSelected = parseInt(this.state.tabSelected);
        tabSelected--;
        this.setState({ tabSelected: String(tabSelected) })
    }

    next_tab = () => {
        let tabSelected = parseInt(this.state.tabSelected);
        tabSelected++;
        this.setState({ tabSelected: String(tabSelected) })
    }

    render() {
        // console.log(this.state.main_system_control,'console the applist', this.state.appPermissions);
        const { getFieldDecorator } = this.props.form;
        // console.log(this.state.main_system_control, 'render time')
        return (
            <Fragment>
                <div className="policy_steps card-container">
                    <Tabs size="small" tabPosition='left' type="card" activeKey={this.state.tabSelected} onChange={this.callback}>
                        <TabPane tab="APPS" key="1">
                            <AppList
                                apk_list={this.state.dealerApps}
                                dataLength={this.state.dealerApps.length}
                                handleCheckApp={this.handleCheckApp}
                                handleCheckAllAppPolicy={this.handleCheckAllAppPolicy}
                                guestAll={this.state.guestAlldealerApps}
                                encryptedAll={this.state.encryptedAlldealerApps}
                                enableAll={this.state.enableAlldealerApps}
                                onSelectChange={this.onSelectChange}
                                isCheckAllButtons={true}
                                apps='dealerApps'
                                isSwitch={true}
                                isCheckbox={true}
                                pageType={'dealerApps'}
                            />

                        </TabPane>
                        <TabPane tab="APP PERMISSION" key="2">
                            <AppList
                                apk_list={this.state.appPermissions}
                                dataLength={this.state.appPermissions.length}
                                handleCheckAllAppPolicy={this.handleCheckAllAppPolicy}
                                handleCheckApp={this.handleCheckApp}
                                guestAll={this.state.guestAllappPermissions}
                                encryptedAll={this.state.encryptedAllappPermissions}
                                enableAll={this.state.enableAllappPermissions}
                                onSelectChange={this.onSelectChange}
                                isCheckAllButtons={true}
                                pageType={'appPermissions'}
                                appPermissions='appPermissions'
                                isSwitch={true}
                            // isCheckbox={true}
                            />

                        </TabPane>
                        <TabPane tab="SETTINGS PERMISSION" key="3">

                            <AppList
                                allExtensions={this.state.allExtensions}
                                dataLength={this.state.allExtensions.length}
                                handleCheckAllAppPolicy={this.handleCheckAllAppPolicy}
                                handleCheckApp={this.handleCheckApp}
                                guestAll={this.state.guestAllallExtensions}
                                encryptedAll={this.state.encryptedAllallExtensions}
                                enableAll={this.state.enableAllallExtensions}
                                isCheckAllButtons={true}
                                pageType={'allExtensions'}
                                secureSettings='allExtensions'
                                isSwitch={true}
                                AddPolicy={true}
                            />
                        </TabPane>
                        <TabPane tab="SYSTEM PERMISSION" key="4">
                            <div>
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
                                <Table
                                    className="add-policy-modal-content"
                                    pagination={false}
                                    dataSource={this.renderSystemPermissions()}
                                    columns={columns}>
                                </Table>
                            </div>

                        </TabPane>
                        <TabPane tab="POLICY DETAILS" key="5">
                            <Form className="login-form">
                                <Form.Item
                                    // validateStatus={this.state.isPolicy_name}
                                    // help={this.state.policy_name_error}
                                    style={{ width: '220px' }}
                                >
                                    <span className="h3">Name</span>
                                    {getFieldDecorator('policy_name', {

                                        rules: [{
                                            required: true, message: 'Please Input Policy Name.',
                                        },
                                        {
                                            validator: this.policyNameChange,
                                        }
                                        ],

                                    })(
                                        <Input placeholder="Name" className="pol_inp" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <span className="h3">Command</span>
                                    <Input disabled value={this.state.disabledCommand} className="pol_inp" />
                                </Form.Item>
                                <Form.Item

                                >
                                    <span className="h3">Policy Note</span>
                                    {getFieldDecorator('command', {

                                        rules: [{
                                            required: true, message: 'Please Input Command Name.',
                                        }],

                                    })(
                                        <textarea placeholder="Policy Note" onChange={(e) => this.onNoteChange(e)} className="ant-input"></textarea>
                                    )}

                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>

                    <div className="add-policy-footer">
                        {this.state.tabSelected !== '1' ? <Button type="default" onClick={() => this.prev_tab()}>Previous</Button> : false}
                        {this.state.tabSelected !== '5' ? <Button type="primary" onClick={() => this.next_tab()}>Next</Button> : false}
                        {this.state.tabSelected === '5' ? <Button type="primary" onClick={() => this.savePolicy()}>Save</Button> : false}
                    </div>

                    {/* <Steps current={current} labelPlacement="vertical">
                        {this.steps.map(item => <Steps.Step icon={item.Icon} key={item.title} title={item.title} />)}
                    </Steps> */}
                    {/* <div className="steps-content">{this.steps[current].content}</div>
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
                            && <Button type="primary" onClick={() => this.savePolicy()}>Save</Button>
                        }
                        {
                            current < this.steps.length - 1
                            && <Button type="primary" onClick={() => this.next()}>Next</Button>

                        }
                    </div> */}
                </div>
            </Fragment>
        );
    }
}
const WrappedNormalApkForm = Form.create('name', 'add_apk')(AddPolicy);
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDealerApps: getDealerApps,
        getAppPermissions: getAppPermissions,
        handleCheckAppPolicy: handleCheckAppPolicy,
        handleChekSystemPermission: handleChekSystemPermission,
        handleCheckAllAppPolicy: handleCheckAllAppPolicy,
        savePolicy: savePolicy
    }, dispatch)
}

var mapStateToProps = ({ device_details, policies }) => {
    //   console.log('DEALER APPS LIST ', policies.appPermissions)
    return {
        dealerApps: policies.dealer_apk_list,
        appPermissions: policies.appPermissions,
        allExtensions: policies.allExtensions,
        systemPermissions: policies.systemPermissions,

        guestAlldealerApps: policies.guestAlldealerApps,
        encryptedAlldealerApps: policies.encryptedAlldealerApps,
        enableAlldealerApps: policies.enableAlldealerApps,

        guestAllappPermissions: policies.guestAllappPermissions,
        encryptedAllappPermissions: policies.encryptedAllappPermissions,
        enableAllappPermissions: policies.enableAllappPermissions,

        guestAllallExtensions: policies.guestAllallExtensions,
        encryptedAllallExtensions: policies.encryptedAllallExtensions,
        enableAllallExtensions: policies.enableAllallExtensions,

    }
}
// const WrappedNormalApkForm = Form.create('name', 'add_policy')(AddPolicy);

// export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalApkForm);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalApkForm);