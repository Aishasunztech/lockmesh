import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon, Modal } from 'antd';
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import styles from './app.css'
import { connect } from "react-redux";
import ConfirmAutoUpdate from './ConfirmAutoUpdate'
import { authenticateUpdateUser, resetAuthUpdate } from "../../../appRedux/actions/Apk";
import { Redirect } from 'react-router-dom';

class Apk extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pwdConfirmModal: false,
        }
    }


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
                        <p className="hidden-xs" style={{ color: '#fff', lineHeight: '30px' }}>Download latest version of the App here</p>
                        <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.75.apk">
                            <Button type="primary" size="default" style={{ margin: '0 16px', height: 30, lineHeight: '30px' }}> ScreenLocker apk (v4.75)</Button>
                        </a>
                    </Row>
                    <div style={{ marginTop: -40 }}>
                        <Row>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="/apk-list">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Manage App</h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0 0px' }}>
                                                    <Col span={8} className="" style={{ textAlign: "center" }}>
                                                        <Icon type="android" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16} style={{ padding: 0 }}>
                                                        <h5><span className="diamond_icon">&#9670;</span>Manage apk's</h5>
                                                        <h5><span className="diamond_icon">&#9670;</span>Add permssion</h5>
                                                        {(this.props.user.type === 'admin') ?
                                                            (<Fragment>
                                                                <h5><span className="diamond_icon">&#9670;</span>Activate apk push</h5>
                                                                <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Set apk Dealer permissions</h5>
                                                                <h5 className="more_txt">and more...</h5>
                                                            </Fragment>
                                                            )
                                                            :
                                                            (
                                                                <Fragment>
                                                                    <h5 className="more_txt">and more...</h5>
                                                                </Fragment>
                                                            )
                                                        }
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn">Open</Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <Link to="/policy">
                                        <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                            <div>
                                                <h2 style={{ textAlign: "center" }}>Manage Policy</h2>
                                                <Divider className="mb-0" />
                                                <Row style={{ padding: '12px 0px 0px' }}>
                                                    <Col span={8} style={{ textAlign: "center" }}>
                                                        <Icon type="file-text" className="policy_icon" />
                                                    </Col>
                                                    <Col span={16} style={{ padding: 0 }}>
                                                        <h5><span className="diamond_icon">&#9670;</span>Create/Edit Policies</h5>
                                                        <h5><span className="diamond_icon">&#9670;</span>Set Policy  Permission</h5>
                                                        <h5 className="more_txt">and more...</h5>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                        <Button type="primary" size="small" className="open_btn">Open</Button>
                                    </Link>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <div>
                                        <Link to="/app-market">
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div className="image_1">
                                                    <h2 style={{ textAlign: "center" }}>Secure Market</h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0px 0px' }}>
                                                        <Col span={8} style={{ textAlign: "center" }}>
                                                            <Icon type="appstore" className="policy_icon" />
                                                        </Col>
                                                        <Col span={16} style={{ padding: 0 }}>
                                                            <h5 style={{ marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Add/remove apps in </h5>
                                                            <h5> Secure Market</h5>
                                                            <h5><span className="diamond_icon">&#9670;</span>Set permissions</h5>
                                                            <h5 className="more_txt">and more...</h5>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn">Open</Button>
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
                                                            <h5 className="more_txt">and more...</h5>
                                                        </Col>
                                                    </Row>

                                                </div>
                                            </Card>
                                            <Button type="primary" size="small" className="open_btn">Open</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Col> */}
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

const mapStateToProps = ({ apk_list, auth }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        authUpdateUser: apk_list.authenticateUpdateUser,
        user: auth.authUser
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