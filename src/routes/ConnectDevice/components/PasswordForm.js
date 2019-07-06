import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
import {
    PUSH_APPS,
    WIPE_DEVICE,
    PULL_APPS,
    POLICY
} from "../../../constants/ActionTypes"

class PassworForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.props.actionType, 'action type');
        this.props.form.validateFieldsAndScroll((err, values) => {
            //  console.log(this.props.actionType, 'action type');
            if (!err) {
                if (this.props.actionType === PUSH_APPS) {
                    this.props.checkPass({ password: values.pass, device: this.props.device }, this.props.actionType);
                } else if (this.props.actionType === WIPE_DEVICE) {
                    this.props.checkPass({ password: values.pass, device: this.props.device }, this.props.actionType);

                }
                else if (this.props.actionType === PULL_APPS) {
                    this.props.checkPass({ password: values.pass, device: this.props.device }, this.props.actionType);

                }
                else if (this.props.actionType === POLICY) {
                    this.props.checkPass({ password: values.pass, device: this.props.device }, this.props.actionType);
                }
                else if (this.props.actionType == 'back_up') {
                    // console.log("adddsadas");
                    this.props.checkPass({ password: values.pass });
                }
            }
        });
        this.props.form.resetFields()
        this.props.handleCancel(false, this.props.actionType);
    }

    render() {
        const { visible, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">
                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <h4>PANEL PASSWORD <br />REQUIRED FOR<br /> THIS ACTION</h4>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    {
                        this.props.form.getFieldDecorator('pass', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true, message: 'Please input your password!',
                                }
                            ],
                        })(
                            <Input.Password className="password_field" type='password' required placeholder="Enter Password" autoComplete='password' />
                        )
                    }
                </Form.Item>
                <Form.Item className="edit_ftr_btn1"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        )
    }
}
const WrappedForm = Form.create()(PassworForm)
export default WrappedForm