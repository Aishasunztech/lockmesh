import React, { Component } from 'react';
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default class PolicyInfo extends Component {
    constructor(props) {
        super(props);
        this.state={
            selected: '1'
        }

    }

    componentDidMount(){
        this.setState({
            selected: this.props.selected
        })
    }

    componentDidUpdate(prevProps){
        if(this.props !== prevProps){
            console.log('revire', prevProps)
            this.setState({selected: this.props.selected})
        }
    }

    callback = (key) => {
        console.log(key, 'id');
        this.setState({selected: key})
    }

    render() {
        console.log('info list ', this.props.selected)

        return (
            <div>
                <Tabs onChange={this.callback} activeKey={this.state.selected} type="card">
                    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                </Tabs>
            </div>
        )
    }
}