import React, { Component } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon } from 'antd';
import { Link } from "react-router-dom";
import styles from './app.css'
export default class Apk extends Component {

    render() {

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 35, display: 'flex', justifyContent: 'flex-end' }}>
                    <p style={{ color: '#fff', lineHeight: '30px' }}>Download latest version of the App here</p>
                    <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.45.apk">
                        <Button type="primary" size="default" style={{ margin: '0 16px', height: 30, lineHeight: '30px' }}> ScreenLocker apk (v4.45)</Button>
                    </a>
                </Row>
                <div style={{ marginTop: -60 }}>
                    <Row>
                        <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                            <div>
                                <Link to="/apk-list">
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>Manage App</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0 0px' }}>
                                                <Col span={7} className="" style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="android" className="and_icon" />
                                                </Col>
                                                <Col span={15}>
                                                    <h5 style={{ position: 'relative', right: 16 }}>Upload apk</h5>
                                                    <h5 style={{ position: 'relative', right: 0 }}>Manage apk's</h5>
                                                    <h5 style={{ position: 'relative', right: 6 }}>Activate apk push</h5>
                                                    <h5 style={{ position: 'relative', right: 22 }}>Set apk Dealer permissions</h5>
                                                    <h5 style={{ position: 'relative', right: 65 }}>and more...</h5>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={10} style={{ padding: "0px 8px 0px 16px" }} >
                                                    
                                                </Col>
                                                <Col span={8} style={{ padding: "0px 16px 0px 8px" }}>
                                                    <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                            <div>
                                <Link to="/policy">
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>Manage Policy</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={7} style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="file-text" className="policy_icon" />
                                                </Col>
                                                <Col span={15}>
                                                    <h5 style={{ position: 'relative', right: 16 }}>Creat/Edit Policies</h5>
                                                    <h5 style={{ position: 'relative', right: 0 }}>Set Policy  Permission</h5>
                                                    <h5 style={{ position: 'relative', right: 4 }}>and more...</h5>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={10} style={{ padding: "0px 8px 0px 16px" }}>
                                                </Col>
                                                <Col span={8} style={{ padding: "0px 16px 0px 8px", marginTop: 42 }}>
                                                    <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={7} lg={7} xl={7}>
                            <div>
                                <Link to="/policy">
                                    <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>App Market</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={7} style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="appstore" className="policy_icon"/>
                                                </Col>
                                                <Col span={15}>
                                                    <h5 style={{ position: 'relative', right: 16 }}>Add/remove apps in Secure Market</h5>
                                                    <h5 style={{ position: 'relative', right: 0 }}>set permissions</h5>
                                                    <h5 style={{ position: 'relative', right: 4 }}>and more...</h5>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={10} style={{ padding: "0px 8px 0px 16px" }}>
                                                </Col>
                                                <Col span={8} style={{ padding: "0px 16px 0px 8px", marginTop: 42 }}>
                                                    <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
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
