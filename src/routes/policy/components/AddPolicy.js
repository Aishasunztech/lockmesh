import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Select, Input, Form, Checkbox, Icon, Steps, message, Table, Divider, Tag, Switch } from "antd";
import AppList from "./AppList";
import { connect } from "react-redux";
import {SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, APPLICATION_PERMISION, SECURE_SETTING} from '../../../constants/Constants';
import styles from './policy.css';
import { bindActionCreators } from "redux";
import { getDealerApps,  } from '../../../appRedux/actions/ConnectDevice';
import { handleCheckAppPolicy, getAppPermissions, handleChekSystemPermission, savePolicy } from '../../../appRedux/actions/Policy';

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

 class AddPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            dealerApps: [],
            steps: [],
            allExtensions: [],
            systemPermissions: [],
            policy_name: '',
            command: ''

        };

        // console.log('stat is ', this.state.dealerApps)
       
    }

    handleCheckApp = (value, key, id, arrayOf)=> {
         this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING)
        // console.log(value, key, id, arrayOf, 'data is');
    }

    savePolicy = () => {
        let data = {
            policy_name: this.state.policy_name,
            policy_note: this.state.command,
            push_apps: this.state.dealerApps,
            app_list: this.state.appPermissions,
            secure_apps: this.state.allExtensions,
            system_permissions: this.state.systemPermissions

        }

        this.props.savePolicy(data);
        this.props.handlePolicyModal(false);
        this.props.getPolicies()
    }


    componentDidMount(){
        console.log('did mount called')
        this.props.getDealerApps();
        this.props.getAppPermissions();
        this.setState({
            dealerApps: this.props.dealerApps,
            appPermissions: this.props.appPermissions,
            allExtensions: this.props.allExtensions,
            systemPermissions: this.props.systemPermissions

        })
    }


    // componentWillReceiveProps(prevProps){
    //     console.log(this.props.dealerApps,'object', prevProps.dealerApps)
    //     if(this.props !== prevProps){
    //         this.setState({dealerApps: this.props.dealerApps})
    //     }
    // }

    componentDidUpdate(prevProps){
          console.log(this.props.allExtensions, 'add policy page data is ', prevProps.allExtensions);
        if(this.props !== prevProps){
            this.setState({
                dealerApps: this.props.dealerApps,
                appPermissions: this.props.appPermissions,
                allExtensions: this.props.allExtensions,
                systemPermissions: this.props.systemPermissions
            });
      
        }
    }

    renderSystemPermissions = ()=> {
        console.log(this.state.systemPermissions, 'permissions')
        if(this.state.systemPermissions.length){
            return this.state.systemPermissions.map((item, index)=> {
                console.log('object, ', item)
                return{
                    rowKey: index,
                    name: item.name,
                    action: <Switch checked={item.value} onClick={(e)=>this.props.handleChekSystemPermission(e, item.name)} size="small" />
                }
               
            })
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
         console.log('console the applist', this.state.dealerApps);
         this.steps = [{
            title: 'SELECT APPS',
            Icon: <span className="step_counting">1</span>,
            content: (
                <AppList
                    apk_list={this.state.dealerApps}
                    handleCheckApp={this.handleCheckApp}
                    apps='dealerApps'
                />
            ),
        }, {
            title: 'SET '+ APPLICATION_PERMISION.toUpperCase(),
            Icon: <span className="step_counting">2</span>,
            content: (
                <AppList
                    apk_list={this.state.appPermissions}
                    handleCheckApp={this.handleCheckApp}
                    appPermissions='appPermissions'
                />
            ),
        }, {
            title: 'SET '+ SECURE_SETTING_PERMISSION.toUpperCase(),
            Icon: <span className="step_counting">3</span>,
            content: (
                <AppList
                allExtensions={this.state.allExtensions}
                handleCheckApp={this.handleCheckApp}
                secureSettings = 'allExtensions'
            />
            ),
        }, {
            title: 'SET '+ SYSTEM_PERMISSION.toUpperCase(),
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
                <div className="lst_stp">
                    <div className="row">
                        <div className="col-md-2 pr-0 "><label>Name:</label></div>
                        <div className="col-md-8">
                            <Input placeholder="Name" onChange={(e)=> this.setState({policy_name: e.target.value})} className="pol_inp" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 pr-0 "><label>Policy Note:</label></div>
                        <div className="col-md-8">
                            <textarea placeholder="Policy Note" onChange={(e)=> this.setState({command: e.target.value})} class="ant-input"></textarea>
                        </div>
                    </div>
                </div>
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
                            && <Button type="primary" onClick={() => this.savePolicy()}>Save</Button>
                        }
                        {
                            current < this.steps.length - 1
                            && <Button type="primary" onClick={() => this.next()}>Next</Button>

                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        getDealerApps: getDealerApps,
        getAppPermissions: getAppPermissions,
        handleCheckAppPolicy: handleCheckAppPolicy,
        handleChekSystemPermission: handleChekSystemPermission,
        savePolicy: savePolicy
    }, dispatch)
}

var mapStateToProps = ({device_details, policies}) =>{
     console.log('DEALER APPS LIST ', policies.systemPermissions)
return{
    dealerApps: policies.dealer_apk_list,
    appPermissions: policies.appPermissions,
    allExtensions: policies.allExtensions,
    systemPermissions: policies.systemPermissions

}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPolicy);