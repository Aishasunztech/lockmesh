import React, { Component } from 'react'
import { Button, Form, Input } from "antd";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { 
    submitPassword
} from "../../../appRedux/actions/ConnectDevice"
import styles from "./password.css";
import { convertToLang } from '../../utils/commonUtils';
import { ONLY_NUMBER_ARE_ALLOWED, PASSWORDS_ARE_INCONSISTENT, PLEASE_INPUT_YOUR_PASSWORD, Password_TEXT, PLEASE_CONFIRM_YOUR_PASSWORD, PASSWORD_AGAIN, SET_PASSWORD } from '../../../constants/DeviceConstants';


class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdType: ''
        }
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            style:{
                marginTop:"8px"
            }
        };
    }
    componentDidMount() {
        this.setState({
            pwdType: this.props.pwdType
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                pwdType: this.props.pwdType
            });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
    
            if (!err) {
                this.props.submitPassword(values, this.state.pwdType);
            }
        });
    }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if((value!==undefined) && value.length>0 && !Number(value)){
            // form.validateFields(['pwd'], {force:true});
            callback(convertToLang(this.props.translation[ONLY_NUMBER_ARE_ALLOWED], "Only Number are allowed"));
        }

        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
            
        }
        callback();
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if((value!==undefined) && value.length>0 && !Number(value)){
            // form.validateFields(['pwd'], {force:true});
            callback(convertToLang(this.props.translation[ONLY_NUMBER_ARE_ALLOWED], "Only Number are allowed"));
        }
        if (value && value !== form.getFieldValue('pwd')) {
            callback(convertToLang(this.props.translation[PASSWORDS_ARE_INCONSISTENT], "passwords are inconsistent!"));
        } else {
            callback();
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    render() {
        return (
            <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="new-password">
                <Form.Item {...this.formItemLayout}>
                    {
                        this.props.form.getFieldDecorator('pwd', {
                            rules: [
                                {
                                    required: true, message: convertToLang(this.props.translation[PLEASE_INPUT_YOUR_PASSWORD], "Please input your password!"),
                                }, {
                                    validator: this.validateToNextPassword,
                                }
                            ],
                        })(

                            <Input.Password placeholder={convertToLang(this.props.translation[Password_TEXT], "Password")} type="password" style={{ width: '100%' }} />
                        )
                    }
                </Form.Item>

                <Form.Item {...this.formItemLayout} className="pwdinput" >
                    {
                        this.props.form.getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true, message: convertToLang(this.props.translation[PLEASE_CONFIRM_YOUR_PASSWORD], "Please confirm your password!"),
                                }, {
                                    validator: this.compareToFirstPassword,
                                }
                            ],
                        })(
                            <Input.Password type="password" placeholder={convertToLang(this.props.translation[PASSWORD_AGAIN], "Password Again")} onBlur={this.handleConfirmBlur} style={{ width: '100%' }} />
                        )
                    }
                </Form.Item>

                <Form.Item {...this.formItemLayout} className="pwdinput">
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}> {convertToLang(this.props.translation[SET_PASSWORD], "Set Password")}</Button>
                </Form.Item>
            </Form>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitPassword: submitPassword
    }, dispatch);
}
var mapStateToProps = ({ device_details, settings }) => {

    return {
        translation: settings.translation
    };
}

const wrappedPasswordForm = Form.create()(Password)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedPasswordForm);