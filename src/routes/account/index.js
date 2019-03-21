import React, { Component, Fragment } from "react";
// import {Route, Switch} from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from './account.css'
import { 
    importCSV,
    exportCSV
 } from "../../appRedux/actions/Account";

import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table } from "antd";
import { BASE_URL } from "../../constants/Application";
import { 
    getSimIDs, 
    getChatIDs, 
    getPGPEmails
 } from "../../appRedux/actions/Devices";


class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fieldName: '',
            fieldValue: '',
            file: null,
            dataVisible: false,
            dataFieldName: '',
            dataFieldTitle: '',
        }
    }

    showImportModal = (visible, fieldName = "", fieldValue = "") => {
        // console.log(fieldName);
        this.setState({
            visible: visible,
            fieldName: fieldName,
            fieldValue: fieldValue
        });
    }

    showViewmodal = (dataVisible, dataFieldName = "", dataFieldTitle = "") =>{
        this.setState({
            dataVisible: dataVisible,
            dataFieldName: dataFieldName,
            dataFieldTitle: dataFieldTitle
        });

        if(dataFieldName==="sim_ids"){
            this.props.getSimIDs();
        }else if(dataFieldName==="pgp_emails"){
            this.props.getPGPEmails();
        }else if(dataFieldName==="chat_ids"){
            this.props.getChatIDs();
        }

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
            if (this.state.fieldName === "sim_ids") {
                // console.log(this.state.fieldName);
                formData.append('sim_ids', this.state.file);
            } else if (this.state.fieldName === "chat_ids") {
                // console.log(this.state.fieldName);
                formData.append('chat_ids', this.state.file);
            } else if (this.state.fieldName === "pgp_emails") {
                // console.log(this.state.fieldName);
                formData.append('pgp_emails', this.state.file);
            }
            // formData.append('fieldName', this.state.fieldName);
            // console.log(formData);

            this.props.importCSV(formData, this.state.fieldName);

            this.showImportModal(false);

        }
    }
    exportCSV = (fieldName) => {
        this.props.exportCSV(fieldName);
    }
    render() {


        if (this.props.showMsg) {
            if (this.props.msg === "imported successfully") {
                message.success(this.props.msg);
            } else {
                message.error(this.props.msg);
            }

        }

        let self = this;
        const props = {
            name: 'file',
            multiple: false,
            // accept: [".xls", ".csv", ".xlsx"],
            accept: ".xls; *.csv; *.xlsx;",
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
            <Fragment>
                <Modal
                    visible={this.state.visible}
                    title={`Import ${this.state.fieldValue}`}
                    // onOk={this.handleOk}
                    onCancel={
                        () => {
                            this.showImportModal(false);
                        }
                    }
                    footer={[
                        <Button key="back" onClick={() => {
                            this.showImportModal(false);
                        }}>Cancel</Button>,

                        <Button key="submit" ref="formSubmission" type="primary" onClick={(e) => this.handleSubmit()} >
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
                <Modal
                    visible={this.state.dataVisible}
                    title={`${this.state.dataFieldTitle}`}
                    // onOk={this.handleOk}
                    onCancel={
                        () => {
                            this.showViewmodal(false);
                        }
                    }
                >
                    {(this.state.dataFieldName==="sim_ids")?<Table 
                    
                    columns={[{
                        dataIndex:"sim_id",
                        title: "Sim ID",
                        key:"sim_id",
                        align: "center"
                    },{
                        dataIndex: "start_date",
                        title: "Start Date",
                        key:"start_date",
                        align: "center"
                    },{
                        dataIndex: "expiry_date",
                        title: "Expiry Date",
                        key: "expiry_date",
                        align: "center"
                    }]} 
                    dataSource={
                        this.props.sim_ids.map(sim_id=>{
                            return {
                                key:sim_id.id,
                                sim_id: sim_id.sim_id,
                                start_date: sim_id.start_date,
                                expiry_date: sim_id.expiry_date
                            }
                        })
                    } />:(this.state.dataFieldName==="chat_ids")?<Table 
                    columns={[{
                        dataIndex:"chat_id",
                        title: "Chat ID",
                        key:"chat_id",
                        align: "center"
                    }]} 
                    dataSource={
                        this.props.chat_ids.map(chat_id=>{
                            return {
                                key:chat_id.id,
                                chat_id: chat_id.chat_id,
                            }
                        })
                    }    
                    />:(this.state.dataFieldName==="pgp_emails")?<Table 
                    columns={[{
                        dataIndex:"pgp_email",
                        title: "PGP Email",
                        key:"pgp_email",
                        align: "center"
                    }]} 
                    dataSource={
                        this.props.pgp_emails.map(email=>{
                            return {
                                key:email.id,
                                pgp_email: email.pgp_email,
                                
                            }
                        })
                    }
                    />:null}
                </Modal>
                <Row> 
                    <div className="col-md-4 ac_card">
                        <Card
                            title="Manage Data"
                            extra={<a href="#"></a>}
                            style={{}}
                        >
                            <div className="inline_b">
                                <span className="headings">PGP Emails</span>
                                <Button onClick={()=>{ this.showViewmodal(true,'pgp_emails','PGP Emails')}} size='small' className="pull-right exp_btn">View</Button>
                                <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                    this.exportCSV('pgp_emails');
                                }} >Export</Button>
                                <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                    this.showImportModal(true, "pgp_emails", "PGP Emails")
                                }}>Import</Button>
                                <a href={`${BASE_URL}users/getFile/import_pgp_emails.xlsx`}>
                                    <Button size='small' className="pull-right imp_btn" type="dashed">Sample</Button>
                                </a>

                            </div>
                            <div className="inline_b">
                                <span className="headings">Chat IDs</span>
                                <Button onClick={()=>{ this.showViewmodal(true,'chat_ids','Chat IDs')}} size='small' className="pull-right exp_btn">View</Button>
                                <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                    this.exportCSV('chat_ids');
                                }} >Export</Button>
                                <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                    this.showImportModal(true, "chat_ids", "Chat IDs")
                                }}>Import</Button>
                                <a href={`${BASE_URL}users/getFile/import_chat_ids.xlsx`}>
                                    <Button size='small' className="pull-right imp_btn" type="dashed" >Sample</Button>
                                </a>

                            </div>
                            <div className="inline_b">
                                <span className="headings">SIM IDs</span>
                                <Button onClick={()=>{ this.showViewmodal(true,'sim_ids','Sim IDs')}} size='small' className="pull-right exp_btn mb-0">View</Button>
                                <Button size='small' className="pull-right imp_btn mb-0" type="primary" onClick={() => {
                                    this.exportCSV('sim_ids');
                                }} >Export</Button>
                                <Button size='small' className="pull-right imp_btn mb-0" type="primary" onClick={() => {
                                    this.showImportModal(true, "sim_ids", "Sim IDs")
                                }}>Import</Button>
                                
                                <a href={`${BASE_URL}users/getFile/import_sim_ids.xlsx`}>
                                    <Button size='small' className="pull-right imp_btn mb-0" type="dashed">Sample</Button>
                                </a>

                            </div>
                        </Card>
                    </div>
                   
                    {/* <div className="col-md-4 ac_card p-0">
                        <Card
                            title=""
                            >
                            <div className="animationLoading">
                                <div id="one"></div>
                                <div id="two"></div>
                                <div id="three"></div>
                                <div id="four"></div>
                                <div id="five"></div>
                                <div id="six"></div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-md-4 ac_card">
                        <Card
                            title=""
                            >
                            <div className="animationLoading">
                                <div id="one"></div>
                                <div id="two"></div>
                                <div id="three"></div>
                                <div id="four"></div>
                                <div id="five"></div>
                                <div id="six"></div>
                            </div>
                        </Card>
                   
                        <Card
                            title="Dummy Data"
                            extra={<a href="#"></a>}
                            style={{}}
                        >
                            <div className="inline_b">
                                <span>Dummy Data</span>
                                <Button size='small' className="pull-right exp_btn">Button2</Button>
                                <Button size='small' className="pull-right imp_btn">Button1</Button>
                            </div>
                            <div className="inline_b">
                                <span>Dummy Data</span>
                                <Button size='small' className="pull-right exp_btn">Button2</Button>
                                <Button size='small' className="pull-right imp_btn">Button1</Button>
                            </div>
                            <div className="inline_b">
                                <span>Dummy Data</span>
                                <Button size='small' className="pull-right exp_btn">Button2</Button>
                                <Button size='small' className="pull-right imp_btn">Button1</Button>
                            </div> 
                        </Card>
                    </div> */}

                </Row>

            </Fragment>
        );

    }
}

// export default Account;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs, 
        getPGPEmails: getPGPEmails,
        importCSV: importCSV,
        exportCSV: exportCSV
    }, dispatch);
}
var mapStateToProps = ({ account, devices}) => {

    return {
        msg: account.msg,
        showMsg: account.showMsg,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);