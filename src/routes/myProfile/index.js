
import React, { Component } from 'react';
import { connect } from "react-redux";
import { updatePassword } from "../../appRedux/actions/Dealers";
import { updateUserProfile } from "../../appRedux/actions/Auth";
import { Row, Col, Card, Table, Button, Divider, Icon } from 'antd';
import ChangePassword from './components/changePassword';
import ChangeProfile from './components/change_profile';
import BASE_URL from '../../constants/Application';
import Customizer1 from './components/Customizer';

// import {Link} from 'react-router-dom';

class Profile extends Component {

    callChild= () => {
        this.refs.Customize33.toggleCustomizer();
    }

    render() {
        const dataSource = [
            {
                key: 1,
                name: 'Dealer ID',
                value: this.props.profile.id,
            },
            {
                key: 2,
                name: 'Dealer Name',
                value: this.props.profile.name

            },
            {
                key: 3,
                name: 'Login Email',
                value: this.props.profile.email,
            },

            {
                key: 4,
                name: 'Dealer Pin',
                value: (this.props.profile.dealer_pin) ? this.props.profile.dealer_pin : 'N/A',
            },
            {
                key: 5,
                name: 'Dealers',
                value: this.props.profile.connected_dealer,
            },
            {
                key: 6,
                name: 'Token',
                value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
            }
        ];

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
        }];

        // console.log('uio', this.refs.Customizer.toggleCustomizer)

        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}>
                </Row>
                <div style={{ marginTop: -40 }}>
                    <Row>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={20}>
                                                <h2 style={{ textAlign: "center" }}>Detail</h2>
                                            </Col>
                                            <Col span={4} style={{ textAlign: "center" }}>
                                                <a onClick={() => this.refs.change_profile.showModal()} >Edit</a>
                                            </Col>
                                        </Row>
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}></Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card className="manage_sec" style={{ borderRadius: 12 }}>
                                    <div>
                                        <h2 style={{ textAlign: "center" }}>Profile</h2>
                                        <Divider className="mb-0" />
                                        <Row style={{ padding: '16px 0' }}>
                                            <Col span={8} style={{ textAlign: "center" }}>
                                                <img src={require("../../assets/images/profile-image.png")} style={{ height: 'auto', width: '100%', borderRadius: 50 }} />
                                            </Col>
                                            <Col span={16}>
                                                <h1>{this.props.profile.name}</h1>

                                                <p>({this.props.profile.type})</p>
                                            </Col>
                                        </Row>
                                        <Row justify='center' style={{ marginTop: 20 }}>
                                            <Col span={12} style={{ padding: "0px 8px 0px 16px" }} className="change_pass">
                                                <Button type="primary" size="small" style={{ width: "100%" }}
                                                    onClick={() => this.refs.change_password.showModal()} icon="unlock">Change Password</Button>
                                            </Col>
                                            <Col span={12} style={{ padding: "0px 16px 0px 8px" }} className="change_email">
                                                <Button disabled size="small" type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>
                                            </Col>
                                        </Row>

                                    </div>
                                </Card>
                            </div>
                        </Col>
                      <Customizer1 ref="Customize33" />
                    </Row>
                </div>
                <ChangePassword ref="change_password" profile={this.props.profile} func={this.props.updatePassword} />
                <ChangeProfile
                    ref="change_profile"
                    profile={this.props.profile}
                    func={this.props.updatePassword}
                    updateUserProfile={this.props.updateUserProfile}
                />
               
            </div>
        )
    }
}

var mapStateToProps = (state) => {
    // console.log("mapStateToProps");
    console.log('ooo', state.auth);

    return {
        isloading: state.isloading,
        profile: state.auth.authUser

    };
}


export default connect(mapStateToProps, { updatePassword, updateUserProfile })(Profile)