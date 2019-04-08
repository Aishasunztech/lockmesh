import React, { Component } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon } from 'antd';
import { Link } from "react-router-dom";
import styles from './app.css'
export default class Apk extends Component {

    render() {

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 35, display: 'flex', justifyContent: 'flex-end' }}>
                    <p style={{ color: '#fff' }}>Download latest version of the App here</p>
                    <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.45.apk">
                        <Button type="primary" size="small" style={{ margin: '0 16px' }}> ScreenLocker apk (v4.45)</Button>
                    </a>
                </Row>
                <div style={{ marginTop: -60 }}>
                    <Row>
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <Link to="/apk-list">
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h1>Manage App</h1>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0 6px' }}>
                                                <Col span={6} className="" style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="android" className="and_icon" />
                                                </Col>
                                                <Col span={15}>
                                                    <h4 style={{ position: 'relative', right: 16 }}>Upload apk</h4>
                                                    <h4 style={{ position: 'relative', right: 0 }}>Manage apk's</h4>
                                                    <h4 style={{ position: 'relative', right: 6 }}>activate apk push</h4>
                                                    <h4 style={{ position: 'relative', right: 22 }}>set apk Dealer permissions</h4>
                                                    <h4 style={{ position: 'relative', right: 65 }}>and more...</h4>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={10} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                                    {/* <Button type="primary" style={{ width: "100%" }}
                                                 //   onClick={() => this.refs.change_password.showModal()}
                                                    icon="unlock">Change Password</Button> */}
                                                </Col>
                                                <Col span={10} style={{ padding: "0px 16px 0px 8px" }} className="change_email">
                                                    <Button type="primary" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                            <div>
                                <Link to="/policy">
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h1>Manage Policy</h1>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={6} style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="file-text" className="policy_icon" />
                                                </Col>
                                                <Col span={15}>
                                                    <h4 style={{ position: 'relative', right: 16 }}>Creat/Edit Policies</h4>
                                                    <h4 style={{ position: 'relative', right: 0 }}>Set Policy  Permission</h4>
                                                    <h4 style={{ position: 'relative', right: 4 }}>and more...</h4>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={10} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                                    {/* <Button type="primary" style={{ width: "100%" }}
                                                 //   onClick={() => this.refs.change_password.showModal()}
                                                    icon="unlock">Change Password</Button> */}
                                                </Col>
                                                <Col span={10} style={{ padding: "0px 16px 0px 8px", marginTop:48}} className="change_email">
                                                    <Button type="primary" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </Col>

                    </Row>
                </div>

            </div>
        )
    }
}
