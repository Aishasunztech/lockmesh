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
            titleText: '',
            domainList: []
        }
    }

    showModal = (handleSubmit, pgpEmail = null, titleText = convertToLang(this.props.translation[''], "Add PGP Email")) => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            pgpEmail: pgpEmail,
            titleText: titleText,
        });

        this.props.getDomains(false);

    }

    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({ visible: false });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.domainList.length !== nextProps.domainList.length) {
            this.setState({
                domainList: nextProps.domainList
            })
        }
    }

    renderDomainOptions = () => {
        return this.state.domainList.map((domain) => {
            return <Select.Option key={domain.id} value={domain.name}>{domain.name}</Select.Option>
        })

    }
    checkUsername = (rule, value, callback) => {
        if(!value || !value.length){
            callback();
        }
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value + '@gmail.com')) {
        // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value + '@gmail.com')) {
            callback();
        } else {
            callback('Please insert a valid Username.');
            // console.log(value);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log("username:", values);
                let payload= {
                    type: 'pgp_email',
                    product_data: {
                        domain: values.domain
                    }
                };

                if (!values.username) {
                    payload.auto_generate = true
                } else {
                    payload.product_data.username = values.username
                }
                this.props.addProduct(payload);
            }
        });
    }
    render() {
        const { visible, loading } = this.state;
        const formItemLayout = {
        };
        // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        // const usernameError = isFieldTouched('username') && getFieldError('username');

        return (

            <Modal
                visible={visible}
                title={this.state.titleText}
                maskClosable={false}
                onCancel={this.handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={this.handleCancel}
                    >
                        Close
                        {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmit}
                    >
                        {convertToLang(this.props.translation[''], "Create or Generate Email")}
                    </Button>,
                ]}
                className="edit_form"
                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
            >

                <Form
                    {
                    ...formItemLayout
                    }
                >
                    <p>Note: Username will be auto generated if its is not provided</p>
                    <Form.Item
                        label="Select Domain"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        {this.props.form.getFieldDecorator('domain', {
                            rules: [{
                                required: true,
                                message: 'Please select a domain!' 
                            }],
                        })(
                            <Select placeholder="Please select a domain">
                                {this.renderDomainOptions()}
                            </Select>,
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        // validateStatus={usernameError ? 'error' : ''} 
                        // help={usernameError || ''}
                    >
                        {this.props.form.getFieldDecorator('username', {
                            rules: [{
                                // required: true, message: ' ',
                            },
                            {
                                validator: this.checkUsername,
                            }
                            ],
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
