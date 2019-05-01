import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
// import EditForm from './editForm';
// let editDevice;
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
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(values);
            if (!err) {
                this.props.checkPass({ password: values.pass, device: this.props.device });
            }
        });
        this.props.handleCancel();
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
                    <h4>PANNEL PASSWORD <br />REQUIRED FOR<br /> THIS ACTION</h4>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    {
                        this.props.form.getFieldDecorator('pass', {
                            rules: [
                                {
                                    required: true, message: 'Please input your password!',
                                }
                            ],
                        })(
                            <Input.Password className="password_field" type='password' required placeholder="Enter Password" />
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