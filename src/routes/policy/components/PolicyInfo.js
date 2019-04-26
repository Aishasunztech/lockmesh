import React, { Component } from 'react';
import { Tabs, Table } from 'antd';
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

    renderSystemPermissions = ()=> {
       
        if(this.state.policy.controls){
            if(this.state.policy.controls.length){
                return this.state.policy.controls.map((item, index)=> {
                    console.log('object, ', item)
                    return{
                        rowKey: index,
                        name: item.name,
                        action: <span style={{color: (item.value === true || item.value === 1) ? 'green' : 'red'}} >{(item.value === true || item.value === 1) ? 'On' : 'Off'}</span>
                    }
                   
                })
            }
        }
      
    }


    componentDidMount() {
        this.setState({
            selected: this.props.selected,
            policy: this.props.policy
        })
    }

    componentWillReceiveProps(nextProp) {
        if (this.props.selected !== nextProp.selected) {
            this.setState({
                selected: nextProp.selected,
                policy: nextProp.policy
            })
        }
    }

    callback = (key) => {
        this.setState({ selected: key })
    }

    render() {
        console.log('info list is ', this.props.policy.push_apps)

        const PolicyDetail = [{
            key:1,
            name: this.state.policy.policy_name,
            note: this.state.policy.policy_note,
            command: this.state.policy.policy_command,

        }]

        return (
            <div>
                <Tabs onChange={this.callback} activeKey={this.state.selected} type="card">
                    <TabPane tab="Selected Apps " key="1">
                        <AppList
                            apk_list={this.state.policy.push_apps}
                            handleCheckApp={this.handleCheckApp}
                            apps='dealerApps'
                            isSwitch={false}
                        />
                    </TabPane>
                    <TabPane tab={APPLICATION_PERMISION} key="2">
                        <AppList
                            apk_list={this.state.policy.app_list}
                            handleCheckApp={this.handleCheckApp}
                            appPermissions='appPermissions'
                            isSwitch={false}
                        />
                    </TabPane>
                    <TabPane tab={SECURE_SETTING_PERMISSION} key="3">
                        <AppList
                            allExtensions={this.state.policy.permissions}
                            handleCheckApp={this.handleCheckApp}
                            secureSettings='allExtensions'
                            isSwitch={false}
                        />
                    </TabPane>
                    <TabPane tab={SYSTEM_PERMISSION} key="4">
                        <Table
                            pagination={false}
                            dataSource={this.renderSystemPermissions()}
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