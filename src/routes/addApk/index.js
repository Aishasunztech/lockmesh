import React, { Component } from "react";
// import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
// import Picky from 'react-picky';
import styles from './addapk.css';
import { Link } from 'react-router-dom';
import 'react-picky/dist/picky.css';
import { bindActionCreators } from "redux";
import { BASE_URL } from "../../constants/Application";
import { addApk, } from "../../appRedux/actions/Apk";

import { Row, Icon, Card, Button, Divider, Form, Input, Upload, Col, message } from 'antd';

// import asyncComponent from "util/asyncComponent";
let token = sessionStorage.getItem('token');
let logo = '';
let apk = '';
let form_data = '';
class AddApk extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }



    render() {

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 50 }}>

                </Row>

                <div style={{ marginTop: - 90 }}>
                    <Row>

                        <Card style={{ borderRadius: 15, width: '100%', margin: 30, }}>
                            <div >
                                <h1 style={{ float: "left", marginTop: "5px" }}>Upload APK</h1>
                                <Link to="/apk-list">
                                    <Button type="primary" style={{ float: "right", marginBottom: "16px" }}>Back</Button>
                                </Link>
                                <Divider />
                                <div style={{ justifyContent: 'center' }} >
                                    <WrappedNormalApkForm addApk={this.props.addApk} />
                                </div>

                            </div>
                        </Card>

                    </Row>
                </div>
            </div>
        )
    }
}

let disableLogo = false;
let disableApk = false;
class AddApkForm extends Component {

    constructor(props) {

        super(props);
        this.state = {
            canUoload: false
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                form_data = { 'logo': logo, 'apk': apk, 'name': values.name }
                // console.log(form_data);
                this.props.addApk(form_data);
                disableLogo = false;
                disableApk = false;
                //  console.log(form_data);
            }
            else {

            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },

            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const Dragger = Upload.Dragger;

        const props = {
            name: 'logo',
            multiple: false,
            action: BASE_URL + 'users/addApk',
            headers: { 'authorization': token },
            accept: '.png, .jpg',
            disabled: disableLogo,

            onChange(info) {
                const status = info.file.status;
                if (status !== 'uploading') {
                    // console.log('uploading ..')
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response !== 'Error while Uploading') {
                        disableLogo = true;

                        if (info.file.response.fileName !== '') {
                            logo = info.file.response.fileName;
                        }
                        message.success('file added Successfully ');
                    }
                    else {
                        message.error('Error While Uploading');
                        disableLogo = false;
                    }

                    //  message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        const props2 = {
            name: 'apk',
            multiple: false,
            action: BASE_URL + 'users/addApk',
            headers: { 'authorization': token },
            accept: '.apk',
            disabled: disableApk,
            onChange(info) {
                const status = info.file.status;

                if (status !== 'uploading') {
                    // console.log('uploading');
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response !== 'Error while Uploading') {

                        disableApk = true;

                        if (info.file.response.fileName !== '') {
                            apk = info.file.response.fileName;
                            // console.log('apk name', apk);
                        }
                        message.success('file added Successfully ');
                    }
                    else {
                        message.error('Error While Uploading');
                        disableApk = false;
                    }

                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 21 }} >
                <Form.Item className="mb-0"
                    {...formItemLayout}
                    label="Apk Name "
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: 'Name is required',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Row>
                    <Col span={6} ></Col>
                    <Col span={6} className="upload_file">
                        <Form.Item

                        >
                            <div className="dropbox">
                                {getFieldDecorator('icon', {
                                    rules: [{
                                        required: true, message: 'File is required',
                                    }],

                                })(
                                    <Dragger {...props} >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="picture" />
                                        </p>
                                        <h2 className="ant-upload-hint">UPLOAD LOGO </h2>
                                        <p className="ant-upload-text">Upload file (.jpg,.png)</p>
                                    </Dragger>
                                )}

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={6} className="upload_file">
                        <Form.Item

                        >
                            <div className="dropbox">
                                {getFieldDecorator('apk', {

                                    rules: [{
                                        required: true, message: 'File is required',
                                    }],

                                })(
                                    <Dragger  {...props2}>
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="file" />
                                        </p>
                                        <h2 className="ant-upload-hint">UPLOAD APK FILE</h2>
                                        <p className="ant-upload-text">Upload Apk file (.apk)</p>
                                    </Dragger>
                                )}

                            </div>
                        </Form.Item>


                    </Col>
                    <Col span={6} ></Col>
                </Row>

                <div className='submitButton' style={{ justifycontent: 'right', alignItems: 'right' }} >
                    <Button className='submitButton' type="default" htmlType="submit" >Upload</Button>
                </div>

            </Form>
        )
    }
}



const WrappedNormalApkForm = Form.create('name', 'add_apk')(AddApkForm);


const mapStateToProps = ({ apk_list }) => {

    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list
    };
}

export default connect(mapStateToProps, { addApk })(AddApk);
