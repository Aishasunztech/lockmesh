import React, { Component, Fragment } from 'react'
import { Button, Avatar, Input, Modal, Form, Icon, Steps, Table, Switch } from "antd";
import AppList from "./AppList";
import { SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, SECURE_SETTING } from '../../../constants/Constants';
import styles from './policy.css';
import { BASE_URL } from '../../../constants/Application';

const TextArea = Input;
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

            guestAlldealerApps: false,
            encryptedAlldealerApps: false,
            enableAlldealerApps: false,

            guestAllappPermissions: false,
            encryptedAllappPermissions: false,
            enableAllappPermissions: false,

            guestAllallExtensions: false,
            encryptedAllallExtensions: false,
            enableAllallExtensions: false,

            editAblePolicy: this.props.editAblePolicy,
            addPushAppModal: false,

            selectedRowKeysApps : [],
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

    handleCheckApp = (value, key, id, arrayOf) => {
        this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING)
        // console.log(value, key, id, arrayOf, 'data is');
    }

    handleCheckAllAppPolicy = (value, key, arrayOf) => {
        this.props.handleCheckAllAppPolicy(value, key, arrayOf, SECURE_SETTING)
    }

    componentDidMount() {
        if (this.props.editAblePolicy.length) {
            let editAblePolicy = this.props.editAblePolicy.find(item => item.id == this.props.editAblePolicyId)
            // console.log(this.props.editAblePolicyId, 'id')
            // console.log(this.props.editAblePolicy, 'policys')
            // console.log(editAblePolicy, 'eidtable')
            if (editAblePolicy) {
                this.setState({
                    editAblePolicy: editAblePolicy,
                    current: 0,
                    command: editAblePolicy.policy_note,
                    policy_name: editAblePolicy.policy_name
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        // console.log('edit able changed', this.props.editAblePolicy);
        if (this.props !== prevProps) {

            if (this.props.editAblePolicy.length) {
                let editAblePolicy = this.props.editAblePolicy.find(item => item.id == this.props.editAblePolicyId)
                console.log('eidted', editAblePolicy)
                if (editAblePolicy) {
                    this.setState({
                        editAblePolicy: editAblePolicy,
                        // current: 0,
                        command: editAblePolicy.policy_note,
                        policy_name: editAblePolicy.policy_name
                    });
                }
            }
        }
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
        console.log(controls)
        if (controls) {

            return [{
                rowKey: 'wifi_status',
                name: 'Wifi',
                action:
                    // this.props.isSwitch ?
                    <Switch disabled checked={controls.wifi_status} onClick={(e) => this.props.handleEditPolicy(e, 'wifi_status', '', 'controls', this.state.editAblePolicy.id)} size="small" />
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
            this.state.editAblePolicy.policy_note = this.state.command;
            Modal.confirm({
                title: 'Are You Sure, You Want to Save Changes',
                onOk: () => {
                    this.props.SavePolicyChanges(this.state.editAblePolicy);
                    this.props.editPolicyModalHide();
                    this.setState({ current: 0 })
                },
                okText: 'Save',
            });
        }
    }

    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys: selectedRowKeys });
      };


    reset_steps = () => [
        this.setState({ current: 0 })
    ]

    hideAddPushAppModal = () => {
        this.setState({
            addPushAppModal: false,
            selectedRowKeys: []
        })
    }

    addApps = (dataType) => {
        this.setState({
            addPushAppModal: true,
            addDataOf: dataType
        })
    }

    addItems = () => {
        if(this.state.selectedRowKeys.length){
            this.props.addAppsToPolicies(this.state.selectedRowKeys, this.props.editAblePolicyId, this.state.addDataOf)
            this.hideAddPushAppModal()
        }
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    render() {
        const { current } = this.state;
        // console.log(this.props.encryptedAlldealerApps, 'selected row')

        const { selectedRows,selectedRowKeys } = this.state;
        let rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
        };
        this.steps = [{
            title: 'SELECT APPS',
            Icon: <span className="step_counting">1</span>,
            content: (

                <AppList
                    apk_list={this.state.editAblePolicy.push_apps}
                    handleCheckApp={this.handleCheckApp}
                    handleEditPolicy={this.props.handleEditPolicy}
                    handleCheckAll={this.props.handleCheckAll}
                    guestAll={this.props.guestAlldealerApps}
                    encryptedAll={this.props.encryptedAlldealerApps}
                    enableAll={this.props.enableAlldealerApps}
                    removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                    addAppsButton={true}
                    isCheckAllButtons={true}

                    addApps = {this.addApps}
                    apps='dealerApps'
                    isSwitch={true}
                    edit={true}
                    rowId={this.state.editAblePolicy.id}
                    isCheckbox={false}
                    pageType={'dealerApps'}
                />
            ),
        }, {
            title: 'SET ' + APPLICATION_PERMISION.toUpperCase(),
            Icon: <span className="step_counting">2</span>,
            content: (
                <AppList
                    apk_list={this.state.editAblePolicy.app_list}
                    handleEditPolicy={this.props.handleEditPolicy}
                    handleCheckAll={this.props.handleCheckAll}
                    removeAppsFromPolicies={this.props.removeAppsFromPolicies}

                    handleCheckApp={this.handleCheckApp}
                    appPermissions='appPermissions'
                    addAppsButton={true}
                    isCheckAllButtons={true}

                    addApps = {this.addApps}
                    guestAll={this.props.guestAllappPermissions}
                    encryptedAll={this.props.encryptedAllappPermissions}
                    enableAll={this.props.enableAllappPermissions}
                    isSwitch={true}
                    edit={true}
                    rowId={this.state.editAblePolicy.id}
                />
            ),
        }, {
            title: 'SET ' + SECURE_SETTING_PERMISSION.toUpperCase(),
            Icon: <span className="step_counting">3</span>,
            content: (
                <AppList
                    allExtensions={this.state.editAblePolicy.secure_apps}
                    handleEditPolicy={this.props.handleEditPolicy}
                    handleCheckAll={this.props.handleCheckAll}
                    handleCheckApp={this.handleCheckApp}
                    secureSettings='allExtensions'
                    guestAll={this.props.guestAllallExtensions}
                    encryptedAll={this.props.encryptedAllallExtensions}
                    enableAll={this.props.enableAllallExtension}
                    isCheckAllButtons={true}

                    isSwitch={true}
                    edit={true}
                    rowId={this.state.editAblePolicy.id}
                />
            ),
        }, {
            title: 'SET ' + SYSTEM_PERMISSION.toUpperCase(),
            Icon: <span className="step_counting">4</span>,
            content: (
                <Table
                    pagination={false}
                    dataSource={this.renderSystemPermissions()}
                    size="small"
                    columns={columns}>
                </Table>
            ),
        }, {
            title: 'SET POLICY DETAILS',
            Icon: <span className="step_counting">5</span>,
            content: (
                <Form className="login-form">
                    <Form.Item
                        validateStatus={this.state.isPolicy_name}
                        help={this.state.policy_name_error}
                    >
                        <span className="h3">Name</span>
                        <Input placeholder="Name" disabled value={this.state.policy_name} onChange={(e) => this.setState({ policy_name: e.target.value, policy_name_error: '', isPolicy_name: 'success' })} className="pol_inp" />
                    </Form.Item>
                    <Form.Item
                        validateStatus={this.state.isCommand}
                        help={this.state.command_error}
                    >
                        <span className="h3">Policy Note</span>
                        <textarea placeholder="Policy Note" value={this.state.command} onChange={(e) => this.setState({ command: e.target.value, command_error: '', isCommand: 'success' })} className="ant-input"></textarea>

                    </Form.Item>
                </Form>

            )
        }
        ];
        return (
            <Fragment>
                <div className="policy_steps">
                    <Steps current={current} labelPlacement="vertical">
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

                        }
                    </div>

                    <Modal
                        title="Add Apps"
                        visible={this.state.addPushAppModal}
                        onOk={this.addItems}
                        onCancel={this.hideAddPushAppModal}
                        okText="Add"
                        cancelText="Cancel"
                    >
                        <Table
                            className="exp_policy"
                            style={{ margin: 0, padding: 0 }}
                            rowSelection={rowSelection}
                            size='small'
                            scroll={this.props.isHistory ? {} : {}}
                            columns={this.appsColumns}
                            align='center'
                            dataSource={
                                this.renderApp(this.state.addDataOf == 'push_apps' ? this.props.push_apps : this.props.appPermissions)
                            }
                            pagination={false}
                        />

                    </Modal>
                </div>
            </Fragment>
        );
    }
}
