import React, { Component } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon } from 'antd';
import { Link } from "react-router-dom";
import styles from './app.css'
import { connect } from "react-redux";



class Apk extends Component {

    render() {

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                    <p className="hidden-xs" style={{ color: '#fff', lineHeight: '30px' }}>Download latest version of the App here</p>
                    <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.63.apk">
                        <Button type="primary" size="default" style={{ margin: '0 16px', height: 30, lineHeight: '30px' }}> ScreenLocker apk (v4.45)</Button>
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
                                                <Col span={8} className="" style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="android" className="and_icon" />
                                                </Col>
                                                {(this.props.user.type === 'admin') ?
                                                    <Col>
                                                        <h5 style={{ position: 'relative', right: 1 }}><span className="diamond_icon">&#9670;</span>Upload apk</h5>
                                                        <h5 style={{ position: 'relative', left: 12 }}><span className="diamond_icon">&#9670;</span>Manage apk's</h5>
                                                        <h5 style={{ position: 'relative', left: 10 }}><span className="diamond_icon">&#9670;</span>Activate apk push</h5>
                                                        <h5 style={{ position: 'relative', right: 4, marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Set apk Dealer permissions</h5>
                                                        <h5 style={{ position: 'relative', right: 35 }} className="more_txt">and more...</h5>
                                                    </Col> :
                                                    <Col>
                                                        <h5 style={{ position: 'relative', right: 1 }}><span className="diamond_icon">&#9670;</span>Upload apk</h5>
                                                        <h5 style={{ position: 'relative', left: 12 }}><span className="diamond_icon">&#9670;</span>Manage apk's</h5>
                                                        <h5 style={{ position: 'relative', right: 35 }} className="more_txt">and more...</h5>
                                                    </Col>}
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={6} >

                                                </Col>
                                                <Col span={12} style={{}}>
                                                    <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
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
                                                <Col span={8} style={{ padding: 0, textAlign: "right" }}>
                                                    <Icon type="file-text" className="policy_icon" />
                                                </Col>
                                                <Col span={15}>
                                                    <h5 style={{ position: 'relative', right: 16 }}><span className="diamond_icon">&#9670;</span>Creat/Edit Policies</h5>
                                                    <h5 style={{ position: 'relative', right: 0 }}><span className="diamond_icon">&#9670;</span>Set Policy  Permission</h5>
                                                    <h5 style={{ position: 'relative', right: 4 }} className="more_txt">and more...</h5>
                                                </Col>
                                            </Row>
                                            <Row justify='center'>
                                                <Col span={6}>
                                                </Col>
                                                <Col span={12} style={{ marginTop: 46 }}>
                                                    <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
                                                </Col>
                                            </Row>

                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        </Col>
                        {(this.props.user.type === 'admin') ?
                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                <div>
                                    <div className="contenar">
                                        <Link to="/#">
                                            <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                                <div className="image_1">
                                                    <h2 style={{ textAlign: "center" }}>App Market</h2>
                                                    <Divider className="mb-0" />
                                                    <Row style={{ padding: '12px 0px 0px' }}>
                                                        <Col span={8} style={{ padding: 0, textAlign: "right" }}>
                                                            <Icon type="appstore" className="policy_icon" />
                                                        </Col>
                                                        <Col span={15}>
                                                            <h5 style={{ position: 'relative', right: 12, marginBottom: 2 }}><span className="diamond_icon">&#9670;</span>Add/remove apps in </h5>
                                                            <h5 style={{ position: 'relative', left: 10 }}> Secure Market</h5>
                                                            <h5 style={{ position: 'relative', right: 2 }}><span className="diamond_icon">&#9670;</span>Set permissions</h5>
                                                            <h5 style={{ position: 'relative', right: 10 }} className="more_txt">and more...</h5>
                                                        </Col>
                                                    </Row>
                                                    <Row justify='center'>
                                                        <Col span={6}>
                                                        </Col>
                                                        <Col span={12} style={{ marginTop: 28 }}>
                                                            <Button type="primary" size="small" style={{ width: "100%" }}>Open</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                        </Link>
                                        <div className="middle">
                                            <div className="text text2">Coming Soon</div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            : ''}

                    </Row>
                </div >

            </div >
        )
    }
}
var mapStateToProps = ({ auth }) => {
    console.log('devices AUTH', auth.authUser);
    //  console.log('devices is', devices);
    return {
        user: auth.authUser,
    };
}

export default connect(mapStateToProps)(Apk)