import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Select, Input, Form, Checkbox, Icon, Steps, message, Table, Divider, Tag, Switch } from "antd";
import AppList from "./AppList";
import styles from './policy.css'

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
        };

        this.steps = [{
            title: 'Menu Apps',
            content: (
                <AppList
                    apk_list={this.props.apk_list}
                />
            ),
        }, {
            title: 'Defaut Apps',
            content: (
                <AppList
                    app_list={this.props.app_list}
                />
            ),
        }, {
            title: 'Device Controls',
            content: (
                <Table
                    pagination={false}
                    dataSource={data}
                    size="small"
                    columns={columns}>
                </Table>
            ),
        }, {
            title: 'Policy Info',
            content: (
                <div className="lst_stp">
                    <div className="row">
                        <div className="col-md-2 pr-0 "><label>Name:</label></div>
                        <div className="col-md-8">
                            <Input placeholder="Name" className="pol_inp" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-2 pr-0 "><label>Note:</label></div>
                        <div className="col-md-8">
                            <textarea placeholder="Note" class="ant-input"></textarea>
                        </div>
                    </div>
                </div>
            )
        }
        ];
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
        return (
            <Fragment>
                <div className="policy_steps">
                    <Steps current={current}>
                        {this.steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
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
                            && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
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
