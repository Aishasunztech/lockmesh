import React, { Component, Fragment } from 'react';
import { Col, Row, Switch, Button, Form, Input, Select, InputNumber } from 'antd';
import { checkValue, convertToLang } from '../../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../../constants/Constants';
import { Button_Cancel, Button_submit, Button_Add } from '../../../../constants/ButtonConstants';
import { Required_Fields } from '../../../../constants/DeviceConstants';
import { Guest, ENCRYPT } from '../../../../constants/TabConstants';


class AddUserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            help: '',
            visible: false,
            guest: false,
            encrypt: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        console.log('test submit');
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(err, 'form', values);
            values['guest'] = this.state.guest;
            values['encrypt'] = this.state.encrypt;
            console.log(values);

            if (values.iccid === '') {
                this.setState({
                    validateStatus: 'error',
                    // help: "ICC ID is Required" // convertToLang(this.props.translation[User_Name_require], "Name is Required")
                })
            } else if (values.iccid.length < 20) {
                this.setState({
                    validateStatus: 'error',
                    // help: "ICC ID should be 20 number long" // convertToLang(this.props.translation[User_Name_require], "Name is Required")
                })
            }
            if (!err) {


                // if (/[^A-Za-z \d]/.test(values.name)) {
                //     this.setState({
                //         validateStatus: 'error',
                //         help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
                //     })
                // } else {
                this.props.AddSimHandler(values);
                this.props.handleCancel();
                this.handleReset();

                // }
            }

        });
    }
    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)

        if (fieldvalue === '') {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
            })
        }
        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }


    componentDidMount() {
    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    // handleChecked = (e, name) => {
    //     e.preventDefault();
    //     this.setState({
    //         name: !this.state.name
    //     })
    // }


    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.state.type);
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>
                    {/* {(this.props.user) ? <Form.Item>
                    {this.props.form.getFieldDecorator('user_id', {
                        initialValue: this.props.user.user_id,
                    })(
                        <Input type='hidden' />
                    )}
                </Form.Item> : null} */}


                    <Form.Item

                        label="ICC-ID" // {convertToLang(this.props.translation[Name], "Name")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        validateStatus={this.state.validateStatus}
                        help={this.state.help}
                    >
                        {this.props.form.getFieldDecorator('iccid', {
                            initialValue: this.props.user ? this.props.user.user_name : '',
                            rules: [
                                {
                                    required: true, message: convertToLang(this.props.translation[User_Name_require], "ICC-ID is Required"),
                                }
                            ],
                        })(
                            <Input onChange={(e) => this.handleNameValidation(e)} />
                        )}
                    </Form.Item>

                    <Form.Item

                        label="Name" // {convertToLang(this.props.translation[Name], "Name")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        validateStatus={this.state.validateStatus}
                        help={this.state.help}
                    >
                        {this.props.form.getFieldDecorator('name', {
                            initialValue: this.props.user ? this.props.user.user_name : '',
                            rules: [
                                {
                                    required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is Required"),
                                }
                            ],
                        })(
                            <Input onChange={(e) => this.handleNameValidation(e)} />
                        )}
                    </Form.Item>
                    <Form.Item

                        label="Note" // {convertToLang(this.props.translation[Email], "Email")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('note', {
                            initialValue: this.props.user ? this.props.user.email : '',
                            rules: [{
                                // type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], "The input is not valid E-mail!"),
                            },
                            {
                                // required: true, message: convertToLang(this.props.translation[Required_Email], "Email is Required!"),
                            }],
                        })(
                            <Input onChange={(e) => this.check} />
                        )}
                    </Form.Item>

                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={6} />
                        {/* <Col span={6}></Col> */}
                        <Col span={9}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "guest");
                                this.setState({
                                    guest: !this.state.guest
                                })
                            }}
                                //  checked={extension.guest === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={9}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "encrypted");
                                this.setState({
                                    encrypt: !this.state.encrypt
                                })
                            }}
                                // checked={extension.encrypted === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        {/* <Col span={3} /> */}
                    </Row>

                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[Button_Add], "Add")} </Button>
                    </Form.Item>

                </Form>


            </div>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddUserForm);
export default WrappedAddDeviceForm;