import React, { Component, Fragment } from 'react'
import { Tabs, Button, Row, Col, Select, Input, Form, Checkbox, Icon, Steps, message, Table, Divider, Tag, Switch } from "antd";
import AppList from "./AppList";
import { connect } from "react-redux";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, SECURE_SETTING } from '../../../constants/Constants';
import styles from './policy.css';
import { bindActionCreators } from "redux";
import { getDealerApps, } from '../../../appRedux/actions/ConnectDevice';
import { handleCheckAppPolicy, getAppPermissions, handleChekSystemPermission, savePolicy, handleCheckAllAppPolicy } from '../../../appRedux/actions/Policy';

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
            policy_name: '',
            command: '',
            isCommand: 'success',
            isPolicy_name: 'success',
            policy_name_error: '',
            command_error: '',
            disabledCommand: '',
            pushAppsIds: [],
            appPermissionsIds: [],

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

    handleCheckApp = (value, key, id, arrayOf) => {
        this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING)
        // console.log(value, key, id, arrayOf, 'data is');
    }

    handleCheckAllAppPolicy = (value, key, arrayOf) => {
        this.props.handleCheckAllAppPolicy(value, key, arrayOf, SECURE_SETTING)
    }

    savePolicy = () => {

        if (this.state.pushAppsIds.length) {
            for (let id of this.state.pushAppsIds) {
                let index = this.state.dealerApps.findIndex(item => item.apk_id == id);
                this.state.pushApps.push(this.state.dealerApps[index])
            }
        }

        let appPermissions = [];
        let secure_apps = [];

        if (this.state.appPermissionsIds.length) {
            // console.log('app permission', this.state.appPermissions)
            for (let id of this.state.appPermissionsIds) {
                let obj = this.state.appPermissions.find(item => item.id == id)
                if (obj) appPermissions.push(obj);

            }
        }

        let main_extension = this.state.allExtensions.find(item => item.uniqueName == SECURE_SETTING);
        // console.log(main_extension)
        if (main_extension) {
            secure_apps = main_extension.subExtension
        }
        // console.log('appPermissions', appPermissions, 'secure_apps', this.state.allExtensions)

        let data = {
            policy_name: this.state.policy_name,
            policy_note: this.state.command,
            push_apps: this.state.pushApps,
            app_list: appPermissions,
            secure_apps: secure_apps,
            system_permissions: this.state.systemPermissions

        }
        // console.log('polcy is', data);

        if ((this.state.policy_name !== '') && this.state.command !== '') {
            if (/[^A-Za-z \d]/.test(this.state.policy_name)) {
                this.setState({
                    isPolicy_name: 'error',
                    policy_name_error: "Please insert only alphabets and numbers."
                })
            }
            else {
                this.props.savePolicy(data);
                this.props.handlePolicyModal(false);
                this.props.getPolicies();
                this.props.getDealerApps();
                this.props.getAppPermissions();
                this.setState({
                    current: 0,
                    policy_name: '',
                    command: '',
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

        }
        else {
            if (this.state.policy_name === '') {
                this.setState({
                    isPolicy_name: 'error',
                    policy_name_error: "Please Input Policy Name"
                })
            }
            if (this.state.command === '') {
                this.setState({
                    isCommand: 'error',
                    command_error: "Please Input Policy Note"
                })
            }
        }
    }


    componentDidMount() {
        this.props.getDealerApps();
        this.props.getAppPermissions();
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

        })
    }



    // componentWillReceiveProps(prevProps){
    //     console.log(this.props.dealerApps,'object', prevProps.dealerApps)
    //     if(this.props !== prevProps){
    //         this.setState({dealerApps: this.props.dealerApps})
    //     }
    // }

    componentDidUpdate(prevProps) {
        //   console.log(this.props.allExtensions, 'add policy page data is ', prevProps.allExtensions);
        if (this.props !== prevProps) {
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
                action: <Switch disabled checked={this.state.systemPermissions.wifi_status} onClick={(e) => this.props.handleChekSystemPermission(e, 'wifi_status')} size="small" />
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

    policyNameChange = (e) => {

        this.setState({ 
            policy_name: e.target.value,
             policy_name_error: '',
            isPolicy_name: 'success' ,
            disabledCommand: '#'+e.target.value.replace(/ /g, '_')
        })
    }

    callback = (activeKey) => {
        this.setState({ tabSelected: activeKey })
    }

    prev_tab = ()=> {
        let tabSelected = parseInt(this.state.tabSelected);
        tabSelected--;
        this.setState({tabSelected: String(tabSelected)})
    }

    next_tab = ()=> {
        let tabSelected = parseInt(this.state.tabSelected);
        tabSelected++;
        this.setState({tabSelected: String(tabSelected)})
    }

    render() {
        // console.log('console the applist', this.state.dealerApps);

        return (
            <Fragment>
                <div className="policy_steps card-container">
                    <Tabs size="small" tabPosition='left' type="card" activeKey={this.state.tabSelected} onChange={this.callback}>
                        <TabPane tab="APPS" key="1">
                            <AppList
                                apk_list={this.state.dealerApps}
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
                                isCheckbox={true}
                            />

                        </TabPane>
                        <TabPane tab="SETTINGS PERMISSION" key="3">
                            <AppList
                                allExtensions={this.state.allExtensions}
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
                            <Table
                            className="add-policy-modal-content"
                                pagination={false}
                                dataSource={this.renderSystemPermissions()}
                                columns={columns}>
                            </Table>
                        </TabPane>
                        <TabPane tab="POLICY DETAILS" key="5">
                            <Form className="login-form add-policy-modal-content"> 
                                <Form.Item
                                    validateStatus={this.state.isPolicy_name}
                                    help={this.state.policy_name_error}
                                >
                                    <span className="h3">Name</span>
                                    <Input placeholder="Name" onChange={(e) => this.policyNameChange(e)} className="pol_inp" />
                                </Form.Item>
                                <Form.Item>
                                    <span className="h3">Command</span>
                                    <Input disabled value={this.state.disabledCommand} className="pol_inp" />
                                </Form.Item>
                                <Form.Item
                                    validateStatus={this.state.isCommand}
                                    help={this.state.command_error}
                                >
                                    <span className="h3">Policy Note</span>
                                    <textarea placeholder="Policy Note" onChange={(e) => this.setState({ command: e.target.value, command_error: '', isCommand: 'success' })} className="ant-input"></textarea>

                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>

                    <div class="add-policy-footer">
                        {this.state.tabSelected !== '1' ? <Button type="primary" onClick={() => this.prev_tab()}>Previous</Button> : false}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPolicy);