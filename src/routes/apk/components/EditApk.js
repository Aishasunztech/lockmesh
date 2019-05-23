import React, { Component } from 'react';
import { Modal, Button, Form, Input, Icon, Col, message, Upload, Row } from 'antd';
import { BASE_URL } from "../../../constants/Application";

const successMessage = Modal.success
const errorMessage = Modal.error

let logo = '';
let apk = '';
let versionCode = '';
let versionName = '';
let packageName = '';
let details = '';
let form_data = '';
let size = ''
let edit_func = ''
export default class EditApk extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            isCancel: false

        }
    }
    success = () => {
        successMessage({
            title: 'Action Done Susscefully '
        })
    };

    showModal = (app, func) => {
        edit_func = func;
        logo = app.logo;
        apk = app.apk;
        this.setState({
            visible: true,
            apk_name: app.apk_name,
            apk_id: app.apk_id,
            func: func,
            app: app,
            isCancel: false

        });
    }

    handleCancel = () => {
        this.setState({ visible: false, isCancel: true });
    }

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title="Edit APK"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,

                    ]}
                >

                    <WrappedNormalApkForm
                        app={this.state.app}
                        editApk={this.state.func}
                        handleCancel={this.handleCancel}
                        getApkList={this.props.getApkList}
                        isCancel={this.state.isCancel}
                        ref='editApkForm'
                    />



                </Modal>
            </div>
        )
    }
}

class EditApkForm extends Component {

    constructor(props) {

        super(props);
        this.state = {
            canUoload: false,
            disableLogo: false,
            disableApk: false,
            fileList: [],
            fileList2: [],
        }
    }

    logo = this.props.app.apk_logo;
    apk = this.props.app.apk;

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                form_data = {
                    'apk_id': this.props.app.apk_id,
                    'logo': logo,
                    'apk': apk,
                    'name': values.name,
                    'versionName': versionName,
                    'versionCode': versionCode,
                    'packageName': packageName,
                    'details': details
                }
                // console.log(form_data);
                this.props.editApk(form_data);
                this.props.getApkList();
                this.props.handleCancel();
                //  console.log(form_data);
            }
            else {

            }
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            if (nextProps.isCancel) {
                this.resetUploadForm()
            }
        }
    }

    resetUploadForm = () => {
        this.props.form.resetFields()
        this.setState({
            showUploadModal: false,
            fileList: [],
            fileList2: [],
            disableApk: false,
            disableLogo: false,
        })
        size = ''
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
        let token = localStorage.getItem('token');
        let _this = this
        const props = {
            name: 'logo',
            multiple: false,
            action: BASE_URL + 'users/upload',
            headers: { 'authorization': token },
            accept: '.png, .jpg',
            disabled: this.state.disableLogo,
            className: 'upload-list-inline',
            listType: 'picture',
            fileList: this.state.fileList,

            onRemove(info) {
                _this.setState({ disableLogo: false });
            },

            beforeUpload(file) {
                _this.setState({ disableLogo: true });
            },

            onChange(info) {
                const status = info.file.status;
                let fileList = [...info.fileList];
                if (status !== 'uploading') {
                    // console.log('uploading ..')
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response.status !== false) {

                        if (info.file.response.fileName !== '') {
                            logo = info.file.response.fileName;
                        }
                        successMessage({
                            title: 'file added Successfully '
                        })
                        _this.setState({ disableLogo: true });
                    }
                    else {
                        errorMessage({
                            title: 'Error While Uploading'
                        })
                        _this.setState({ disableLogo: false });
                    }

                    //  message.success(`${info.file.name} file uploaded successfully.`);
                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList });
            },
        };

        const props2 = {
            name: 'apk',
            multiple: false,
            action: BASE_URL + 'users/upload',
            headers: { 'authorization': token },
            accept: '.apk',
            disabled: this.state.disableApk,
            className: 'upload-list-inline',
            listType: 'picture',
            fileList: this.state.fileList2,

            onRemove(info) {
                _this.setState({ disableApk: false });
            },

            beforeUpload(file) {
                _this.setState({ disableApk: true });
            },

            onChange(info) {
                const status = info.file.status;
                let fileList2 = [...info.fileList];
                if (status !== 'uploading') {
                    // console.log('uploading');
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response.status !== false) {
                        if (info.file.response.fileName !== '') {
                            apk = info.file.response.fileName;
                            size = info.file.response.size
                            // packageName = info.file.response.packageName;
                            // versionCode = info.file.response.versionCode;
                            // versionName = info.file.response.versionName;
                            // details = info.file.response.details;
                            // console.log('apk name', apk);
                        }
                        successMessage({
                            title: 'file added Successfully '
                        })
                        _this.setState({ disableApk: true });
                    }
                    else {
                        errorMessage({
                            title: 'Error While Uploading'
                        })
                        _this.setState({ disableApk: false });
                    }

                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList2 });
            },
        };
        // console.log('form prosp',this.props);

        return (
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 21 }} >
                <Form.Item className="mb-0"
                    {...formItemLayout}
                    label="Apk Name"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.props.app.apk_name,
                        rules: [{
                            required: true, message: 'Name is required',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Row>

                    <Col span={12} className="upload_file">
                        <Form.Item

                        >
                            <div className="dropbox">
                                {getFieldDecorator('icon', {

                                })(
                                    <Upload {...props} >
                                        <Button>
                                            <Icon type="upload" /> UPLOAD LOGO
                                                </Button>
                                        {/* <p className="ant-upload-drag-icon">
                                            <Icon type="picture" />
                                        </p>
                                        <h2 className="ant-upload-hint">UPLOAD LOGO </h2>
                                        <p className="ant-upload-text">Upload file (.jpg,.png)</p> */}
                                    </Upload>
                                )}

                            </div>
                        </Form.Item>

                    </Col>
                    <Col span={12} className="upload_file">
                        <Form.Item

                        >
                            <div className="dropbox">
                                {getFieldDecorator('apk', {

                                })(
                                    <Upload  {...props2}>
                                        <Button>
                                            <Icon type="upload" /> UPLOAD APK FILE
                                                </Button>
                                        {/* <p className="ant-upload-drag-icon">
                                            <Icon type="file" />
                                        </p>
                                        <h2 className="ant-upload-hint">UPLOAD APK FILE</h2>
                                        <p className="ant-upload-text">Upload Apk file (.apk)</p> */}
                                    </Upload>
                                )}
                                <label>Apk Size: </label><span>{size}</span>
                            </div>
                        </Form.Item>


                    </Col>

                </Row>

                <div className='submitButton' style={{ justifycontent: 'right', alignItems: 'right' }} >
                    <Button className='submitButton' type="primary" htmlType="submit" >Update</Button>
                </div>

            </Form>
        )
    }
}

const WrappedNormalApkForm = Form.create('name', 'edit_apk')(EditApkForm);