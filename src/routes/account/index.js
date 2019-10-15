import React, { Component, Fragment } from "react";
// import {Route, Switch} from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from 'react-router-dom';
import styles from './account.css'
import { Markup } from 'interweave';
import {
    importCSV,
    exportCSV,
    releaseCSV,
    getUsedPGPEmails,
    getUsedChatIds,
    getUsedSimIds,
    insertNewData,
    createBackupDB,
    checkPass,
    showBackupModal,
    // saveIDPrices,
    // setPackage,
    getPackages,
    purchaseCredits,
    purchaseCreditsFromCC
} from "../../appRedux/actions/Account";

import { convertToLang } from '../utils/commonUtils';


import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider } from "antd";
import { BASE_URL } from "../../constants/Application";
import {
    MANAGE_DATA,
    BACKUP_DATABASE,
    PURCHASE_CREDITS,
    PACKAGES_AND_IDS,
    ACCOUNT_MANAGE_DATA_01,
    ACCOUNT_MANAGE_DATA_02,
    ACCOUNT_MANAGE_DATA_03,
    UPLOAD_FILE,
    UPLOAD_FILE_Ext,
    BACKUP_DATABASE_DESCRIPTION,
    PURCHASE_CREDITS_DESCRIPTION,
    PACKAGES_AND_IDS_01,
    PACKAGES_AND_IDS_02,
    PACKAGES_AND_IDS_03,
    BACKUP_NOW,
    BACKUP_DATABASE_DESCRIPTION_OF_MODAL_BODY,
    DUPLICATE_DATA,
    NEW_DATA,
} from "../../constants/AccountConstants";

import {
    Button_Open,
    Button_BUY,
    Button_Ok,
    Button_Cancel,
    Button_submit,
    Button_BackupNow
} from '../../constants/ButtonConstants'
import {
    getSimIDs,
    getChatIDs,
    getPGPEmails,
} from "../../appRedux/actions/Devices";

import PasswordForm from '../ConnectDevice/components/PasswordForm';
import PurchaseCredit from "./components/PurchaseCredit";
import { ADMIN, PUSH_APP_TEXT } from "../../constants/Constants";
import { APP_ADD_MORE } from "../../constants/AppConstants";
// import SetPricingModal from './PricesPakages/SetPricingModal';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error

class PasswordModal extends Component {
    // console.log('object,', props.actionType)
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showPwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    actionType='back_up'
                    handleCancel={this.props.showPwdConfirmModal}
                    ref='pswdForm'
                    translation={this.props.translation}
                />
            </Modal >
        )
    }
}



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
            purchase_modal: false,
            selectedRowKeys: [],
            duplicate_ids: [],
            newData: [],
            duplicate_modal_show: false,
            showBackupModal: false,
            pwdConfirmModal: false,
            pricing_modal: false,
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

    componentDidMount() {
    }
    componentDidUpdate(prevProps, nextProps) {
        if (prevProps !== nextProps) {
            // this.setState({
            //     sim_ids: nextProps.sim_ids,
            //     pgp_emails: nextProps.pgp_emails,
            //     chat_ids: nextProps.chat_ids
            // });
            // this.setState({
            //     sim_ids: this.props.sim_ids,
            //     pgp_emails: this.props.pgp_emails,
            //     chat_ids: this.props.chat_ids,
            // });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.backUpModal !== nextProps.backUpModal) {
            // if (this.props.sim_ids.length !== nextProps.sim_ids.length || this.props.pgp_emails.length !== nextProps.pgp_emails.length || this.props.chat_ids.length !== nextProps.chat_ids.length) {
            this.setState({
                newData: nextProps.newData,
                backUpModal: nextProps.backUpModal
            });
        } else if (this.props.duplicate_modal_show !== nextProps.duplicate_modal_show) {
            this.setState({
                newData: nextProps.newData
            })
        }
    }
    createBackupDB = () => {

        this.props.createBackupDB();
        this.setState({
            backUpModal: false
        })
        this.props.showBackupModal(false)

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
            this.state.file = null
            this.props.importCSV(formData, this.state.fieldName);
            this.showImportModal(false);
        }
    }
    exportCSV = (fieldName) => {
        this.props.exportCSV(fieldName);
    }

    showPwdConfirmModal = (visible) => {
        // alert('hello');
        this.setState({
            pwdConfirmModal: visible,
        })
    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            originalData.forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] !== null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    showModal = () => {
        this.setState({
            visible1: true,
        });
    }
    showBackupModal = () => {
        this.setState({
            backUpModal: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible1: false,
            selectedRowKeys: []
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.props.showBackupModal(false)
        this.setState({
            visible1: false,
            backUpModal: false,
            selectedRowKeys: [],
        });
    }

    handleCancelDuplicate = () => {
        this.setState({
            duplicate_modal_show: false
        })
        this.props.insertNewData({ newData: [], submit: false });
    }


    InsertNewData = () => {
        let data = {
            newData: this.state.newData,
            type: this.state.duplicate_data_type,
            submit: true
        }
        this.props.insertNewData(data);
        this.handleCancelDuplicate();
    }

    onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    showConfirm = (msg, _this, pageName, id = 0) => {
        if (_this.state.selectedRowKeys.length > 0 || id !== 0) {
            confirm({
                title: 'WARNING! ' + msg,
                okText: "Confirm",
                onOk() {
                    if (id !== 0) {
                        _this.props.releaseCSV(pageName, [id]);
                    }
                    else if (_this.state.selectedRowKeys.length > 0) {
                        _this.props.releaseCSV(pageName, _this.state.selectedRowKeys)
                    }
                },
                onCancel() {

                },
            });
        }
    }
    showPurchaseModal = (e, visible) => {
        this.setState({
            purchase_modal: visible
        })
    }

    showPricingModal = (visible) => {
        this.setState({
            pricing_modal: visible
        });
    }

    render() {

        if (this.props.showMsg) {
            if (this.props.msg === "imported successfully") {
                success({
                    title: this.props.msg,
                });
            } else {
                error({
                    title: this.props.msg,
                });
            }

        }


        const { file, selectedRowKeys, } = this.state
        // console.log(this.state.used_chat_ids_page);
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
            fileList: (file === null) ? null : [file]
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };


        const duplicateModalColumns = [
            {
                title: 'SIM ID',
                align: "center",
                dataIndex: 'sim_id',
                key: "sim_id",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'START DATE',
                align: "center",
                dataIndex: 'start_date',
                key: "start_date",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'EXPIRY DATE',
                align: "center",
                dataIndex: 'expiry_date',
                key: "expiry_date",
                className: this.state.duplicate_data_type === 'sim_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'CHAT IDS',
                align: "center",
                dataIndex: 'chat_id',
                key: "chat_id",
                className: this.state.duplicate_data_type === 'chat_id' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'PGP EMAILS',
                align: "center",
                dataIndex: 'pgp_email',
                key: "pgp_email",
                className: this.state.duplicate_data_type === 'pgp_email' ? '' : 'hide',
                sortDirections: ['ascend', 'descend'],
            }
        ]

        return (

            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}>
                </Row>
                <div style={{ marginTop: -60 }}>
                    <Row>
                        {(this.props.user.type === ADMIN) ?
                            <Fragment>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} >
                                    <Modal
                                        maskClosable={false}
                                        title={<div><Icon type="question-circle" className='warning' /><span>
                                            {convertToLang(this.props.translation[DUPLICATE_DATA], "DUPLICATE_DATAWARNING! Duplicate Data")} </span></div>}
                                        visible={this.state.duplicate_modal_show}
                                        onOk={this.InsertNewData}
                                        onCancel={this.handleCancelDuplicate}
                                        // okText='Submit'
                                        okText={convertToLang(this.props.translation[Button_submit], "Submit")}
                                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                        okButtonProps={{
                                            disabled: this.state.newData.length ? false : true
                                        }}
                                    >

                                        <Table
                                            bordered
                                            columns={duplicateModalColumns}
                                            dataSource={
                                                this.state.duplicate_ids.map(row => {
                                                    if (this.state.duplicate_data_type === 'chat_id') {
                                                        return {
                                                            key: row.chat_id,
                                                            chat_id: row.chat_id
                                                        }
                                                    } else if (this.state.duplicate_data_type === 'pgp_email') {
                                                        return {
                                                            key: row.pgp_email,
                                                            pgp_email: row.pgp_email
                                                        }
                                                    }
                                                    else if (this.state.duplicate_data_type === 'sim_id') {
                                                        return {
                                                            key: row.id,
                                                            sim_id: row[this.state.duplicate_data_type],
                                                            start_date: row.start_date,
                                                            expiry_date: row.expiry_date
                                                        }
                                                    }

                                                })
                                            }

                                            pagination={{ pageSize: Number(this.state.sim_ids_page), size: "middle" }}

                                        />
                                        <span className="warning_hr">
                                            <hr />
                                        </span>
                                        <h2>{convertToLang(this.props.translation[NEW_DATA], "New Data")} </h2>

                                        <Table
                                            bordered
                                            columns={duplicateModalColumns}
                                            dataSource={
                                                this.state.newData.map(row => {
                                                    if (this.state.duplicate_data_type === 'chat_id') {
                                                        return {
                                                            key: row.chat_id,
                                                            chat_id: row.chat_id
                                                        }
                                                    } else if (this.state.duplicate_data_type === 'pgp_email') {
                                                        return {
                                                            key: row.pgp_email,
                                                            pgp_email: row.pgp_email
                                                        }
                                                    }
                                                    else if (this.state.duplicate_data_type === 'sim_id') {
                                                        return {
                                                            key: row.id,
                                                            sim_id: row[this.state.duplicate_data_type],
                                                            start_date: row.start_date,
                                                            expiry_date: row.expiry_date
                                                        }
                                                    }

                                                })
                                            }

                                            pagination={{ pageSize: Number(this.state.sim_ids_page), size: "middle" }}

                                        />
                                    </Modal>
                                    <div>

                                        <Link to="/account/managedata" onClick={this.showModal}>
                                            {/* <Link to="#" > */}
                                            <Card className="manage_ac" style={{ borderRadius: 12 }}>
                                                <div>
                                                    <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[MANAGE_DATA], "Manage Data")} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0 0px' }}>
                                                        <Col span={7} className="" style={{ textAlign: "center" }}>
                                                            <Icon type="form" className="and_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }} className="crd_txt">
                                                            <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_01], "Manage data such as SIM ID, <br style={{ marginLeft: 4 }} />CHAT ID, PGP Email, etc..")} />  </h5>
                                                            <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_02], "View/Edit your data")} /> </h5>
                                                            <h5 className="disp_in_flex"><span className="diamond_icon">&#9670;</span><Markup content={convertToLang(this.props.translation[ACCOUNT_MANAGE_DATA_03], "Release previously used data back to system")} />  </h5>
                                                            <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                        </Link>

                                        <Modal
                                            maskClosable={false}
                                            className="manage_data"
                                            width="450px"
                                            title="Manage Data"
                                            visible={this.state.visible1}
                                            onOk={this.handleOk}
                                            onCancel={this.handleCancel}
                                            okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                            cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                            centered
                                        >
                                            <div className="profile_table">
                                                <Fragment>
                                                    <Modal
                                                        maskClosable={false}
                                                        className="m_d_pop"
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
                                                            }}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>,

                                                            <Button key="submit" ref="formSubmission" type="primary" onClick={(e) => this.handleSubmit()} >
                                                                {convertToLang(this.props.translation[Button_submit], "Submit")}
                                                            </Button>
                                                        ]}>
                                                        <Form onSubmit={(e) => { this.handleSubmit(e) }}>

                                                            {/* <Form.Item label="Name* " labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
                                                        <Input disabled type='text' required={true} value={this.state.apk_name} onChange={(event) => this.setState({ apk_name: event.target.value })} />
                                                        </Form.Item> */}
                                                            <Row>
                                                                <Col span={24} className="upload_file">
                                                                    <Form.Item
                                                                    >
                                                                        <div className="dropbox">

                                                                            <Upload.Dragger  {...props} disabled={(file === null) ? false : true} >
                                                                                <p className="ant-upload-drag-icon">
                                                                                    <Icon type="file-excel" />
                                                                                </p>
                                                                                <h2 className="ant-upload-hint">{convertToLang(this.props.translation[UPLOAD_FILE], "UPLOAD FILE")} </h2>
                                                                                <p className="ant-upload-text">{convertToLang(this.props.translation[UPLOAD_FILE], "Upload file")} {convertToLang(this.props.translation[UPLOAD_FILE_Ext], "(.xls, .xlsx, .csv)")} </p>
                                                                            </Upload.Dragger>
                                                                        </div>
                                                                    </Form.Item>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    </Modal>

                                                    <Modal
                                                        maskClosable={false}
                                                        className="m_d_pop"
                                                        visible={this.state.dataVisible}
                                                        title={`${this.state.dataFieldTitle}`}
                                                        // onOk={this.handleOk}
                                                        okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                                        onCancel={
                                                            () => {
                                                                this.showViewmodal(false);
                                                                this.setState({
                                                                    selectedRowKeys: [],
                                                                    used_chat_ids: this.props.used_chat_ids,
                                                                    used_sim_ids: this.props.used_sim_ids,
                                                                    used_pgp_emails: this.props.used_pgp_emails,
                                                                })
                                                            }
                                                        }
                                                        onOk={
                                                            () => {
                                                                this.showViewmodal(false);
                                                                this.setState({
                                                                    selectedRowKeys: [],
                                                                    used_chat_ids: this.props.used_chat_ids,
                                                                    used_sim_ids: this.props.used_sim_ids,
                                                                    used_pgp_emails: this.props.used_pgp_emails,
                                                                })
                                                            }
                                                        }
                                                    >
                                                        {(this.state.dataFieldName === "sim_ids") ?
                                                            <Fragment>
                                                                <div className="row">

                                                                    <div className="col-md-12">
                                                                        <Input.Search
                                                                            name="sim_id"
                                                                            key="sim_id"
                                                                            id="sim_id"
                                                                            className="search_heading1"
                                                                            onKeyUp={
                                                                                (e) => {
                                                                                    this.handleSearch(e, 'sim_ids')
                                                                                }
                                                                            }
                                                                            autoComplete="new-password"
                                                                            placeholder="SIM ID"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6 pr-8">
                                                                        <Input.Search
                                                                            name="start_date"
                                                                            key="start_date"
                                                                            id="start_date"
                                                                            className="search_heading1"
                                                                            onKeyUp={
                                                                                (e) => {
                                                                                    this.handleSearch(e, 'sim_ids')
                                                                                }
                                                                            }
                                                                            autoComplete="new-password"
                                                                            placeholder="START DATE"
                                                                        />
                                                                    </div>
                                                                    <div className="col-md-6 pl-8">
                                                                        <Input.Search
                                                                            name="expiry_date"
                                                                            key="expiry_date"
                                                                            id="expiry_date"
                                                                            className="search_heading1"
                                                                            onKeyUp={
                                                                                (e) => {
                                                                                    this.handleSearch(e, 'sim_ids')
                                                                                }
                                                                            }
                                                                            autoComplete="new-password"
                                                                            placeholder="EXPIRY DATE"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <Table
                                                                    columns={[
                                                                        {
                                                                            title: 'SIM ID',
                                                                            align: "center",
                                                                            dataIndex: 'sim_id',
                                                                            key: "sim_id",
                                                                            className: '',
                                                                            sorter: (a, b) => { return a.sim_id - b.sim_id },
                                                                            sortDirections: ['ascend', 'descend'],

                                                                        },
                                                                        {
                                                                            title: 'START DATE',
                                                                            align: "center",
                                                                            dataIndex: 'start_date',
                                                                            key: "start_date",
                                                                            className: '',
                                                                            sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                                                                            sortDirections: ['ascend', 'descend'],

                                                                        },
                                                                        {
                                                                            title: 'EXPIRY DATE',
                                                                            align: "center",
                                                                            dataIndex: 'expiry_date',
                                                                            key: "expiry_date",
                                                                            className: '',
                                                                            sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                                                                            sortDirections: ['ascend', 'descend'],
                                                                        },
                                                                    ]}
                                                                    dataSource={
                                                                        this.state.sim_ids.map(sim_id => {
                                                                            return {
                                                                                key: sim_id.id,
                                                                                sim_id: sim_id.sim_id,
                                                                                start_date: sim_id.start_date,
                                                                                expiry_date: sim_id.expiry_date
                                                                            }
                                                                        })
                                                                    }
                                                                    // scroll={{ y: 250 }}
                                                                    pagination={false}

                                                                />
                                                            </Fragment>
                                                            : (this.state.dataFieldName === "chat_ids") ?
                                                                <Fragment>
                                                                    <div className="row">

                                                                        <div className="col-md-12">
                                                                            <Input.Search
                                                                                name="chat_id"
                                                                                key="chat_id"
                                                                                id="chat_id"
                                                                                className="search_heading1"
                                                                                onKeyUp={
                                                                                    (e) => {
                                                                                        this.handleSearch(e, 'chat_ids')
                                                                                    }
                                                                                }
                                                                                autoComplete="new-password"
                                                                                placeholder="CHAT ID"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <Table
                                                                        columns={[
                                                                            {
                                                                                title: 'CHAT ID',
                                                                                align: "center",
                                                                                dataIndex: 'chat_id',
                                                                                key: "chat_id",
                                                                                className: '',
                                                                                sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },
                                                                                sortDirections: ['ascend', 'descend'],
                                                                            },
                                                                        ]}
                                                                        dataSource={
                                                                            this.state.chat_ids.map(chat_id => {
                                                                                return {
                                                                                    key: chat_id.id,
                                                                                    chat_id: chat_id.chat_id,
                                                                                }
                                                                            })
                                                                        }
                                                                        // scroll={{ y: 250 }}
                                                                        pagination={false}


                                                                    />
                                                                </Fragment>
                                                                : (this.state.dataFieldName === "pgp_emails") ?
                                                                    <Fragment>
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <Input.Search
                                                                                    name="pgp_email"
                                                                                    key="pgp_email"
                                                                                    id="pgp_email"
                                                                                    className="search_heading1"
                                                                                    onKeyUp={
                                                                                        (e) => {
                                                                                            this.handleSearch(e, 'pgp_emails')
                                                                                        }
                                                                                    }
                                                                                    autoComplete="new-password"
                                                                                    placeholder="PGP Email"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <Table
                                                                            size="middle"
                                                                            columns={[
                                                                                {
                                                                                    title: 'PGP EMAILS',
                                                                                    align: "center",
                                                                                    dataIndex: 'pgp_email',
                                                                                    key: "pgp_email",
                                                                                    className: '',
                                                                                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                                                                                    sortDirections: ['ascend', 'descend'],

                                                                                },
                                                                            ]}

                                                                            dataSource={
                                                                                this.state.pgp_emails.map(email => {
                                                                                    return {
                                                                                        key: email.id,
                                                                                        pgp_email: email.pgp_email,

                                                                                    }
                                                                                })
                                                                            }

                                                                            // scroll={{ y: 250 }}
                                                                            pagination={false}
                                                                        />
                                                                    </Fragment>
                                                                    : (this.state.dataFieldName === "used_pgp_emails") ?
                                                                        <Fragment>
                                                                            <div className="row">
                                                                                <div className="col-md-12">
                                                                                    <Input.Search
                                                                                        name="pgp_email"
                                                                                        key="used_pgp_emails"
                                                                                        id="used_pgp_emails"
                                                                                        className="search_heading1"
                                                                                        onKeyUp={
                                                                                            (e) => {
                                                                                                this.handleSearch(e, 'used_pgp_emails')
                                                                                            }
                                                                                        }
                                                                                        autoComplete="new-password"
                                                                                        placeholder="USED PGP Email"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <Table
                                                                                size="middle"
                                                                                rowSelection={rowSelection}
                                                                                columns={[
                                                                                    {
                                                                                        title: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release all pgp emails.", this, 'pgp_email') }}>Release selected</Button>,
                                                                                        align: "center",
                                                                                        dataIndex: 'action',
                                                                                        key: "action",
                                                                                        className: '',
                                                                                    },
                                                                                    {
                                                                                        title: 'USED PGP EMAILS',
                                                                                        align: "center",
                                                                                        dataIndex: 'used_pgp_email',
                                                                                        key: "used_pgp_email",
                                                                                        className: '',
                                                                                        sorter: (a, b) => { return a.used_pgp_email.localeCompare(b.used_pgp_email) },
                                                                                        sortDirections: ['ascend', 'descend'],

                                                                                    },

                                                                                ]}

                                                                                dataSource={
                                                                                    this.state.used_pgp_emails.map(email => {
                                                                                        return {
                                                                                            key: email.id,
                                                                                            used_pgp_email: email.pgp_email,
                                                                                            action: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release this pgp email.", this, "pgp_email", email.id) }}>Release</Button>

                                                                                        }
                                                                                    })
                                                                                }
                                                                                //scroll={{ y: 250 }}
                                                                                pagination={false}
                                                                            />
                                                                        </Fragment> : (this.state.dataFieldName === "used_sim_ids") ?
                                                                            <Fragment>
                                                                                <div className="row">
                                                                                    <div className="col-md-12">
                                                                                        <Input.Search
                                                                                            name="sim_id"
                                                                                            key="used_sim_ids"
                                                                                            id="used_sim_ids"
                                                                                            className="search_heading1"
                                                                                            onKeyUp={
                                                                                                (e) => {
                                                                                                    this.handleSearch(e, 'used_sim_ids')
                                                                                                }
                                                                                            }
                                                                                            autoComplete="new-password"
                                                                                            placeholder="USED SIM IDS"
                                                                                        />
                                                                                    </div>
                                                                                </div>

                                                                                <Table
                                                                                    size="middle"
                                                                                    rowSelection={rowSelection}
                                                                                    columns={[
                                                                                        {
                                                                                            title: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release all sim ids.", this, 'sim_id') }}>Release selected</Button>,
                                                                                            align: "center",
                                                                                            dataIndex: 'action',
                                                                                            key: "action",
                                                                                            className: '',
                                                                                        },
                                                                                        {
                                                                                            title: 'USED SIM IDS',
                                                                                            align: "center",
                                                                                            dataIndex: 'used_sim_ids',
                                                                                            key: "used_sim_ids",
                                                                                            className: '',
                                                                                            sorter: (a, b) => { return a.used_sim_ids.localeCompare(b.used_sim_ids) },
                                                                                            sortDirections: ['ascend', 'descend'],

                                                                                        },

                                                                                    ]}

                                                                                    dataSource={
                                                                                        this.state.used_sim_ids.map(email => {
                                                                                            return {
                                                                                                key: email.id,
                                                                                                used_sim_ids: email.sim_id,
                                                                                                action: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release this sim id.", this, "sim_id", email.id) }}>Release</Button>

                                                                                            }
                                                                                        })
                                                                                    }
                                                                                    //scroll={{ y: 250 }}
                                                                                    pagination={false}
                                                                                />
                                                                            </Fragment> : (this.state.dataFieldName === "used_chat_ids") ?
                                                                                <Fragment>
                                                                                    <div className="row">
                                                                                        <div className="col-md-12">
                                                                                            <Input.Search
                                                                                                name="chat_id"
                                                                                                key="used_chat_ids"
                                                                                                id="used_chat_ids"
                                                                                                className="search_heading1"
                                                                                                onKeyUp={
                                                                                                    (e) => {
                                                                                                        this.handleSearch(e, 'used_chat_ids')
                                                                                                    }
                                                                                                }
                                                                                                autoComplete="new-password"
                                                                                                placeholder="USED CHAT IDS"
                                                                                            />
                                                                                        </div>
                                                                                    </div>

                                                                                    <Table
                                                                                        size="middle"
                                                                                        rowSelection={rowSelection}
                                                                                        columns={[
                                                                                            {
                                                                                                title: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release all Chat ids.", this, 'chat_id') }}>Release selected</Button>,
                                                                                                align: "center",
                                                                                                dataIndex: 'action',
                                                                                                key: "action",
                                                                                                className: '',
                                                                                            },
                                                                                            {
                                                                                                title: 'USED CHAT IDS',
                                                                                                align: "center",
                                                                                                dataIndex: 'used_chat_ids',
                                                                                                key: "used_chat_ids",
                                                                                                className: '',
                                                                                                sorter: (a, b) => { return a.used_chat_ids.localeCompare(b.used_chat_ids) },
                                                                                                sortDirections: ['ascend', 'descend'],

                                                                                            },

                                                                                        ]}
                                                                                        dataSource={
                                                                                            this.state.used_chat_ids.map(email => {
                                                                                                return {
                                                                                                    key: email.id,
                                                                                                    used_chat_ids: email.chat_id,
                                                                                                    action: <Button type="danger" size="small" onClick={() => { this.showConfirm("Do you really want to Release this Chat id.", this, "chat_id", email.id) }}>Release</Button>

                                                                                                }
                                                                                            })
                                                                                        }
                                                                                        //scroll={{ y: 250 }}
                                                                                        pagination={false}
                                                                                    />
                                                                                </Fragment> : null
                                                        }
                                                    </Modal>
                                                    <Row>
                                                        <div className="col-md-12 ac_card">
                                                            <Card style={{ borderRadius: 12 }}>
                                                                <div>
                                                                    {/* <h2 style={{ textAlign: "center" }}><a href="#"></a> Manage Data</h2>
                                                            <Divider className="mb-0" /> */}
                                                                    <Row style={{ padding: '16px' }}>
                                                                        <div className="inline_b">
                                                                            <span className="headings">PGP Emails</span>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'used_pgp_emails', 'USED PGP EMAILS') }} size='small' className="pull-right  exp_btn" type="dashed">Release</Button>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'pgp_emails', 'PGP Emails') }} size='small' className="pull-right imp_btn">View</Button>
                                                                            <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                                                                this.exportCSV('pgp_emails');
                                                                            }} >Export</Button>
                                                                            {/* <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                                                        this.showImportModal(true, "pgp_emails", "PGP Emails")
                                                                    }}>Import</Button> */}
                                                                            <a href={`${BASE_URL}users/getFile/import_pgp_emails.xlsx`}>
                                                                                <Button size='small' className="pull-right imp_btn" type="dashed">Sample</Button>
                                                                            </a>

                                                                        </div>
                                                                        <div className="inline_b">
                                                                            <span className="headings">Chat IDs</span>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'used_chat_ids', 'USED CHAT IDS') }} size='small' className="pull-right  exp_btn" type="dashed">Release</Button>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'chat_ids', 'Chat IDs') }} size='small' className="pull-right imp_btn">View</Button>
                                                                            <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                                                                this.exportCSV('chat_ids');
                                                                            }} >Export</Button>
                                                                            {/* <Button size='small' className="pull-right imp_btn" type="primary" onClick={() => {
                                                                        this.showImportModal(true, "chat_ids", "Chat IDs")
                                                                    }}>Import</Button> */}
                                                                            <a href={`${BASE_URL}users/getFile/import_chat_ids.xlsx`}>
                                                                                <Button size='small' className="pull-right imp_btn" type="dashed" >Sample</Button>
                                                                            </a>

                                                                        </div>
                                                                        <div className="inline_b">
                                                                            <span className="headings">SIM IDs</span>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'used_sim_ids', 'USED SIM IDS') }} size='small' className="pull-right  exp_btn" type="dashed">Release</Button>
                                                                            <Button onClick={() => { this.showViewmodal(true, 'sim_ids', 'Sim IDs') }} size='small' className="pull-right imp_btn mb-0">View</Button>
                                                                            <Button size='small' className="pull-right imp_btn mb-0" type="primary" onClick={() => {
                                                                                this.exportCSV('sim_ids');
                                                                            }} >Export</Button>
                                                                            {/* <Button size='small' className="pull-right imp_btn mb-0" type="primary" onClick={() => {
                                                                        this.showImportModal(true, "sim_ids", "Sim IDs")
                                                                    }}>Import</Button> */}

                                                                            <a href={`${BASE_URL}users/getFile/import_sim_ids.xlsx`}>
                                                                                <Button size='small' className="pull-right imp_btn mb-0" type="dashed">Sample</Button>
                                                                            </a>
                                                                        </div>
                                                                    </Row>
                                                                </div>
                                                            </Card>
                                                        </div>
                                                    </Row>
                                                </Fragment>
                                            </div>
                                        </Modal>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} >

                                    <Modal
                                        width="400px"
                                        className="back_db"
                                        maskClosable={false}
                                        title={<div>{convertToLang(this.props.translation[BACKUP_DATABASE], "BACKUP DATABASE")}</div>}
                                        visible={this.state.backUpModal}
                                        onOk={this.createBackupDB}
                                        onCancel={this.handleCancel}
                                        okText={convertToLang(this.props.translation[Button_BackupNow], "BACKUP NOW")}
                                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                        okButtonDisabled={true}
                                        centered
                                    >
                                        <div>
                                            <p style={{ margin: 13 }}>{convertToLang(this.props.translation[BACKUP_DATABASE_DESCRIPTION_OF_MODAL_BODY], "Hit 'BACKUP NOW' button below to back up your complete system database. To access your database unzip generated Files first and open in Excel.")} </p>
                                        </div>
                                    </Modal>
                                    <div>
                                        <div>
                                            <Link to="#" onClick={() => this.showPwdConfirmModal(true)}>
                                                <Card className="manage_ac" style={{ borderRadius: 12 }}>
                                                    <div>
                                                        <div>
                                                            <h2 style={{ textAlign: "center", width: "80%", margin: "0 auto" }}>
                                                                <Icon type="lock" className="lock_icon2" />
                                                                {convertToLang(this.props.translation[BACKUP_DATABASE], "BACKUP DATABASE")} </h2>
                                                            <Divider className="mb-0" />
                                                            <Row style={{ padding: '12px 0 0px' }}>
                                                                <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                    <Icon type="database" className="and_icon" />
                                                                </Col>
                                                                <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                    <h5>
                                                                        {convertToLang(this.props.translation[BACKUP_DATABASE_DESCRIPTION], "This feature allows you to keep a backup of the complete system database for offline safekeeping")}
                                                                    </h5>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </Card>
                                                <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                            </Link>
                                            {/* <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div> */}
                                        </div>
                                    </div>
                                </Col>
                            </Fragment>
                            : null}
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <div>
                                    <a href="javascript:void(0)"
                                        onClick={(e) => {
                                            this.showPurchaseModal(e, true);
                                        }}
                                    >
                                        <Card style={{ borderRadius: 12 }} className="manage_ac">
                                            <div className="profile_table image_1">
                                                <Fragment>
                                                    <div className="ac_card">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[PURCHASE_CREDITS], "Purchase Credits")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="dollar" className="and_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <h5>{convertToLang(this.props.translation[PURCHASE_CREDITS_DESCRIPTION], "Buy more Credits instantly with Bitcoin or Credit card and check out using our secure payment gateway.")}</h5>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Fragment>
                                            </div>
                                        </Card>
                                        <Button type="default" style={{ backgroundColor: "red", color: "#fff" }} size="small" className="open_btn">{convertToLang(this.props.translation[Button_BUY], "Buy")}</Button>
                                    </a>
                                    <PurchaseCredit
                                        showPurchaseModal={this.showPurchaseModal}
                                        purchase_modal={this.state.purchase_modal}
                                        purchaseCredits={this.props.purchaseCredits}
                                        purchaseCreditsFromCC={this.props.purchaseCreditsFromCC}
                                        translation={this.props.translation}
                                    />
                                </div>
                            </div>
                        </Col>

                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                {/* <a href="javascript:void(0)" onClick={() => this.showPricingModal(true)}> */}
                                <Link to={"/set-prices"}>
                                    {/* <Link to={"/set-prices/" + this.props.whiteLabelInfo.name}> */}
                                    <Card style={{ borderRadius: 12 }} className="manage_ac">
                                        <div className="profile_table image_1">
                                            <Fragment>
                                                <Row>
                                                    <div className="col-md-12 ac_card">
                                                        <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[PACKAGES_AND_IDS], "Packages and ID's")} </h2>
                                                        <Divider className="mb-0" />
                                                        <Row style={{ padding: '12px 0 0px' }}>
                                                            <Col span={8} className="" style={{ textAlign: "center" }}>
                                                                <Icon type="dollar" className="and_icon" />
                                                            </Col>
                                                            <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                                                <div className="crd_txt">
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_01], "Distribute tokens")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_02], "Set prices and delay for each token")}</h5>
                                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[PACKAGES_AND_IDS_03], "Set permissions for Tokens")}</h5>
                                                                    <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Row>
                                            </Fragment>
                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                                    {/* </a> */}
                                </Link>


                                {/* <div className="middle">
                                        <SetPricingModal
                                            showPricingModal={this.showPricingModal}
                                            pricing_modal={this.state.pricing_modal}
                                            // LabelName = {this.props.whiteLabelInfo.name}
                                            saveIDPrices={this.props.saveIDPrices}
                                            setPackage={this.props.setPackage}
                                        // whitelabel_id={this.props.whiteLabelInfo.id}

                                        />
                                    </div> */}
                                {/* <div className="middle">
                                        <div className="text">Coming Soon</div>
                                    </div> */}
                            </div>
                        </Col>

                      <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <div>
                          <Link to={"/reporting"}>
                            <Card style={{ borderRadius: 12 }} className="manage_ac">
                              <div className="profile_table image_1">
                                <Fragment>
                                  <Row>
                                    <div className="col-md-12 ac_card">
                                      <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[''], "Reporting")} </h2>
                                      <Divider className="mb-0" />
                                      <Row style={{ padding: '12px 0 0px' }}>
                                        <Col span={8} className="" style={{ textAlign: "center" }}>
                                          <Icon type="dollar" className="and_icon" />
                                        </Col>
                                        <Col span={16} style={{ paddingLeft: 0 }} className="crd_txt">
                                          <div className="crd_txt">
                                            <h5 className="more_txt">{convertToLang(this.props.translation[APP_ADD_MORE], "and more...")}</h5>
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Row>
                                </Fragment>
                              </div>
                            </Card>
                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], "Open")} </Button>
                          </Link>
                        </div>
                      </Col>
                    </Row>
                </div>
                <PasswordModal
                    translation={this.props.translation}
                    pwdConfirmModal={this.state.pwdConfirmModal}
                    showPwdConfirmModal={this.showPwdConfirmModal}
                    checkPass={this.props.checkPass}
                    translation={this.props.translation}
                />
            </div>
        );
    }
}

// export default Account;
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        importCSV: importCSV,
        exportCSV: exportCSV,
        releaseCSV: releaseCSV,
        insertNewData: insertNewData,
        createBackupDB: createBackupDB,
        checkPass: checkPass,
        showBackupModal: showBackupModal,
        // saveIDPrices: saveIDPrices,
        // setPackage: setPackage,
        getPackages: getPackages,
        purchaseCredits: purchaseCredits,
        purchaseCreditsFromCC: purchaseCreditsFromCC
    }, dispatch);
}

var mapStateToProps = ({ account, devices, settings, auth }) => {
    return {
        msg: account.msg,
        showMsg: account.showMsg,
        newData: account.newData,
        backUpModal: account.backUpModal,
        translation: settings.translation,
        user: auth.authUser
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
