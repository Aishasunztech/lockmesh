import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon, Modal } from 'antd';
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import styles from './app.css'
import { connect } from "react-redux";
import ConfirmAutoUpdate from './ConfirmAutoUpdate'
import { authenticateUpdateUser, resetAuthUpdate } from "../../../appRedux/actions/Apk";
import { Markup } from 'interweave';
import { Redirect } from 'react-router-dom';
import { BASE_URL } from '../../../constants/Application.js';
import {
    APP_MANAGE_APKs,
    APP_MANAGE_POLICY,
    APP_SECURE_MARKET,
    APP_DOWNLOAD_TOOLS,
    APP_SECURE_PANEL_APK,

    APP_MD_01,
    APP_MD_02,
    APP_MD_03,
    APP_MD_04,
    APP_MP_01,
    APP_MP_02,
    APP_SM_01,
    APP_SM_02,
    APP_SM_03,
    APP_DT_01,
    APP_SPA_01,
    APP_SPA_02,

    APP_ADD_MORE,

    DT_MODAL_HEADING,
    DT_MODAL_BODY,
    DT_MODAL_BODY_7
} from '../../../constants/AppConstants';
import {
    Button_Open,
    Button_DOWNLOAD,
    Button_Ok,
    Button_Cancel
} from '../../../constants/ButtonConstants'


import {
    convertToLang
} from '../../utils/commonUtils'

class Apk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pwdConfirmModal: false,
            tools_modal: false,
        }
    }
    showToolsModal = () => {
        this.setState({
            tools_modal: true,
        });
    };

    handleOk = e => {
        this.setState({
            tools_modal: false,
        });
    };

    handleCancel = e => {
        this.setState({
            tools_modal: false,
        });
    };


    showPwdConfirmModal = (value) => {
        this.setState({
            pwdConfirmModal: value
        })
    }

    render() {
        if (this.props.authUpdateUser) {
            this.props.resetAuthUpdate()
            return (
                <Redirect to={{
                    pathname: '/apk-list/autoupdate',
                    state: { id: this.props.user.id }
                }} />
            )


        }
        else {

            return (
                <div>
                    <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <p className="hidden-xs" style={{ color: '#fff', lineHeight: '30px' }}>Download latest version of the App here</p>
                        <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.75.apk">
                            <Button type="primary" size="default" style={{ margin: '0 16px', height: 30, lineHeight: '30px' }}> ScreenLocker apk (v4.75)</Button>
                        </a> */}
                    </Row>
                    <div style={{ marginTop: -60 }}>
                        <Row>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="/apk-list">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_MANAGE_APKs], APP_MANAGE_APKs)} </h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0 0px' }}>
                                                    <Col span={8} className="" style={{ textAlign: "center" }}>
                                                        <Icon type="android" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16} style={{ padding: 0 }}>
                                                        <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_01], APP_MD_01)} </h5>
                                                        <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_02], APP_MD_02)} </h5>
                                                        {(this.props.user.type === 'admin') ?
                                                            (<Fragment>
                                                                <h5><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_03], APP_MD_03)} </h5>
                                                                <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span> {convertToLang(this.props.translation[APP_MD_04], APP_MD_04)} </h5>
                                                                <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                            </Fragment>
                                                            )
                                                            :
                                                            (
                                                                <Fragment>
                                                                    <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                                </Fragment>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="/policy">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_MANAGE_POLICY], APP_MANAGE_POLICY)} </h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0px 0px' }}>
                                                    <Col span={8} style={{ textAlign: "center" }}>
                                                        <Icon type="file-text" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16} style={{ padding: 0 }}>
                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_MP_01], APP_MP_01)}</h5>
                                                        <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_MP_02], APP_MP_02)}</h5>
                                                        <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <div>
                                        <Link to="/app-market">
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div className="image_1">
                                                    <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_SECURE_MARKET], APP_SECURE_MARKET)} </h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0px 0px' }}>
                                                        <Col span={8} style={{ textAlign: "center" }}>
                                                            <Icon type="appstore" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_SM_01], APP_SM_01)}</h5>
                                                            <h5> {convertToLang(this.props.translation[APP_SM_02], APP_SM_02)}</h5>
                                                            <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[APP_SM_03], APP_SM_03)}</h5>
                                                            <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                            {/* never ever delete this commented code :P */}
                            {/* <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <div>
                                        <Link to="#" onClick={() => {
                                            this.showPwdConfirmModal(true)
                                        }}>
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div className="image_1">
                                                    <h2 style={{ textAlign: "center" }}>AUTO UPDATE APPS</h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0px 0px' }}>
                                                        <Col span={8} style={{ textAlign: "center" }}>
                                                            <Icon type="android" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Add/remove apps </h5>
                                                            <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span> Edit Apps </h5>
                                                            <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Col> */}
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="#" onClick={() => this.showToolsModal()}>
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_DOWNLOAD_TOOLS], APP_DOWNLOAD_TOOLS)} </h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0 0px' }}>
                                                    <Col span={8} className="" style={{ textAlign: "center" }}>
                                                        <Icon type="tool" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16} style={{ padding: 0 }}>
                                                        <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                            <Markup content={convertToLang(this.props.translation[APP_DT_01], APP_DT_01)} />
                                                            {/* {convertToLang(this.props.translation[APP_DT_01], APP_DT_01)} */}
                                                        </h5>
                                                        <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                    </Link>
                                </div>
                                <Modal
                                    title={convertToLang(this.props.translation[DT_MODAL_HEADING], DT_MODAL_HEADING)} //"Download Tools"
                                    visible={this.state.tools_modal}
                                    onOk={this.handleOk}
                                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                                    onCancel={this.handleCancel}
                                    className="d_tool_pup"
                                    width="42%"
                                    centered
                                >
                                    <Row className="d_t_m">
                                        <h4 style={{ lineHeight: '30px', marginBottom: 0 }}><Markup content={convertToLang(this.props.translation[DT_MODAL_BODY], DT_MODAL_BODY)} ></Markup></h4>
                                        <a href={`${BASE_URL}users/getFile/nlbyod.apk`}>
                                            <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                                {convertToLang(this.props.translation[Button_DOWNLOAD], Button_DOWNLOAD)}
                                            </Button>
                                        </a>
                                    </Row>
                                    <Row className="d_t_m">
                                        <h4 style={{ lineHeight: '30px', marginBottom: 0 }}><Markup content={convertToLang(this.props.translation[DT_MODAL_BODY_7], DT_MODAL_BODY_7)} ></Markup></h4>
                                        <a href={`${BASE_URL}users/getFile/nlbyod7.apk`}>
                                            <Button type="primary" size="default" style={{ margin: '0 0 0 16px', height: 30, lineHeight: '30px' }}>
                                                {convertToLang(this.props.translation[Button_DOWNLOAD], Button_DOWNLOAD)}
                                            </Button>
                                        </a>
                                    </Row>
                                </Modal>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="#">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}> {convertToLang(this.props.translation[APP_SECURE_PANEL_APK], APP_SECURE_PANEL_APK)} </h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0 0px' }}>
                                                    <Col span={8} className="" style={{ textAlign: "center" }}>
                                                        <Icon type="idcard" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16}>
                                                        <h5 style={{ display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                            <Markup content={convertToLang(this.props.translation[APP_SPA_01], APP_SPA_01)} />
                                                        </h5>
                                                        <h5 style={{ marginBottom: 0, display: 'inline-flex' }}><span className="diamond_icon">&#9670;</span>
                                                            <Markup content={convertToLang(this.props.translation[APP_SPA_02], APP_SPA_02)} />
                                                        </h5>
                                                        <h5 className="more_txt"> {convertToLang(this.props.translation[APP_ADD_MORE], APP_ADD_MORE)} </h5>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn"> {convertToLang(this.props.translation[Button_Open], Button_Open)} </Button>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {/* never ever delete this commented code :P */}
                    {/* <Modal
                        maskClosable={false}
                        style={{ top: 20 }}
                        className="push_app"
                        title="AUTO UPDATE USER CREDENTIALS"
                        visible={this.state.pwdConfirmModal}
                        footer={false}
                        onOk={() => {
                        }}
                        onCancel={() => {
                            this.showPwdConfirmModal(false)
                            // this.refs.pswdForm.resetFields()
                        }
                        }
                        okText="Confirm"
                    >
                        <ConfirmAutoUpdate
                            hideModel={this.showPwdConfirmModal}
                            checkCredentials={this.props.authenticateUpdateUser}
                        />

                    </Modal > */}
                </div>
            )
        }
    }
}

const mapStateToProps = ({ apk_list, auth, settings }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        authUpdateUser: apk_list.authenticateUpdateUser,
        user: auth.authUser,
        translation: settings.translation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getApkList: getApkList,
        authenticateUpdateUser: authenticateUpdateUser,
        resetAuthUpdate: resetAuthUpdate

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Apk)