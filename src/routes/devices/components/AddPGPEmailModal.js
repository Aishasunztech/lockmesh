import React, { Component } from 'react'
import { Modal, message, Form, Select, Input, Button, Icon, Divider } from 'antd';

import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Add_User } from '../../../constants/ButtonConstants';

class AddPGPEmailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            handleSubmit: null,
            pgpEmail: null,
            titleText: ''
        }
    }



    showModal = (handleSubmit, pgpEmail = null, titleText = convertToLang(this.props.translation[Button_Add_User], "Add PGP Email")) => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            pgpEmail: pgpEmail,
            titleText: titleText,
        });

    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    render() {
        const { visible, loading } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (

            <Modal
                visible={visible}
                title={this.state.titleText}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                className="edit_form"
                okText={convertToLang(this.props.translation[''], "Create")}
                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
            >

                <Form {...formItemLayout}>
                    <Form.Item
                        label="Confirm Password"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        {this.props.form.getFieldDecorator('domain', {
                            rules: [{
                                required: true,
                                // message: 'Please select your country!' 
                            }],
                        })(
                            <Select placeholder="Please select a domain">
                                <Select.Option value="china">China</Select.Option>
                                <Select.Option value="usa">U.S.A</Select.Option>
                            </Select>,
                        )}
                    </Form.Item>
                    <Button>Generate PGP Email</Button>
                    <Divider>OR</Divider>
                    <Form.Item
                        label="Confirm Password"
                    // validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}
                    >
                        {this.props.form.getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}
                    </Form.Item>

                </Form>
            </Modal>

        )

    }
}

export default Form.create({ name: 'addPGPEmail' })(AddPGPEmailModal);
