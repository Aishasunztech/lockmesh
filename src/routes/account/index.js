import React, { Component } from "react";
// import {Route, Switch} from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { importCSV } from "../../appRedux/actions/Account";

import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message } from "antd";
import { BASE_URL } from "../../constants/Application";

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            file: null
        }
    }

    showImportModal = (visible) => {
        this.setState({
            visible: visible
        });
    }
    uploadFile = (file) => {
        this.setState({
            file: file
        })
    }
    handleSubmit = (e) => {
        if (this.state.file !== null) {
            // console.log(this.state.file);
            const formData = new FormData();
            formData.append('sim_ids', this.state.file);
            this.props.importCSV(formData);
            this.showImportModal(false);
        }
    }
    render() {
        let self = this;
        const props = {
            name: 'file',
            multiple: false,
            accept: [".xls", ".csv", ".xlsx"],
            // accept: ".xls",
            // processData: false,
            beforeUpload: (file) => {
                // console.log(file);
                this.setState({
                    file: file
                });
                return false;
            },
            // action: '//jsonplaceholder.typicode.com/posts/',
            onChange(info) {
                // console.log(info);
                if (info.fileList.length === 0) {
                    self.uploadFile(null);
                }
            },
        };
        return (
            <div>
                <Card >
                    <Row gutter={16} >
                        <Col span={6}>
                            <Button disabled type="primary" style={{ width: '100%' }} onClick={() => {
                                this.showImportModal(true)
                            }}>Import PGP Emails</Button>
                        </Col>
                        <Col span={6}>
                            <Button disabled type="primary" style={{ width: '100%' }} onClick={() => {
                                this.showImportModal(true)
                            }}>Import Chat IDs</Button>
                        </Col>
                        <Col span={6}>
                            <a href={`${BASE_URL}users/getFile/import_sim_ids.xlsx`}>
                                <button style={{ width: "100%",marginBottom:"0" }} className="btn btn-sm btn-default">Download Sample SIM IDs</button>
                            </a>
                        </Col>

                        <Col span={6}>

                            <Button type="primary" style={{ width: '100%' }} onClick={() => {
                                this.showImportModal(true)
                            }}>Import SIM IDs</Button>

                        </Col>

                    </Row>
                </Card>
                <Modal
                    visible={this.state.visible}
                    title="Import Sim IDs"
                    // onOk={this.handleOk}
                    onCancel={
                        () => {
                            this.showImportModal(false);
                        }
                    }
                    footer={[
                        <Button key="back" onClick={() => {
                            this.showImportModal(false);
                        }}>Return</Button>,

                        <Button ref="formSubmission" type="primary" onClick={(e) => this.handleSubmit()} >
                            Submit
                        </Button>
                    ]}
                >


                    <Form onSubmit={(e) => { this.handleSubmit(e) }}>

                        {/* <Form.Item
                            label="Name* "
                            labelCol={{ span: 7 }}
                            wrapperCol={{ span: 12 }}
                        >

                            <Input disabled type='text' required={true} value={this.state.apk_name} onChange={(event) => this.setState({ apk_name: event.target.value })} />

                        </Form.Item> */}
                        <Row>

                            <Col span={24} className="upload_file">
                                <Form.Item

                                >
                                    <div className="dropbox">

                                        <Upload.Dragger  {...props} disabled={(this.state.file === null) ? false : true}>
                                            <p className="ant-upload-drag-icon">
                                                <Icon type="file-excel" />
                                            </p>
                                            <h2 className="ant-upload-hint">UPLOAD FILE </h2>
                                            <p className="ant-upload-text">Upload file (.xls, .xlsx, .csv)</p>
                                        </Upload.Dragger>


                                    </div>
                                </Form.Item>

                            </Col>

                        </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}


// export default Account;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        importCSV: importCSV
    }, dispatch);
}
var mapStateToProps = ({ routing, device_details, devices }) => {


    return {
        routing: routing,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);