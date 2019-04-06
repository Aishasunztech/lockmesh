import React, { Component } from 'react';
import { Row, Col, Card, Table, Button, Divider } from 'antd';

export default class Apk extends Component {

    render() {

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 50 }}>
                </Row>
                <div style={{ marginTop: -60 }}>
                    <Row>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div>
                                <Card style={{ borderRadius: 12 }}>
                                    <div>
                                        <h1>Your Profile</h1>
                                        <Divider className="mb-0" />
                                        <Row style={{ padding: 16 }}>
                                            <Col span={9} style={{ padding: 0, textAlign: "center" }}>
                                                <img src={require("../../../assets/images/profile-image.png")} style={{ height: 'auto', width: '100%', borderRadius: 50 }} />
                                            </Col>
                                            <Col span={15}>
                                                <h1>trd</h1>

                                                <p>tref</p>
                                            </Col>
                                        </Row>
                                        <Row justify='center'>
                                            <Col span={12} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                                <Button type="primary" style={{ width: "100%" }}
                                                 //   onClick={() => this.refs.change_password.showModal()}
                                                    icon="unlock">Change Password</Button>
                                            </Col>
                                            <Col span={12} style={{ padding: "0px 16px 0px 8px" }} className="change_email">
                                                <Button disabled type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>
                                            </Col>
                                        </Row>

                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <div>
                                <Card style={{ borderRadius: 12 }}>
                                    <div>
                                        <h1>Your Profile</h1>
                                        <Divider className="mb-0" />
                                        <Row style={{ padding: 16 }}>
                                            <Col span={9} style={{ padding: 0, textAlign: "center" }}>
                                                <img src={require("../../../assets/images/profile-image.png")} style={{ height: 'auto', width: '100%', borderRadius: 50 }} />
                                            </Col>
                                            <Col span={15}>
                                                <h1>trd</h1>

                                                <p>tref</p>
                                            </Col>
                                        </Row>
                                        <Row justify='center'>
                                            <Col span={12} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                                <Button type="primary" style={{ width: "100%" }}
                                                 //   onClick={() => this.refs.change_password.showModal()}
                                                    icon="unlock">Change Password</Button>
                                            </Col>
                                            <Col span={12} style={{ padding: "0px 16px 0px 8px" }} className="change_email">
                                                <Button disabled type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>
                                            </Col>
                                        </Row>

                                    </div>
                                </Card>
                            </div>
                        </Col>

                    </Row>
                </div>

            </div>
        )
    }
}
