import React, { Component } from 'react';
import { Tabs } from 'antd';
import Permissions from "./permissions";


const TabPane = Tabs.TabPane;

export default class PolicyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '1',
            policy: null
        }

    }

    componentDidMount() {
        this.setState({
            selected: this.props.selected,
            policy : this.props.policy
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
        console.log('info list ', this.props.selected)

        return (
            <div>
                <Tabs onChange={this.callback} activeKey={this.state.selected} type="card">
                    <TabPane tab="Selected Apps " key="1">

                    </TabPane>
                    <TabPane tab="App Permissions " key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Secure Settings Permissions" key="3">Content of Tab Pane 3</TabPane>
                    <TabPane tab="System Controls Permissions" key="4">Content of Tab Pane 4</TabPane>
                    <TabPane tab="Policy Details" key="5">Permissions Tab</TabPane>
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