
import React, { Component } from 'react';
import { connect } from "react-redux";
import { updatePassword } from "../../appRedux/actions/Dealers";
import { updateUserProfile } from "../../appRedux/actions/Auth";
import { Row, Col, Card, Table, Button, Divider, Icon } from 'antd';
import ChangePassword from './components/changePassword';
import ChangeProfile from './components/change_profile';
import BASE_URL from '../../constants/Application';
import Customizer1 from './components/Customizer';
import styles from './components/profile.css';
import {
    SDEEALER
} from "../../constants/Constants";

// import {Link} from 'react-router-dom';

class Profile extends Component {

    callChild = () => {
        this.refs.Customize33.toggleCustomizer();
    }

    render() {
        let columnData = null
        let commonColumns = [
            {
                key: 1,
                name: <a>Dealer ID</a>,
                value: this.props.profile.id,
            },{
                key: 2,
                name: <a>Dealer Pin</a>,
                value: (this.props.profile.dealer_pin) ? this.props.profile.dealer_pin : 'N/A',
            },
            {
                key: 3,
                name: <a>Dealer Name</a>,
                value: this.props.profile.name,
            },
            {
                key: 4,
                name: <a>Login Email</a>,
                value: this.props.profile.email,
            },
            {
                key: 5,
                name: <a>Devices</a>,
                value: this.props.profile.connected_dealer,
            }
        ]

        if(this.props.profile.type === SDEEALER){
            columnData = {
                key: 6,
                name: <a>Parent Dealer</a>,
                value: (this.props.profile.connected_dealer==0)?"N/A": this.props.profile.connected_dealer,
            }
        }
        let dataSource=[];
        if(columnData!=null){

            dataSource = commonColumns;
            dataSource.push(columnData);
            dataSource.push({
                key: 7,
                name: <a>Token</a>,
                value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
            });

        } else {
            dataSource = [
                ...commonColumns,
                {
                    key: 7,
                    name: <a>Token</a>,
                    value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
                }
            ];
        }
        console.log('datasource', dataSource);

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: 'dealer_info'
        }, {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            className: 'dealer_value'
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
                                <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={24}>
                                                <h2 style={{ textAlign: "center" }}>Profile info</h2>
                                            </Col>
                                        </Row>
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}></Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                    <div>
                                        <Row>
                                            <Col span={24} style={{ textAlign: "center" }}>
                                                <h2 style={{ textAlign: "center", marginBottom: 0 }}>Edit Profile  <a style={{ float: "right", fontSize: 15, lineHeight: '25px' }} onClick={() => this.refs.change_profile.showModal()} >Edit</a></h2>

                                            </Col>
                                        </Row>
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
                                        <Row justify='center' style={{ marginTop: 45 }}>
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