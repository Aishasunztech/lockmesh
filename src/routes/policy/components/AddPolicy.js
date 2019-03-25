import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon, Steps, message } from "antd";
import AppList from "./AppList";
import styles from './policy.css'

export default class AddPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };

        this.steps = [{
            title: 'First',
            content: (
                <AppList
                    apk_list={this.props.apk_list}
                />
            ),
        }, {
            title: 'Second',
            content: (
                <AppList
                    app_list={this.props.app_list}
                />
            ),
        }, {
            title: 'Last',
            content: "hello",
        }];
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
                            current < this.steps.length - 1
                            && <Button type="primary" onClick={() => this.next()}>Next</Button>
                        }
                        {
                            current === this.steps.length - 1
                            && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                        }
                        {
                            current > 0
                            && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    Previous
                            </Button>
                            )
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}
