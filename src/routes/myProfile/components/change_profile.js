import React, { Component } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';

let form_data = '';
export default class ChangeProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,

        }
    }
    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModal = () => {
        // console.log('lksdjkldafdsfaasdf');

        this.setState({
            visible: true,
            name: this.props.profile.firstName + ' ' + this.props.profile.lastName,

        });
    }


    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    render() {

        const { visible, loading } = this.state;
        const number = this.state.number;
        const tips = 'A prime is a natural number greater than ';

        return (
            <div>
                <Modal
                    visible={visible}
                    title="Change Profile"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={false}
                >

                <EditFormCreate 
                    profile={this.props.profile} 
                    handleCancel={this.handleCancel}
                    updateUserProfile={this.props.updateUserProfile}
                    
                />

                </Modal>
            </div>
        )
    }
}


class EditForm extends Component {
    constructor(props) {
        super(props)
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err)
            {
                // console.log('done', values);
                this.props.updateUserProfile(values);
                this.props.handleCancel();
               
            }
        });
    }
    
    render() {
 
        return (
            <Form onSubmit={this.handleSubmit}>

                <Form.Item
                    label="First Name "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}
                >
                 {this.props.form.getFieldDecorator('first_Name', {
                      initialValue: this.props.profile.firstName,
                    rules: [{ required: true, message: 'Please input your First Name!' }],
                })(

                    <Input />
                )}
                </Form.Item>

                <Form.Item
                    label="Last Name "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12 }}

                >
               {this.props.form.getFieldDecorator('Last_Name', {
                    initialValue: this.props.profile.lastName,
                    rules: [{ required: true, message: 'Please input your Last Name!' }],
                })(
             
                    <Input />
                )}
                </Form.Item>
                <Form.Item>
               {this.props.form.getFieldDecorator('dealerId', {
                    initialValue: this.props.profile.dealerId,
                })(
             
                    <Input type='hidden' />
                )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                 <Button key="back" type="button" onClick={this.props.handleCancel}>Return</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>

            </Form>
        )
    }
}

const EditFormCreate = Form.create({ name: 'Edit_form' })(EditForm);

