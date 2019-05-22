import React, { Component } from "react";
// import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
// import Picky from 'react-picky';
import styles from './addapk.css';
import { Link } from 'react-router-dom';
import 'react-picky/dist/picky.css';
import { bindActionCreators } from "redux";
import { BASE_URL } from "../../constants/Application";
import { addApk, getApkList } from "../../appRedux/actions/Apk";

import { Row, Icon, Card, Button, Divider, Form, Input, Upload, Col, message, Modal, Avatar } from 'antd';

// import asyncComponent from "util/asyncComponent";

// console.log('token', token);
const success = Modal.success
const error = Modal.error

let logo = '';
let apk = '';
let size = '';
let packageName = '';

let form_data = '';
let disableLogo = false;
let disableApk = false;
// class AddApk extends Component {
//     render() {

//         return (
//             <div>
//                 <WrappedNormalApkForm
//                     addApk={this.props.addApk}
//                     getApkList={this.props.getApkList}
//                     showUploadModal={this.props.showUploadModal}
//                     ref='uploadForm'
//                 />
//             </div>
//         )
//     }
// }

class AddApk extends Component {

    constructor(props) {

        super(props);
        this.state = {
            canUoload: false,
            fileList: [],
            fileList2: [],
            showUploadModal: false,
            logo: '',
            size: '',
            name: '',
            uploadData: {},
            disableApk: false,
            disableLogo: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);

                form_data = {
                    'logo': logo,
                    'apk': apk,
                    'name': values.name,
                    'size': size
                }
                this.setState({
                    showUploadModal: true,
                    logo: logo,
                    name: values.name,
                    size: size,
                    uploadData: form_data,
                    resetUploadForm: false
                })
                // console.log('hisory',this.props.go_back);
                // this.props.showUploadModal(form_data);
            }
            else {

            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            if (nextProps.resetUploadForm) {
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
            resetUploadForm: false
        })
    }

    addApk = () => {
        this.props.hideUploadApkModal()
        this.props.addApk(this.state.uploadData)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let fileList = [];
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
        let _this = this;
        const props = {
            name: 'logo',
            multiple: false,
            action: BASE_URL + 'users/upload',
            headers: { 'authorization': token },
            accept: '.png, .jpg',
            disabled: this.state.disableLogo,
            fileList: this.state.fileList,
            onRemove(info) {
                if (_this.state.fileList.length > 1) {
                    _this.state.fileList.length -= 1;
                } else {
                    _this.setState({ disableLogo: false });
                }
            },
            beforeUpload(file) {
                _this.setState({ disableLogo: true });
            },
            onChange(info) {
                const status = info.file.status;
                let fileList = [...info.fileList];
                // console.log('file list id', fileList)
                if (status !== 'uploading') {
                    // console.log('uploading ..')
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    // console.log(info.file.response);

                    if (info.file.response.status !== false) {
                        disableLogo = true;

                        if (info.file.response.fileName !== '') {
                            logo = info.file.response.fileName;
                        }
                        success({
                            title: 'file added Successfully ',
                        });
                        _this.setState({ disableLogo: true });
                    }
                    else {
                        error({
                            title: 'Error While Uploading',
                        });
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
            fileList: this.state.fileList2,
            onRemove(info) {
                if (_this.state.fileList2.length > 1) {
                    _this.state.fileList2.length -= 1;
                } else {
                    _this.setState({ disableApk: false });
                }
            },
            beforeUpload(file) {
                _this.setState({ disableApk: true });
            },
            onChange(info) {
                const status = info.file.status;
                let fileList2 = [...info.fileList];
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {

                    if (info.file.response.status !== false) {
                        // console.log(info.file.response);

                        if (info.file.response.fileName !== '') {
                            apk = info.file.response.fileName;
                            // console.log('apk name', apk);
                            packageName = info.file.response.packageName;
                            size = info.file.response.size
                            // versionCode = info.file.response.versionCode;
                            // versionName = info.file.response.versionName;
                            // details = info.file.response.details;

                        }
                        success({
                            title: 'file added Successfully ',
                        });
                        _this.setState({ disableApk: true });
                    }
                    else {
                        error({
                            title: 'Error While Uploading',
                        });
                        _this.setState({ disableApk: false });
                    }

                } else if (status === 'error') {
                    //  message.error(`${info.file.name} file upload failed.`);
                }
                _this.setState({ fileList2 });
            },
        };

        return (
            <div>
                <Card>
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
                </Card>
                <Modal
                    maskClosable={false}
                    width="700px"
                    className="policy_popup"
                    visible={this.state.showUploadModal}
                    title="Upload APK"
                    onOk={() => {
                    }}
                    onCancel={() => {
                        this.setState({
                            showUploadModal: false
                        })
                    }}
                    footer={[
                        <Button onClick={() => this.setState({
                            showUploadModal: false
                        })}>Cancel</Button>,
                        <Button key="submit" ref="formSubmission" type="primary" onClick={(e) => this.addApk()} >
                            Upload Apk
                        </Button>
                    ]}
                >
                    <div>
                        <label>Image:</label>  <Avatar size="large" src={BASE_URL + "users/getFile/" + this.state.logo} />
                        <br /><label>Size:</label>  <span>{this.state.size}</span>
                        <br /><label>Apk Name:</label> <span>{this.state.name}</span>
                    </div>
                </Modal>
            </div>
        )
    }
}



const WrappedNormalApkForm = Form.create('name', 'add_apk')(AddApk);


const mapStateToProps = ({ apk_list }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        resetUploadForm: apk_list.resetUploadForm
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addApk: addApk,
        getApkList: getApkList
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedNormalApkForm);
