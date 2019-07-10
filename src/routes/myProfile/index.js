
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomScrollbars from "../../util/CustomScrollbars";

import { updatePassword } from "../../appRedux/actions/Dealers";
import { updateUserProfile, twoFactorAuth, getLoginHistory } from "../../appRedux/actions/Auth";
import { Row, Col, Card, Table, Button, Divider, Icon, Modal, Switch, Input } from 'antd';
import ChangePassword from './components/changePassword';
import ChangeProfile from './components/change_profile';
import BASE_URL from '../../constants/Application';
import Customizer1 from './components/Customizer';
import styles from './components/profile.css';
import { componentSearch, getFormattedDate, convertToLang } from '../utils/commonUtils';
import {
    SDEALER, Login_Email, DEVICES, Name, Value, Profile_Info, Edit_Profile, Edit_Profile_02, Edit_Profile_03, Edit_Profile_01, Change_Password, Change_Email, Login_Email_Authentication, Date_Text
} from "../../constants/Constants";
import { DEALER_ID, DEALER_NAME, Parent_Dealer, DEALER_TOKENS, Login_History, DEALER_PIN } from '../../constants/DealerConstants';
import { Button_Edit, Button_Cancel, Button_Open, Button_Ok } from '../../constants/ButtonConstants';
import { IP_ADDRESS } from '../../constants/DeviceConstants';

// import {Link} from 'react-router-dom';

class Profile extends Component {

    state = {
        visible: false,
        historyModel: false
    }
    showModal1 = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    callChild = () => {
        this.refs.Customize33.toggleCustomizer();
    }
    twoFactorAuth = (e) => {
        this.props.twoFactorAuth(e);
    }

    showLoginHistory = () => {
        this.setState({
            historyModel: true
        })
    }

    handleCancelHistory = () => {
        this.setState({
            historyModel: false
        })
    }
    componentDidMount = () => {
        this.props.getLoginHistory()
    }
    renderList = (history) => {
        let data = history.map((data, index) => {
            if (data.ip_address.substr(0, 7) == "::ffff:") {
                data.ip_address = data.ip_address.substr(7)
            }
            if (index == 0) {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address + ' (CURRENT)',
                    changed_time: getFormattedDate(data.created_at)
                }
            } else if (index == 1) {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address + " (LAST)",
                    changed_time: getFormattedDate(data.created_at)
                }
            } else {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address,
                    changed_time: getFormattedDate(data.created_at)
                }

            }
        })

        return data;
    }

    render() {
        // console.log(this.props.loginHistory);
        let columnData = null
        let commonColumns = [
            {
                key: 1,
                name: <a> {convertToLang(this.props.translation[DEALER_ID], DEALER_ID)} </a>,
                value: this.props.profile.id,
            }, {
                key: 2,
                name: <a>{convertToLang(this.props.translation[DEALER_PIN], DEALER_PIN)}</a>,
                value: (this.props.profile.dealer_pin) ? this.props.profile.dealer_pin : 'N/A',
            },
            {
                key: 3,
                name: <a>{convertToLang(this.props.translation[DEALER_NAME], DEALER_NAME)} </a>,
                value: this.props.profile.name,
            },
            {
                key: 4,
                name: <a>{convertToLang(this.props.translation[Login_Email], Login_Email)}</a>,
                value: this.props.profile.email,
            },
            {
                key: 5,
                name: <a>{convertToLang(this.props.translation[DEVICES], DEVICES)}</a>,
                value: this.props.profile.type == 'admin' ? 'All' : this.props.profile.connected_devices,
            },
        ]

        if (this.props.profile.type === SDEALER) {
            columnData = {
                key: 6,
                name: <a>{convertToLang(this.props.translation[Parent_Dealer], Parent_Dealer)}</a>,
                value: (this.props.profile.connected_dealer == 0) ? "N/A" : this.props.profile.connected_dealer,
            }
        }
        let dataSource = [];
        if (columnData !== null) {

            dataSource = commonColumns;
            dataSource.push(columnData);
            dataSource.push({
                key: 7,
                name: <a>{convertToLang(this.props.translation[DEALER_TOKENS], DEALER_TOKENS)}</a>,
                value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
            });

        } else {
            dataSource = [
                ...commonColumns,
                {
                    key: 7,
                    name: <a>{convertToLang(this.props.translation[DEALER_TOKENS], DEALER_TOKENS)}</a>,
                    value: (this.props.profile.dealer_token) ? this.props.profile.dealer_token : 'N/A',
                },
                {
                    key: 6,
                    name: <a>{convertToLang(this.props.translation[Login_History], Login_History)}</a>,
                    value: <Button size="small" type='primary' onClick={() => { this.showLoginHistory() }} > {convertToLang(this.props.translation[Button_Open], Button_Open)}  </Button>,
                }

            ];
        }
        // console.log('datasource', dataSource);

        const columns = [{
            title: convertToLang(this.props.translation[Name], Name),
            dataIndex: 'name',
            key: 'name',
            className: 'dealer_info'
        }, {
            title: convertToLang(this.props.translation[Value], Value),
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
                                <Card className="manage_sec_pro height_auto" style={{ borderRadius: 12 }}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={24}>
                                                <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[Profile_Info], Profile_Info)}</h2>
                                            </Col>
                                        </Row>
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}></Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <a onClick={this.showModal1}>
                                    <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[Edit_Profile], Edit_Profile)}</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={8} className="text-center ">
                                                    {/* <Icon type="file-text" className="policy_icon" /> */}
                                                    <img src={require("assets/images/profile-image.png")} className="mb-8"></img>
                                                    <h1 className="mb-0">{this.props.profile.name}</h1>
                                                    <p>({this.props.profile.type})</p>
                                                </Col>
                                                <Col span={16} style={{ padding: 0, marginTop: 12 }}>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_01], Edit_Profile_01)}</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_02], Edit_Profile_02)}</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_03], Edit_Profile_03)}  </h5>
                                                    {/* <h5 className="more_txt">and more...</h5> */}
                                                </Col>
                                            </Row>
                                            {/* <Row justify='center'>
                                                <Col span={6}>
                                                </Col>
                                                <Col span={12} style={{ padding: "", marginTop: 0 }}>
                                                </Col>
                                            </Row> */}

                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn open_btn1">{convertToLang(this.props.translation[Button_Open], Button_Open)}</Button>
                                </a>
                            </div>
                            <Modal
                                maskClosable={false}
                                title={<div>{convertToLang(this.props.translation[Edit_Profile], Edit_Profile)} <a className="edit_a_tag" onClick={() => this.refs.change_profile.showModal()} >{convertToLang(this.props.translation[Button_Edit], Button_Edit)}</a></div>}
                                visible={this.state.visible}
                                onOk={this.handleOk1}
                                onCancel={this.handleCancel1}
                                footer={false}
                                okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                            >
                                <Row justify='center' style={{}}>
                                    <Col span={12} style={{ padding: "0 16px 0" }} className="change_pass">
                                        <Button type="primary" size="small" style={{ width: "100%" }}
                                            onClick={() => this.refs.change_password.showModal()} icon="unlock">{convertToLang(this.props.translation[Change_Password], Change_Password)}</Button>
                                    </Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12} style={{ padding: "16px 16px 0 " }} className="change_email">
                                        <Button disabled size="small" type="primary" style={{ width: "100%" }} icon="mail">{convertToLang(this.props.translation[Change_Email], Change_Email)}</Button>
                                    </Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={12} style={{ padding: "16px 16px 0 " }}>
                                        <h3>{convertToLang(this.props.translation[Login_Email_Authentication], Login_Email_Authentication)}</h3>
                                    </Col>
                                    <Col span={6} style={{ padding: "16px 16px 0 " }}>
                                        <Switch
                                            checkedChildren="ON"
                                            unCheckedChildren="OFF"
                                            defaultChecked={(this.props.profile.two_factor_auth === 1 || this.props.profile.two_factor_auth === true) ? true : false}
                                            onChange={(e) => {
                                                this.twoFactorAuth(e);
                                            }} />
                                    </Col>
                                </Row>
                            </Modal>
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
                    translation={this.props.translation}
                />

                <Modal
                    maskClosable={false}
                    title={<div>{convertToLang(this.props.translation[Login_History], Login_History)} </div>}
                    visible={this.state.historyModel}
                    onOk={this.handleOk1}
                    onCancel={this.handleCancelHistory}
                    className="login_history"
                    centered
                    footer={false}
                    //bodyStyle={{ height: 500, overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    <Fragment>
                        {/* <div className="row">
                            <div className="col-md-12">
                                <Input.Search
                                    name="imei1"
                                    key="imei1"
                                    id="imei1"
                                    className="search_heading1"
                                    onKeyUp={
                                        (e) => {
                                            this.handleComponentSearch(e, 'imei1')
                                        }
                                    }
                                    autoComplete="new-password"
                                    placeholder="Search"
                                />
                            </div>
                        </div> */}
                        <div className="overflow_table">
                            <Table
                                columns={[
                                    {
                                        title: '#',
                                        align: "center",
                                        dataIndex: 'tableIndex',
                                        key: "tableIndex",
                                        className: '',
                                        sorter: (a, b) => { return a.tableIndex - b.tableIndex },
                                        sortDirections: ['ascend', 'descend'],

                                    },
                                    {
                                        title: convertToLang(this.props.translation[IP_ADDRESS], IP_ADDRESS),
                                        align: "center",
                                        dataIndex: 'imei',
                                        key: "imei",
                                        className: '',
                                        sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                        sortDirections: ['ascend', 'descend'],

                                    },
                                    {
                                        title: convertToLang(this.props.translation[Date_Text], Date_Text),
                                        align: "center",
                                        dataIndex: 'changed_time',
                                        key: "changed_time",
                                        className: '',
                                        sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                        sortDirections: ['ascend', 'descend'],

                                    },
                                ]}
                                bordered
                                dataSource={this.renderList(this.props.loginHistory)}
                                pagination={false}
                            />
                        </div>
                    </Fragment>

                </Modal>

            </div>
        )
    }
}

var matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        twoFactorAuth: twoFactorAuth,
        updatePassword, updateUserProfile,
        getLoginHistory: getLoginHistory
    }, dispatch);
}

var mapStateToProps = ({ auth, settings }) => {
    // console.log("mapStateToProps");
    // console.log('ooo', state.auth);
    // console.log(auth.authUser);
    return {
        profile: auth.authUser,
        loginHistory: auth.loginHistory,
        translation: settings.translation
    };
}


export default connect(mapStateToProps, matchDispatchToProps)(Profile)